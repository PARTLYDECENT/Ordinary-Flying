import { Bullet } from './bullet.js';

export class Player {
    constructor(mesh, scene, soundManager) {
        this.mesh = mesh;
        this.scene = scene;
        this.soundManager = soundManager;
        this.mesh.position = new BABYLON.Vector3(0, 5, 0);

        // Enhanced thruster particles with multiple systems
        this.createThrusterEffects();
        
        // Muzzle flash system
        this.createMuzzleFlashSystem();
        
        // Afterburner trails
        this.createAfterburnerTrails();
        
        // Shield/hull glow effect
        this.createShieldGlow();

        // Shooting
        this.bullets = [];
        this.bulletCooldown = 0;
        this.thrusterIntensity = 0;
        this.lastFireTime = 0;

        // Keep track of input state here
        this.inputMap = {};
        window.addEventListener('keydown', (e) => this.inputMap[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.inputMap[e.key.toLowerCase()] = false);
    }

    createThrusterEffects() {
        // Main thruster system - blue plasma core
        this.thrusterSystem = new BABYLON.ParticleSystem("mainThrusters", 3000, this.scene);
        this.thrusterSystem.particleTexture = new BABYLON.Texture("textures/flare.png", this.scene);
        this.thrusterSystem.emitter = this.mesh;
        this.thrusterSystem.minEmitBox = new BABYLON.Vector3(-0.3, -0.3, -2.2);
        this.thrusterSystem.maxEmitBox = new BABYLON.Vector3(0.3, 0.3, -2.2);
        
        // Dynamic colors for plasma effect
        this.thrusterSystem.color1 = new BABYLON.Color4(0.1, 0.4, 1.0, 1.0);
        this.thrusterSystem.color2 = new BABYLON.Color4(0.8, 0.9, 1.0, 1.0);
        this.thrusterSystem.colorDead = new BABYLON.Color4(0.0, 0.1, 0.3, 0.0);
        
        this.thrusterSystem.minSize = 0.05;
        this.thrusterSystem.maxSize = 0.8;
        this.thrusterSystem.minLifeTime = 0.15;
        this.thrusterSystem.maxLifeTime = 0.45;
        this.thrusterSystem.emitRate = 800;
        this.thrusterSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.thrusterSystem.gravity = new BABYLON.Vector3(0, 0, 8);
        this.thrusterSystem.direction1 = new BABYLON.Vector3(-0.2, -0.2, 3);
        this.thrusterSystem.direction2 = new BABYLON.Vector3(0.2, 0.2, 8);
        this.thrusterSystem.minAngularSpeed = -Math.PI;
        this.thrusterSystem.maxAngularSpeed = Math.PI;

        // Secondary thruster system - orange/red outer flame
        this.thrusterSystemOuter = new BABYLON.ParticleSystem("outerThrusters", 2000, this.scene);
        this.thrusterSystemOuter.particleTexture = new BABYLON.Texture("textures/flare.png", this.scene);
        this.thrusterSystemOuter.emitter = this.mesh;
        this.thrusterSystemOuter.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -2.1);
        this.thrusterSystemOuter.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, -2.1);
        
        this.thrusterSystemOuter.color1 = new BABYLON.Color4(1.0, 0.6, 0.1, 0.8);
        this.thrusterSystemOuter.color2 = new BABYLON.Color4(1.0, 0.2, 0.0, 0.6);
        this.thrusterSystemOuter.colorDead = new BABYLON.Color4(0.2, 0.0, 0.0, 0.0);
        
        this.thrusterSystemOuter.minSize = 0.1;
        this.thrusterSystemOuter.maxSize = 1.2;
        this.thrusterSystemOuter.minLifeTime = 0.2;
        this.thrusterSystemOuter.maxLifeTime = 0.6;
        this.thrusterSystemOuter.emitRate = 600;
        this.thrusterSystemOuter.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.thrusterSystemOuter.gravity = new BABYLON.Vector3(0, 0, 6);
        this.thrusterSystemOuter.direction1 = new BABYLON.Vector3(-0.5, -0.5, 2);
        this.thrusterSystemOuter.direction2 = new BABYLON.Vector3(0.5, 0.5, 6);

        // Sparks system for extra detail
        this.sparksSystem = new BABYLON.ParticleSystem("thrusterSparks", 500, this.scene);
        this.sparksSystem.particleTexture = new BABYLON.Texture("textures/flare.png", this.scene);
        this.sparksSystem.emitter = this.mesh;
        this.sparksSystem.minEmitBox = new BABYLON.Vector3(-0.4, -0.4, -2.0);
        this.sparksSystem.maxEmitBox = new BABYLON.Vector3(0.4, 0.4, -2.0);
        
        this.sparksSystem.color1 = new BABYLON.Color4(1.0, 1.0, 0.8, 1.0);
        this.sparksSystem.color2 = new BABYLON.Color4(1.0, 0.8, 0.3, 1.0);
        this.sparksSystem.colorDead = new BABYLON.Color4(0.3, 0.1, 0.0, 0.0);
        
        this.sparksSystem.minSize = 0.02;
        this.sparksSystem.maxSize = 0.1;
        this.sparksSystem.minLifeTime = 0.1;
        this.sparksSystem.maxLifeTime = 0.3;
        this.sparksSystem.emitRate = 300;
        this.sparksSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.sparksSystem.gravity = new BABYLON.Vector3(0, 0, 10);
        this.sparksSystem.direction1 = new BABYLON.Vector3(-1, -1, 1);
        this.sparksSystem.direction2 = new BABYLON.Vector3(1, 1, 12);
    }

    createMuzzleFlashSystem() {
        // Muzzle flash effect
        this.muzzleFlash = new BABYLON.ParticleSystem("muzzleFlash", 200, this.scene);
        this.muzzleFlash.particleTexture = new BABYLON.Texture("textures/flare.png", this.scene);
        this.muzzleFlash.emitter = this.mesh;
        this.muzzleFlash.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, 2.5);
        this.muzzleFlash.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 2.5);
        
        this.muzzleFlash.color1 = new BABYLON.Color4(1.0, 1.0, 0.8, 1.0);
        this.muzzleFlash.color2 = new BABYLON.Color4(1.0, 0.6, 0.2, 1.0);
        this.muzzleFlash.colorDead = new BABYLON.Color4(0.2, 0.1, 0.0, 0.0);
        
        this.muzzleFlash.minSize = 0.2;
        this.muzzleFlash.maxSize = 0.8;
        this.muzzleFlash.minLifeTime = 0.05;
        this.muzzleFlash.maxLifeTime = 0.15;
        this.muzzleFlash.emitRate = 2000;
        this.muzzleFlash.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.muzzleFlash.gravity = new BABYLON.Vector3(0, 0, 0);
        this.muzzleFlash.direction1 = new BABYLON.Vector3(-0.5, -0.5, 0);
        this.muzzleFlash.direction2 = new BABYLON.Vector3(0.5, 0.5, 2);
        this.muzzleFlash.targetStopDuration = 0.1;
    }

    createAfterburnerTrails() {
        // Wing tip trails
        this.leftWingTrail = new BABYLON.ParticleSystem("leftWingTrail", 800, this.scene);
        this.leftWingTrail.particleTexture = new BABYLON.Texture("textures/flare.png", this.scene);
        this.leftWingTrail.emitter = this.mesh;
        this.leftWingTrail.minEmitBox = new BABYLON.Vector3(-2, 0, 0);
        this.leftWingTrail.maxEmitBox = new BABYLON.Vector3(-2, 0, 0);
        
        this.leftWingTrail.color1 = new BABYLON.Color4(0.3, 0.6, 1.0, 0.6);
        this.leftWingTrail.color2 = new BABYLON.Color4(0.1, 0.3, 0.8, 0.4);
        this.leftWingTrail.colorDead = new BABYLON.Color4(0.0, 0.1, 0.3, 0.0);
        
        this.leftWingTrail.minSize = 0.05;
        this.leftWingTrail.maxSize = 0.3;
        this.leftWingTrail.minLifeTime = 0.8;
        this.leftWingTrail.maxLifeTime = 1.5;
        this.leftWingTrail.emitRate = 150;
        this.leftWingTrail.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.leftWingTrail.gravity = new BABYLON.Vector3(0, 0, 1);
        this.leftWingTrail.direction1 = new BABYLON.Vector3(-0.1, -0.1, -1);
        this.leftWingTrail.direction2 = new BABYLON.Vector3(0.1, 0.1, -3);

        this.rightWingTrail = this.leftWingTrail.clone("rightWingTrail");
        this.rightWingTrail.minEmitBox = new BABYLON.Vector3(2, 0, 0);
        this.rightWingTrail.maxEmitBox = new BABYLON.Vector3(2, 0, 0);
    }

    createShieldGlow() {
        // Ambient energy field around ship
        this.shieldGlow = new BABYLON.ParticleSystem("shieldGlow", 400, this.scene);
        this.shieldGlow.particleTexture = new BABYLON.Texture("textures/flare.png", this.scene);
        this.shieldGlow.emitter = this.mesh;
        this.shieldGlow.minEmitBox = new BABYLON.Vector3(-1.5, -1.5, -1.5);
        this.shieldGlow.maxEmitBox = new BABYLON.Vector3(1.5, 1.5, 1.5);
        
        this.shieldGlow.color1 = new BABYLON.Color4(0.2, 0.4, 0.8, 0.1);
        this.shieldGlow.color2 = new BABYLON.Color4(0.1, 0.6, 1.0, 0.05);
        this.shieldGlow.colorDead = new BABYLON.Color4(0.0, 0.2, 0.4, 0.0);
        
        this.shieldGlow.minSize = 0.3;
        this.shieldGlow.maxSize = 1.0;
        this.shieldGlow.minLifeTime = 2.0;
        this.shieldGlow.maxLifeTime = 4.0;
        this.shieldGlow.emitRate = 50;
        this.shieldGlow.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.shieldGlow.gravity = new BABYLON.Vector3(0, 0, 0);
        this.shieldGlow.direction1 = new BABYLON.Vector3(-0.1, -0.1, -0.1);
        this.shieldGlow.direction2 = new BABYLON.Vector3(0.1, 0.1, 0.1);
        this.shieldGlow.start();
    }

    // Update method called every frame from the main loop
    update() {
        const deltaTime = this.scene.getEngine().getDeltaTime();
        this.bulletCooldown -= deltaTime;

        const moveSpeed = 0.8;
        const rotationSpeed = 0.05;

        let isThrusting = false;
        let thrusterIntensityTarget = 0;

        // Thrust
        if (this.inputMap['w']) {
            this.mesh.translate(BABYLON.Axis.Z, moveSpeed, BABYLON.Space.LOCAL);
            isThrusting = true;
            thrusterIntensityTarget = 1.0;
        }
        if (this.inputMap['s']) {
            this.mesh.translate(BABYLON.Axis.Z, -moveSpeed, BABYLON.Space.LOCAL);
            isThrusting = true;
            thrusterIntensityTarget = 0.6;
        }

        // Smooth thruster intensity transition
        this.thrusterIntensity += (thrusterIntensityTarget - this.thrusterIntensity) * deltaTime * 0.01;

        if (isThrusting) {
            if (!this.thrusterSystem.isStarted()) {
                this.thrusterSystem.start();
                this.thrusterSystemOuter.start();
                this.sparksSystem.start();
                this.leftWingTrail.start();
                this.rightWingTrail.start();
                this.soundManager.playSound("engineSound");
            }
            
            // Dynamic thruster effects based on intensity
            this.thrusterSystem.emitRate = 800 + (this.thrusterIntensity * 400);
            this.thrusterSystemOuter.emitRate = 600 + (this.thrusterIntensity * 300);
            this.sparksSystem.emitRate = 300 + (this.thrusterIntensity * 200);
            
            // Enhance colors at higher intensity
            const intensity = this.thrusterIntensity;
            this.thrusterSystem.color1 = new BABYLON.Color4(0.1 + intensity * 0.3, 0.4 + intensity * 0.4, 1.0, 1.0);
            this.thrusterSystemOuter.color1 = new BABYLON.Color4(1.0, 0.6 + intensity * 0.3, 0.1 + intensity * 0.2, 0.8 + intensity * 0.2);
        } else {
            if (this.thrusterSystem.isStarted()) {
                this.thrusterSystem.stop();
                this.thrusterSystemOuter.stop();
                this.sparksSystem.stop();
                this.leftWingTrail.stop();
                this.rightWingTrail.stop();
                this.soundManager.stopSound("engineSound");
            }
        }

        // Yaw (turn left/right)
        if (this.inputMap['a']) {
            this.mesh.rotate(BABYLON.Axis.Y, -rotationSpeed, BABYLON.Space.LOCAL);
        }
        if (this.inputMap['d']) {
            this.mesh.rotate(BABYLON.Axis.Y, rotationSpeed, BABYLON.Space.LOCAL);
        }

        // Pitch (up/down)
        if (this.inputMap['r']) {
            this.mesh.rotate(BABYLON.Axis.X, -rotationSpeed, BABYLON.Space.LOCAL);
        }
        if (this.inputMap['f']) {
            this.mesh.rotate(BABYLON.Axis.X, rotationSpeed, BABYLON.Space.LOCAL);
        }

        // Roll (left/right)
        if (this.inputMap['q']) {
            this.mesh.rotate(BABYLON.Axis.Z, -rotationSpeed, BABYLON.Space.LOCAL);
        }
        if (this.inputMap['e']) {
            this.mesh.rotate(BABYLON.Axis.Z, rotationSpeed, BABYLON.Space.LOCAL);
        }

        if (this.inputMap[' ']) {
            this.fire();
        }

        // Update shield glow intensity based on speed and recent activity
        const timeSinceLastFire = Date.now() - this.lastFireTime;
        const combatGlow = Math.max(0, 1 - (timeSinceLastFire / 3000)); // Fade over 3 seconds
        const speedGlow = this.thrusterIntensity * 0.5;
        const totalGlow = Math.min(1, combatGlow + speedGlow + 0.2); // Base glow of 0.2
        
        this.shieldGlow.color1 = new BABYLON.Color4(0.2 * totalGlow, 0.4 * totalGlow, 0.8 * totalGlow, 0.1 * totalGlow);
        this.shieldGlow.emitRate = 50 + (totalGlow * 100);

        this.bullets.forEach(bullet => bullet.update());
    }

    fire() {
        if (this.bulletCooldown <= 0) {
            const bulletVelocity = this.mesh.getDirection(BABYLON.Axis.Z).scale(2);
            const bullet = new Bullet(this.scene, this.mesh.position, bulletVelocity);
            this.bullets.push(bullet);
            this.bulletCooldown = 250; // 250ms cooldown
            this.lastFireTime = Date.now();
            
            // Trigger muzzle flash
            this.muzzleFlash.start();
            setTimeout(() => this.muzzleFlash.stop(), 100);
            
            // Brief screen shake effect could be added here if you have camera reference
        }
    }

    // Method to dispose all particle systems when player is destroyed
    dispose() {
        this.thrusterSystem.dispose();
        this.thrusterSystemOuter.dispose();
        this.sparksSystem.dispose();
        this.muzzleFlash.dispose();
        this.leftWingTrail.dispose();
        this.rightWingTrail.dispose();
        this.shieldGlow.dispose();
    }
}
