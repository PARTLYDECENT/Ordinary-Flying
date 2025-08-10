export class Bullet {
    constructor(scene, position, velocity) {
        this.scene = scene;
        this.mesh = BABYLON.MeshBuilder.CreateSphere("bullet", {diameter: 0.5}, scene);
        this.mesh.position = position.clone();
        this.velocity = velocity.clone();

        // Set a timer to destroy the bullet after a certain time
        setTimeout(() => {
            this.mesh.dispose();
        }, 3000); // 3 seconds
    }

    update() {
        this.mesh.position.addInPlace(this.velocity);
    }
}