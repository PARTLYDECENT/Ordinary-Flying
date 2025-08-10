export class Bullet {
    constructor(scene, position, velocity) {
        this.particles = [];
        this.particleSystem = null;
        this.headPosition = position.clone();
        this.trailPositions = [];
        this.maxTrailLength = 20;
        this.beamMaterial = null;
        this.glowLayer = null;
        this.beamHead = null;
        this.scene = scene;
        this.velocity = velocity.clone();
        // Initialize beam head
        this.beamHead = BABYLON.MeshBuilder.CreateSphere("beamHead", {diameter: 0.3}, scene);
        this.beamHead.position = this.headPosition.clone();
        // Create glowing material
        this.beamMaterial = new BABYLON.StandardMaterial("beamMat", scene);
        this.beamMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.8, 1);
        this.beamMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.beamHead.material = this.beamMaterial;
        // Add glow effect
        this.glowLayer = new BABYLON.GlowLayer("glow", scene);
        this.glowLayer.intensity = 0.8;
        // Initialize particle system
        this.particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
        this.particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);
        this.particleSystem.emitter = this.beamHead;
        this.particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
        this.particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);
        this.particleSystem.color1 = new BABYLON.Color4(0.2, 0.8, 1, 1);
        this.particleSystem.color2 = new BABYLON.Color4(0.1, 0.4, 0.8, 0.5);
        this.particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0);
        this.particleSystem.minSize = 0.05;
        this.particleSystem.maxSize = 0.15;
        this.particleSystem.minLifeTime = 0.3;
        this.particleSystem.maxLifeTime = 0.8;
        this.particleSystem.emitRate = 150;
        this.particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
        this.particleSystem.direction1 = velocity.clone().normalize().scale(-1);
        this.particleSystem.direction2 = velocity.clone().normalize().scale(-1);
        this.particleSystem.minAngularSpeed = 0;
        this.particleSystem.maxAngularSpeed = Math.PI;
        this.particleSystem.minEmitPower = 0.5;
        this.particleSystem.maxEmitPower = 1.5;
        this.particleSystem.updateSpeed = 0.01;
        this.particleSystem.start();
        // Initialize trail
        this.createTrail();
        // Auto-cleanup after 3 seconds
        setTimeout(() => this.dispose(), 3000);
    }
    createTrail() {
        // Create trail segments
        for (let i = 0; i < this.maxTrailLength; i++) {
            const segment = BABYLON.MeshBuilder.CreateCylinder(
                `trail${i}`,
                {height: 0.2, diameter: 0.15 - (i * 0.005)},
                this.scene
            );
            segment.material = this.beamMaterial;
            this.particles.push(segment);
        }
    }
    update() {
        // Move beam head
        this.headPosition.addInPlace(this.velocity);
        this.beamHead.position = this.headPosition.clone();
        // Update trail positions
        this.trailPositions.unshift(this.headPosition.clone());
        if (this.trailPositions.length > this.maxTrailLength) {
            this.trailPositions.pop();
        }
        // Position trail segments
        this.particles.forEach((segment, i) => {
            if (i < this.trailPositions.length - 1) {
                const start = this.trailPositions[i];
                const end = this.trailPositions[i + 1];
                segment.position = BABYLON.Vector3.Center(start, end);
                segment.lookAt(end);
                segment.rotate(BABYLON.Vector3.Right(), Math.PI / 2);
                // Fade trail
                const alpha = 1 - (i / this.maxTrailLength);
                segment.material.alpha = alpha * 0.7;
            }
        });
    }
    dispose() {
        // Dispose particles
        this.particles.forEach(p => p.dispose());
        this.particles = [];
        // Dispose particle system
        if (this.particleSystem) {
            this.particleSystem.dispose();
            this.particleSystem = null;
        }
        // Dispose beam head
        if (this.beamHead) {
            this.beamHead.dispose();
            this.beamHead = null;
        }
        // Dispose glow layer
        if (this.glowLayer) {
            this.glowLayer.dispose();
            this.glowLayer = null;
        }
        // Dispose material
        if (this.beamMaterial) {
            this.beamMaterial.dispose();
            this.beamMaterial = null;
        }
    }
}
