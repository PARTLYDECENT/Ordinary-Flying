// sound.js

import * as BABYLON from 'https://cdn.babylonjs.com/babylon.js';

/**
 * Manages all game sounds.
 * This class now correctly handles being created with 'new SoundManager()'.
 */
export class SoundManager {
    constructor(scene) {
        // Store the scene reference
        this.scene = scene;

        // --- Sound Definitions ---
        // Load the main music file. The 'loop' and 'autoplay' settings are important.
        // Autoplay will be blocked by the browser, but we handle that with the start button.
        this.music = new BABYLON.Sound(
            "Music", 
            "gci/static/sounds/music.mp3", // Make sure this path is correct
            this.scene, 
            null, // This callback is called when the sound is ready to play
            { 
                loop: true, 
                autoplay: true, 
                volume: 0.1 
            }
        );

        // Load a sound for shooting
        this.laserSound = new BABYLON.Sound(
            "laser",
            "gci/static/sounds/laser.wav", // Make sure this path is correct
            this.scene
        );

        // The browser requires a user interaction to start any audio.
        // We ensure that once the scene is ready to play audio, it will.
        // This is the modern replacement for a start button listener for Babylon.js sounds.
        BABYLON.Engine.audioEngine.onAudioUnlockedObservable.addOnce(() => {
            console.log("Audio engine unlocked by user interaction.");
            this.music.play();
        });

        console.log("SoundManager constructed and sounds are loading.");
    }

    // A function to play the laser sound when called from your game logic.
    playLaserSound() {
        if (this.laserSound && this.laserSound.isReady()) {
            this.laserSound.play();
        }
    }
}
