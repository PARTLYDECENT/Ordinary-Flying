import { Bullet } from './bullet.js';

export class Player {
    constructor(mesh, scene, soundManager, camera) { // NEW: Added camera for screen shake
        this.mesh = mesh;
        this.scene = scene;
        this.soundManager = soundManager;
        this.camera = camera; // NEW: Store camera reference

        // --- Core Systems ---
        this.createThrusterEffects();
        this.createMuzzleFlashSystem();
        this.createAfterburnerTrails();
        this.createShieldGlow();

        // --- Combat & Movement ---
        this.bullets = [];
        this.bulletCooldown = 0;
        this.lastFireTime = 0;
        this.lastHitTime = 0; // NEW: Track when the player was last hit

        // --- Player Stats (NEW) ---
        this.health = 100;
        this.maxHealth = 100;
        this.shields = 150;
        this.maxShields = 150;
        this.shieldRegenRate = 15; // Shields per second
        this.shieldRegenDelay = 3000; // 3 seconds before regen starts
        this.boostFuel = 100;
        this.maxBoostFuel = 100;
        this.boostConsumptionRate = 35; // Fuel per second
        this.boostRegenRate = 10; // Fuel per second
        this.isDead = false;

        // --- Input Handling ---
        this.inputMap = {};
        window.addEventListener('keydown', (e) => this.inputMap[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.inputMap[e.key.toLowerCase()] = false);

        // --- Speed Properties ---
        this.baseSpeed = 15.0; // Increased base speed to feel better with deltaTime
        this.boostSpeed = 40.0;
        this.strafeSpeed = 10.0;
        this.rotationSpeed = 1.5; // Radians per second
        
        // Initial position
        this.mesh.position = new BABYLON.Vector3(0, 5, 0);
    }

    // --- All create...() methods like createThrusterEffects() go here. ---
    // (No changes to these methods, they are omitted for brevity)
    createThrusterEffects() { /* ... same as before ... */ }
    createMuzzleFlashSystem() { /* ... same as before ... */ }
    createAfterburnerTrails() { /* ... same as before ... */ }
    createShieldGlow() { /* ... same as before ... */ }


    // --- Core Update Loop ---
    update() {
        if (this.isDead) {
            // If dead, do nothing
            return;
        }

        const deltaTime = this.scene.getEngine().getDeltaTime() / 1000; // Convert to seconds
        
        this.handleMovement(deltaTime);
        this.handleWeapons(deltaTime);
        this.handleRegeneration(deltaTime); // NEW: Handle shield and fuel regen
        this.updateEffects(deltaTime); // NEW: Grouped effects updates
    }

    // --- NEW: Movement Handling ---
    handleMovement(deltaTime) {
        let isThrusting = false;
        let thrusterIntensityTarget = 0;
        let currentMoveSpeed = this.baseSpeed;

        // Afterburner logic
        if (this.inputMap['shift'] && this.boostFuel > 0) {
            currentMoveSpeed = this.boostSpeed;
            this.boostFuel -= this.boostConsumptionRate * deltaTime;
            thrusterIntensityTarget = 1.5; // Overdrive thrusters
            isThrusting = true;
        }

        // Forward / Backward Thrust
        if (this.inputMap['w']) {
            this.mesh.translate(BABYLON.Axis.Z, currentMoveSpeed * deltaTime, BABYLON.Space.LOCAL);
            isThrusting = true;
            if (thrusterIntensityTarget < 1.0) thrusterIntensityTarget = 1.0;
        }
        if (this.inputMap['s']) {
            this.mesh.translate(BABYLON.Axis.Z, -currentMoveSpeed * deltaTime, BABYLON.Space.LOCAL);
            isThrusting = true;
            thrusterIntensityTarget = 0.6;
        }

        // Strafe Left / Right
        if (this.inputMap['a']) {
            this.mesh.translate(BABYLON.Axis.X, -this.strafeSpeed * deltaTime, BABYLON.Space.LOCAL);
        }
        if (this.inputMap['d']) {
            this.mesh.translate(BABYLON.Axis.X, this.strafeSpeed * deltaTime, BABYLON.Space.LOCAL);
        }

        // Yaw (turn left/right)
        if (this.inputMap['q']) {
            this.mesh.rotate(BABYLON.Axis.Y, -this.rotationSpeed * deltaTime, BABYLON.Space.LOCAL);
        }
        if (this.inputMap['e']) {
            this.mesh.rotate(BABYLON.Axis.Y, this.rotationSpeed * deltaTime, BABYLON.Space.LOCAL);
        }

        // Pitch (up/down)
        if (this.inputMap['r']) {
            this.mesh.rotate(BABYLON.Axis.X, -this.rotationSpeed * deltaTime, BABYLON.Space.LOCAL);
        }
        if (this.inputMap['f']) {
            this.mesh.rotate(BABYLON.Axis.X, this.rotationSpeed * deltaTime, BABYLON.Space.LOCAL);
        }

        // Update thruster visual intensity
        this.thrusterIntensity += (thrusterIntensityTarget - this.thrusterIntensity) * deltaTime * 5.0;

        // Toggle thruster particle systems
        if (isThrusting && !this.thrusterSystem.isStarted()) {
            this.thrusterSystem.start();
            this.thrusterSystemOuter.start();
            this.sparksSystem.start();
            this.soundManager.playSound("engineSound");
        } else if (!isThrusting && this.thrusterSystem.isStarted()) {
            this.thrusterSystem.stop();
            this.thrusterSystemOuter.stop();
            this.sparksSystem.stop();
            this.soundManager.stopSound("engineSound");
        }
    }

    // --- NEW: Weapon Handling ---
    handleWeapons(deltaTime) {
        this.bulletCooldown -= deltaTime * 1000; // Cooldown is in ms

        if (this.inputMap[' ']) {
            this.fire();
        }
    }
    
    // --- NEW: Regeneration Logic ---
    handleRegeneration(deltaTime) {
        // Regenerate shields if not recently hit
        const timeSinceLastHit = Date.now() - this.lastHitTime;
        if (this.shields < this.maxShields && timeSinceLastHit > this.shieldRegenDelay) {
            this.shields += this.shieldRegenRate * deltaTime;
            this.shields = Math.min(this.shields, this.maxShields);
        }

        // Regenerate boost fuel if not boosting
        if (!this.inputMap['shift'] && this.boostFuel < this.maxBoostFuel) {
            this.boostFuel += this.boostRegenRate * deltaTime;
            this.boostFuel = Math.min(this.boostFuel, this.maxBoostFuel);
        }
    }

    // --- NEW: Grouped Visual Effects Update ---
    updateEffects(deltaTime) {
        // Update wing trails based on speed
        const speedRatio = this.thrusterIntensity / 1.5;
        if (speedRatio > 0.5) {
            if (!this.leftWingTrail.isStarted()) {
                this.leftWingTrail.start();
                this.rightWingTrail.start();
            }
            this.leftWingTrail.emitRate = speedRatio * 200;
            this.rightWingTrail.emitRate = speedRatio * 200;
        } else {
            this.leftWingTrail.stop();
            this.rightWingTrail.stop();
        }

        // Update shield glow
        const timeSinceLastFire = Date.now() - this.lastFireTime;
        const combatGlow = Math.max(0, 1 - (timeSinceLastFire / 3000));
        const totalGlow = Math.min(1, combatGlow + speedRatio + (this.shields / this.maxShields) * 0.5);
        this.shieldGlow.color1 = new BABYLON.Color4(0.2 * totalGlow, 0.4 * totalGlow, 0.8 * totalGlow, 0.1 * totalGlow);
        this.shieldGlow.emitRate = 50 + (totalGlow * 100);

        // Update bullets
        this.bullets.forEach(bullet => bullet.update());
    }

    fire() {
        if (this.bulletCooldown <= 0) {
            const bulletVelocity = this.mesh.getDirection(BABYLON.Axis.Z).scale(100);
            const bullet = new Bullet(this.scene, this.mesh.position.clone(), bulletVelocity);
            this.bullets.push(bullet);
            this.bulletCooldown = 150; // Faster fire rate
            this.lastFireTime = Date.now();
            this.muzzleFlash.start();
        }
    }

    // --- NEW: Take Damage Logic ---
    takeDamage(amount) {
        if (this.isDead) return;

        this.lastHitTime = Date.now();
        this.triggerScreenShake();

        // First, deplete shields
        if (this.shields > 0) {
            const damageToShields = Math.min(this.shields, amount);
            this.shields -= damageToShields;
            amount -= damageToShields;
        }

        // If any damage remains, apply to health
        if (amount > 0) {
            this.health -= amount;
        }

        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }

    // --- NEW: Death and Respawn ---
    die() {
        console.log("Player has been destroyed!");
        this.isDead = true;

        // Stop all sounds and effects
        this.thrusterSystem.stop();
        this.thrusterSystemOuter.stop();
        this.sparksSystem.stop();
        this.soundManager.stopSound("engineSound");
        
        // You could trigger a cool explosion effect here!
        // For now, we just hide the mesh.
        this.mesh.setEnabled(false);
    }
    
    respawn() {
        this.isDead = false;
        this.health = this.maxHealth;
        this.shields = this.maxShields;
        this.boostFuel = this.maxBoostFuel;
        this.mesh.position = new BABYLON.Vector3(0, 5, 0); // Reset position
        this.mesh.rotation = new BABYLON.Vector3(0, 0, 0); // Reset rotation
        this.mesh.setEnabled(true);
        console.log("Player respawned!");
    }
    
    // --- NEW: Screen Shake Effect ---
    triggerScreenShake() {
        const shakeIntensity = 0.075;
        const shakeDuration = 200; // in milliseconds

        const shake = new BABYLON.ScreenShake(this.camera);
        shake.shake(shakeIntensity, shakeDuration);
    }

    dispose() {
        // ... same as before ...
    }
}
