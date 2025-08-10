
```javascript
import { Bullet } from './bullet.js';

export class Player {
    constructor(mesh, scene, soundManager, camera) {
        this.mesh = mesh;
        this.scene = scene;
        this.soundManager = soundManager;
        this.camera = camera;
        this.mesh.position = new BABYLON.Vector3(0, 5, 0);

        // Enhanced thruster particles with multiple systems
        this.createThrusterEffects();
        
        // Muzzle flash system
        this.createMuzzleFlashSystem();
        
        // Afterburner trails
        this.createAfterburnerTrails();
        
        // Shield/hull glow effect
        this.createShieldGlow();
        
        // Explosion effects for impacts
        this.createImpactEffects();

        // Shooting mechanics
        this.bullets = [];
        this.bulletPool = [];
        this.bulletCooldown = 0;
        this.thrusterIntensity = 0;
        this.lastFireTime = 0;
        this.isOverheated = false;
        this.heatLevel = 0;
        this.comboMultiplier = 1;
        this.comboTimer = 0;
        this.energyLevel = 100;
        this.specialWeaponReady = true;
        
        // Screen shake effect
        this.shakeIntensity = 0;
        this.shakeDecay = 0.95;
        
        // Power-ups and special abilities
        this.activePowerUps = {
            rapidFire: false,
            spreadShot: false,
            piercingShot: false,
            shieldBoost: false
        };
        
        // Weapon modes
        this.weaponMode = 'standard'; // standard, burst, spread, charge
        this.chargeLevel = 0;
        this.maxChargeLevel = 100;
        
        // Object pooling for performance
        this.initializeBulletPool(50);
        
        // Keep track of input state here
        this.inputMap = {};
        window.addEventListener('keydown', (e) => this.inputMap[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.inputMap[e.key.toLowerCase()] = false);
    }

    initializeBulletPool(poolSize) {
        for (let i = 0; i < poolSize; i++) {
            const bullet = new Bullet(this.scene, BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero());
            bullet.mesh.setEnabled(false);
            this.bulletPool.push(bullet);
        }
    }

    getBulletFromPool(position, velocity) {
        for (let i = 0; i < this.bulletPool.length; i++) {
            if (!this.bulletPool[i].mesh.isEnabled()) {
                this.bulletPool[i].mesh.position = position.clone();
                this.bulletPool[i].velocity = velocity.clone();
                this.bulletPool[i].mesh.setEnabled(true);
                this.bulletPool[i].isDisposed = false;
                return this.bulletPool[i];
            }
        }
        
        // If no available bullet, create a new one
        const bullet = new Bullet(this.scene, position, velocity);
        this.bulletPool.push(bullet);
        return bullet;
    }

    createThrusterEffects() {
        // Main thruster system - blue plasma core
        this.thrusterSystem = new BABYLON.ParticleSystem("mainThrusters", 3000, this.scene);
        this.thrusterSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
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
        this.thrusterSystemOuter.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
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
        this.sparksSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
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
        
        // Turbo boost effect
        this.turboSystem = new BABYLON.ParticleSystem("turboBoost", 4000, this.scene);
        this.turboSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
        this.turboSystem.emitter = this.mesh;
        this.turboSystem.minEmitBox = new BABYLON.Vector3(-0.6, -0.6, -2.5);
        this.turboSystem.maxEmitBox = new BABYLON.Vector3(0.6, 0.6, -2.5);
        
        this.turboSystem.color1 = new BABYLON.Color4(0.8, 0.2, 1.0, 1.0);
        this.turboSystem.color2 = new BABYLON.Color4(0.3, 0.1, 0.8, 0.8);
        this.turboSystem.colorDead = new BABYLON.Color4(0.1, 0.0, 0.3, 0.0);
        
        this.turboSystem.minSize = 0.2;
        this.turboSystem.maxSize = 1.5;
        this.turboSystem.minLifeTime = 0.3;
        this.turboSystem.maxLifeTime = 0.8;
        this.turboSystem.emitRate = 0; // Only active during turbo
        this.turboSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.turboSystem.gravity = new BABYLON.Vector3(0, 0, 15);
        this.turboSystem.direction1 = new BABYLON.Vector3(-0.5, -0.5, 5);
        this.turboSystem.direction2 = new BABYLON.Vector3(0.5, 0.5, 15);
    }

    createMuzzleFlashSystem() {
        // Muzzle flash effect
        this.muzzleFlash = new BABYLON.ParticleSystem("muzzleFlash", 200, this.scene);
        this.muzzleFlash.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
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
        
        // Special weapon muzzle flash
        this.specialMuzzleFlash = new BABYLON.ParticleSystem("specialMuzzleFlash", 500, this.scene);
        this.specialMuzzleFlash.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
        this.specialMuzzleFlash.emitter = this.mesh;
        this.specialMuzzleFlash.minEmitBox = new BABYLON.Vector3(-0.3, -0.3, 2.5);
        this.specialMuzzleFlash.maxEmitBox = new BABYLON.Vector3(0.3, 0.3, 2.5);
        
        this.specialMuzzleFlash.color1 = new BABYLON.Color4(1.0, 0.2, 0.8, 1.0);
        this.specialMuzzleFlash.color2 = new BABYLON.Color4(0.8, 0.0, 1.0, 1.0);
        this.specialMuzzleFlash.colorDead = new BABYLON.Color4(0.3, 0.0, 0.2, 0.0);
        
        this.specialMuzzleFlash.minSize = 0.5;
        this.specialMuzzleFlash.maxSize = 1.5;
        this.specialMuzzleFlash.minLifeTime = 0.1;
        this.specialMuzzleFlash.maxLifeTime = 0.3;
        this.specialMuzzleFlash.emitRate = 5000;
        this.specialMuzzleFlash.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.specialMuzzleFlash.gravity = new BABYLON.Vector3(0, 0, 0);
        this.specialMuzzleFlash.direction1 = new BABYLON.Vector3(-1, -1, 0);
        this.specialMuzzleFlash.direction2 = new BABYLON.Vector3(1, 1, 5);
        this.specialMuzzleFlash.targetStopDuration = 0.2;
    }

    createAfterburnerTrails() {
        // Wing tip trails
        this.leftWingTrail = new BABYLON.ParticleSystem("leftWingTrail", 800, this.scene);
        this.leftWingTrail.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
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
        
        // Turbo trails
        this.turboLeftTrail = new BABYLON.ParticleSystem("turboLeftTrail", 1200, this.scene);
        this.turboLeftTrail.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
        this.turboLeftTrail.emitter = this.mesh;
        this.turboLeftTrail.minEmitBox = new BABYLON.Vector3(-2, 0, 0);
        this.turboLeftTrail.maxEmitBox = new BABYLON.Vector3(-2, 0, 0);
        
        this.turboLeftTrail.color1 = new BABYLON.Color4(0.8, 0.2, 1.0, 0.8);
        this.turboLeftTrail.color2 = new BABYLON.Color4(0.4, 0.1, 0.8, 0.6);
        this.turboLeftTrail.colorDead = new BABYLON.Color4(0.1, 0.0, 0.3, 0.0);
        
        this.turboLeftTrail.minSize = 0.1;
        this.turboLeftTrail.maxSize = 0.5;
        this.turboLeftTrail.minLifeTime = 1.0;
        this.turboLeftTrail.maxLifeTime = 2.0;
        this.turboLeftTrail.emitRate = 0; // Only active during turbo
        this.turboLeftTrail.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.turboLeftTrail.gravity = new BABYLON.Vector3(0, 0, 2);
        this.turboLeftTrail.direction1 = new BABYLON.Vector3(-0.2, -0.2, -2);
        this.turboLeftTrail.direction2 = new BABYLON.Vector3(0.2, 0.2, -5);

        this.turboRightTrail = this.turboLeftTrail.clone("turboRightTrail");
        this.turboRightTrail.minEmitBox = new BABYLON.Vector3(2, 0, 0);
        this.turboRightTrail.maxEmitBox = new BABYLON.Vector3(2, 0, 0);
    }

    createShieldGlow() {
        // Ambient energy field around ship
        this.shieldGlow = new BABYLON.ParticleSystem("shieldGlow", 400, this.scene);
        this.shieldGlow.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
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
        
        // Combat shield - activates when taking damage or firing
        this.combatShield = new BABYLON.ParticleSystem("combatShield", 600, this.scene);
        this.combatShield.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
        this.combatShield.emitter = this.mesh;
        this.combatShield.minEmitBox = new BABYLON.Vector3(-2.0, -2.0, -2.0);
        this.combatShield.maxEmitBox = new BABYLON.Vector3(2.0, 2.0, 2.0);
        
        this.combatShield.color1 = new BABYLON.Color4(1.0, 0.3, 0.2, 0.3);
        this.combatShield.color2 = new BABYLON.Color4(0.8, 0.1, 0.9, 0.2);
        this.combatShield.colorDead = new BABYLON.Color4(0.2, 0.0, 0.1, 0.0);
        
        this.combatShield.minSize = 0.5;
        this.combatShield.maxSize = 1.5;
        this.combatShield.minLifeTime = 0.5;
        this.combatShield.maxLifeTime = 1.0;
        this.combatShield.emitRate = 0; // Only active during combat
        this.combatShield.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.combatShield.gravity = new BABYLON.Vector3(0, 0, 0);
        this.combatShield.direction1 = new BABYLON.Vector3(-0.2, -0.2, -0.2);
        this.combatShield.direction2 = new BABYLON.Vector3(0.2, 0.2, 0.2);
    }

    createImpactEffects() {
        // Bullet impact explosions
        this.impactExplosion = new BABYLON.ParticleSystem("impactExplosion", 100, this.scene);
        this.impactExplosion.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", this.scene);
        this.impactExplosion.emitter = BABYLON.Vector3.Zero(); // Will be set on impact
        this.impactExplosion.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
        this.impactExplosion.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);
        
        this.impactExplosion.color1 = new BABYLON.Color4(1.0, 0.8, 0.2, 1.0);
        this.impactExplosion.color2 = new BABYLON.Color4(1.0, 0.3, 0.0, 1.0);
        this.impactExplosion.colorDead = new BABYLON.Color4(0.2, 0.0, 0.0, 0.0);
        
        this.impactExplosion.minSize = 0.1;
        this.impactExplosion.maxSize = 0.8;
        this.impactExplosion.minLifeTime = 0.1;
        this.impactExplosion.maxLifeTime = 0.5;
        this.impactExplosion.emitRate = 0; // Will be triggered on impact
        this.impactExplosion.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.impactExplosion.gravity = new BABYLON.Vector3(0, 0, 0);
        this.impactExplosion.direction1 = new BABYLON.Vector3(-2, -2, -2);
        this.impactExplosion.direction2 = new BABYLON.Vector3(2, 2, 2);
    }

    // Update method called every frame from the main loop
    update() {
        const deltaTime = this.scene.getEngine().getDeltaTime();
        this.bulletCooldown -= deltaTime;
        this.comboTimer -= deltaTime;
        this.heatLevel = Math.max(0, this.heatLevel - deltaTime * 0.05);
        this.energyLevel = Math.min(100, this.energyLevel + deltaTime * 0.02);
        
        // Update screen shake
        if (this.shakeIntensity > 0.01) {
            this.camera.position.x += (Math.random() - 0.5) * this.shakeIntensity;
            this.camera.position.y += (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeIntensity *= this.shakeDecay;
        }
        
        // Update combo multiplier
        if (this.comboTimer <= 0) {
            this.comboMultiplier = 1;
        }

        const moveSpeed = 0.8;
        const rotationSpeed = 0.05;
        const turboSpeed = 2.0; // Speed multiplier for turbo

        let isThrusting = false;
        let thrusterIntensityTarget = 0;
        let isTurboActive = false;

        // Thrust
        if (this.inputMap['w']) {
            const speed = this.inputMap['shift'] ? moveSpeed * turboSpeed : moveSpeed;
            this.mesh.translate(BABYLON.Axis.Z, speed, BABYLON.Space.LOCAL);
            isThrusting = true;
            thrusterIntensityTarget = this.inputMap['shift'] ? 1.5 : 1.0;
            isTurboActive = this.inputMap['shift'];
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
            
            // Turbo effects
            if (isTurboActive && this.energyLevel > 10) {
                if (!this.turboSystem.isStarted()) {
                    this.turboSystem.start();
                    this.turboLeftTrail.start();
                    this.turboRightTrail.start();
                    this.turboSystem.emitRate = 2000;
                    this.turboLeftTrail.emitRate = 800;
                    this.turboRightTrail.emitRate = 800;
                }
                
                // Consume energy for turbo
                this.energyLevel -= deltaTime * 0.1;
            } else {
                if (this.turboSystem.isStarted()) {
                    this.turboSystem.emitRate = 0;
                    this.turboLeftTrail.emitRate = 0;
                    this.turboRightTrail.emitRate = 0;
                    setTimeout(() => {
                        this.turboSystem.stop();
                        this.turboLeftTrail.stop();
                        this.turboRightTrail.stop();
                    }, 1000);
                }
            }
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

        // Weapon mode switching
        if (this.inputMap['1']) this.weaponMode = 'standard';
        if (this.inputMap['2']) this.weaponMode = 'burst';
        if (this.inputMap['3']) this.weaponMode = 'spread';
        if (this.inputMap['4']) this.weaponMode = 'charge';

        // Firing
        if (this.inputMap[' ']) {
            if (this.weaponMode === 'charge') {
                // Charge weapon
                this.chargeLevel = Math.min(this.maxChargeLevel, this.chargeLevel + deltaTime * 0.1);
            } else {
                this.fire();
            }
        } else if (this.weaponMode === 'charge' && this.chargeLevel > 0) {
            // Release charged shot
            this.fireChargedShot();
            this.chargeLevel = 0;
        }

        // Special weapon
        if (this.inputMap['x'] && this.specialWeaponReady && this.energyLevel > 50) {
            this.fireSpecialWeapon();
            this.specialWeaponReady = false;
            this.energyLevel -= 50;
            setTimeout(() => {
                this.specialWeaponReady = true;
            }, 5000); // 5 second cooldown
        }

        // Update shield glow intensity based on speed and recent activity
        const timeSinceLastFire = Date.now() - this.lastFireTime;
        const combatGlow = Math.max(0, 1 - (timeSinceLastFire / 3000)); // Fade over 3 seconds
        const speedGlow = this.thrusterIntensity * 0.5;
        const totalGlow = Math.min(1, combatGlow + speedGlow + 0.2); // Base glow of 0.2
        
        this.shieldGlow.color1 = new BABYLON.Color4(0.2 * totalGlow, 0.4 * totalGlow, 0.8 * totalGlow, 0.1 * totalGlow);
        this.shieldGlow.emitRate = 50 + (totalGlow * 100);
        
        // Combat shield
        if (combatGlow > 0.1) {
            if (!this.combatShield.isStarted()) {
                this.combatShield.start();
            }
            this.combatShield.emitRate = combatGlow * 200;
        } else {
            if (this.combatShield.isStarted()) {
                this.combatShield.emitRate = 0;
                setTimeout(() => this.combatShield.stop(), 1000);
            }
        }

        // Update bullets
        this.bullets.forEach(bullet => bullet.update());
        
        // Clean up disposed bullets
        this.bullets = this.bullets.filter(bullet => !bullet.isDisposed);
    }

    fire() {
        if (this.bulletCooldown <= 0 && !this.isOverheated) {
            const baseCooldown = this.activePowerUps.rapidFire ? 100 : 250;
            this.bulletCooldown = baseCooldown / this.comboMultiplier;
            
            // Increase heat
            this.heatLevel += 5;
            if (this.heatLevel >= 100) {
                this.isOverheated = true;
                setTimeout(() => this.isOverheated = false, 2000); // 2 second overheat penalty
            }
            
            const bulletVelocity = this.mesh.getDirection(BABYLON.Axis.Z).scale(2);
            
            if (this.weaponMode === 'standard') {
                // Standard single shot
                const bullet = this.getBulletFromPool(this.mesh.position, bulletVelocity);
                this.bullets.push(bullet);
                this.triggerMuzzleFlash();
            } else if (this.weaponMode === 'burst') {
                // Burst fire - 3 bullets in quick succession
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        const spread = (i - 1) * 0.05; // -0.05, 0, 0.05
                        const direction = this.mesh.getDirection(BABYLON.Axis.Z);
                        direction.x += spread;
                        direction.normalize();
                        const bullet = this.getBulletFromPool(this.mesh.position, direction.scale(2));
                        this.bullets.push(bullet);
                        this.triggerMuzzleFlash();
                    }, i * 50);
                }
            } else if (this.weaponMode === 'spread') {
                // Spread shot - 5 bullets in a cone
                for (let i = 0; i < 5; i++) {
                    const angle = (i - 2) * 0.1; // -0.2, -0.1, 0, 0.1, 0.2
                    const direction = this.mesh.getDirection(BABYLON.Axis.Z);
                    const right = this.mesh.getDirection(BABYLON.Axis.X);
                    direction.addInPlace(right.scale(angle));
                    direction.normalize();
                    const bullet = this.getBulletFromPool(this.mesh.position, direction.scale(2));
                    this.bullets.push(bullet);
                }
                this.triggerMuzzleFlash();
            }
            
            this.lastFireTime = Date.now();
            
            // Update combo
            this.comboTimer = 2000; // 2 seconds to maintain combo
            this.comboMultiplier = Math.min(5, this.comboMultiplier + 0.2);
            
            // Screen shake
            this.shakeIntensity = 0.1;
            
            // Play sound
            this.soundManager.playSound("laserSound");
        }
    }

    fireChargedShot() {
        if (this.bulletCooldown <= 0 && !this.isOverheated) {
            this.bulletCooldown = 500; // Longer cooldown for charged shot
            
            // Increase heat based on charge level
            this.heatLevel += 10 + (this.chargeLevel / this.maxChargeLevel) * 20;
            if (this.heatLevel >= 100) {
                this.isOverheated = true;
                setTimeout(() => this.isOverheated = false, 3000); // 3 second overheat penalty
            }
            
            const bulletVelocity = this.mesh.getDirection(BABYLON.Axis.Z).scale(2);
            const bullet = this.getBulletFromPool(this.mesh.position, bulletVelocity);
            
            // Scale bullet size and damage based on charge level
            const chargeRatio = this.chargeLevel / this.maxChargeLevel;
            bullet.mesh.scaling = new BABYLON.Vector3(1 + chargeRatio, 1 + chargeRatio, 1 + chargeRatio);
            
            this.bullets.push(bullet);
            this.lastFireTime = Date.now();
            
            // Enhanced muzzle flash for charged shot
            this.muzzleFlash.emitRate = 5000;
            this.muzzleFlash.minSize = 0.5;
            this.muzzleFlash.maxSize = 1.5;
            this.triggerMuzzleFlash();
            
            // Reset muzzle flash
            setTimeout(() => {
                this.muzzleFlash.emitRate = 2000;
                this.muzzleFlash.minSize = 0.2;
                this.muzzleFlash.maxSize = 0.8;
            }, 200);
            
            // Update combo
            this.comboTimer = 2000;
            this.comboMultiplier = Math.min(5, this.comboMultiplier + 0.5);
            
            // Screen shake proportional to charge
            this.shakeIntensity = 0.2 * chargeRatio;
            
            // Play sound
            this.soundManager.playSound("chargedLaserSound");
        }
    }

    fireSpecialWeapon() {
        // Special weapon - massive energy blast
        const bulletVelocity = this.mesh.getDirection(BABYLON.Axis.Z).scale(3);
        
        // Create multiple large projectiles in a spiral pattern
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const direction = this.mesh.getDirection(BABYLON.Axis.Z).clone();
            const right = this.mesh.getDirection(BABYLON.Axis.X).clone();
            const up = this.mesh.getDirection(BABYLON.Axis.Y).clone();
            
            right.scaleInPlace(Math.cos(angle) * 0.2);
            up.scaleInPlace(Math.sin(angle) * 0.2);
            
            direction.addInPlace(right);
            direction.addInPlace(up);
            direction.normalize();
            direction.scaleInPlace(3);
            
            const bullet = this.getBulletFromPool(this.mesh.position, direction);
            bullet.mesh.scaling = new BABYLON.Vector3(2, 2, 2);
            this.bullets.push(bullet);
        }
        
        this.lastFireTime = Date.now();
        
        // Special muzzle flash
        this.specialMuzzleFlash.start();
        setTimeout(() => this.specialMuzzleFlash.stop(), 200);
        
        // Big screen shake
        this.shakeIntensity = 0.5;
        
        // Play sound
        this.soundManager.playSound("specialWeaponSound");
    }

    triggerMuzzleFlash() {
        this.muzzleFlash.start();
        setTimeout(() => this.muzzleFlash.stop(), 100);
    }

    triggerImpactEffect(position) {
        this.impactExplosion.emitter = position;
        this.impactExplosion.emitRate = 500;
        this.impactExplosion.start();
        setTimeout(() => {
            this.impactExplosion.emitRate = 0;
            setTimeout(() => this.impactExplosion.stop(), 500);
        }, 100);
    }

    // Method to dispose all particle systems when player is destroyed
    dispose() {
        this.thrusterSystem.dispose();
        this.thrusterSystemOuter.dispose();
        this.sparksSystem.dispose();
        this.turboSystem.dispose();
        this.muzzleFlash.dispose();
        this.specialMuzzleFlash.dispose();
        this.leftWingTrail.dispose();
        this.rightWingTrail.dispose();
        this.turboLeftTrail.dispose();
        this.turboRightTrail.dispose();
        this.shieldGlow.dispose();
        this.combatShield.dispose();
        this.impactExplosion.dispose();
        
        // Dispose all bullets
        this.bullets.forEach(bullet => bullet.dispose());
        this.bulletPool.forEach(bullet => bullet.dispose());
    }
}
```
