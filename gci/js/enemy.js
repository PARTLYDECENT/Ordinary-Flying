import { Bullet } from './bullet.js';

export class Enemy {
    constructor(mesh, scene, player) {
        this.mesh = mesh;
        this.scene = scene;
        this.player = player;

        // Shooting
        this.bullets = [];
        this.bulletCooldown = 0;
    }

    update() {
        this.bulletCooldown -= this.scene.getEngine().getDeltaTime();

        // Look at the player
        this.mesh.lookAt(this.player.mesh.position);

        // Chase the player
        const direction = this.player.mesh.position.subtract(this.mesh.position).normalize();
        this.mesh.position.addInPlace(direction.scale(0.1));

        // Fire at the player
        if (this.bulletCooldown <= 0) {
            const bulletVelocity = this.mesh.getDirection(BABYLON.Axis.Z).scale(2);
            const bullet = new Bullet(this.scene, this.mesh.position, bulletVelocity);
            this.bullets.push(bullet);
            this.bulletCooldown = 1000; // 1000ms cooldown
        }

        this.bullets.forEach(bullet => bullet.update());
    }
}