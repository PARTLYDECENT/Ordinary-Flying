import { GameState, GameStateManager } from './gameState.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { SoundManager } from './sound.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = null; // Will be created in createScene
        this.player = null;
        this.stateManager = new GameStateManager(this);
        this.soundManager = new SoundManager(); // Initialized without a scene
        this.enemies = [];
    }

    // A new method to create the scene
    async createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.soundManager.scene = this.scene; // Assign the scene to the sound manager

        // Add a camera to the scene
        const camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -20), this.scene);
        camera.radius = 30; // how far from the object to follow
        camera.heightOffset = 10; // how high above the object to place the camera
        camera.rotationOffset = 180; // the viewing angle
        camera.cameraAcceleration = 0.05; // how fast to move
        camera.maxCameraSpeed = 10; // speed limit

        // Move all your scene setup code from the old script here
        // (lighting, starfield, etc.)
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
        
        // Load sounds
        this.soundManager.loadSound("engineSound", "/gci/static/sound1.mp3");

        // Load the map and player ship
        const shipResult = await BABYLON.SceneLoader.ImportMeshAsync("", "./static/", "ship1.glb", this.scene);
        const map = await BABYLON.SceneLoader.ImportMeshAsync("", "./static/", "map.glb", this.scene);
        const enemyShipResult = await BABYLON.SceneLoader.ImportMeshAsync("", "./static/", "ship2.glb", this.scene);

        const playerShip = shipResult.meshes[0];
        playerShip.name = "playerShip";

        const enemyShip = enemyShipResult.meshes[0];
        enemyShip.name = "enemyShip";
        enemyShip.position = new BABYLON.Vector3(20, 5, 20);

        // Create the player
        this.player = new Player(playerShip, this.scene, this.soundManager);

        // Create an enemy
        const enemy = new Enemy(enemyShip, this.scene, this.player);
        this.enemies.push(enemy);

        // Lock the camera to the player ship
        camera.lockedTarget = playerShip; // The camera will follow this object

        // ...spawn enemies, etc.

        return this.scene;
    }

    // The main loop
    async run() {
        await this.createScene();

        this.stateManager.setState(GameState.PLAYING); // Set initial state
        this.soundManager.init();

        this.engine.runRenderLoop(() => {
            // Update game logic based on the current state
            this.stateManager.update();
            this.player.update();
            this.enemies.forEach(enemy => enemy.update());
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
}
