export class SoundManager {
    constructor() {
        this.scene = null;
        this.sounds = {};
    }

    // --- INITIALIZE THE MANAGER ---
    // Call this once with your Babylon.js scene.
    init(scene) {
        this.scene = scene;

        // Unlock audio on the first user interaction
        const unlock = () => {
            if (BABYLON.Engine.audioEngine && !BABYLON.Engine.audioEngine.isUnlocked) {
                BABYLON.Engine.audioEngine.unlock();
                console.log("Audio context unlocked.");
            }
            // Remove listeners after the first interaction
            ["click", "keydown", "pointerdown", "touchstart"].forEach(evt => {
                window.removeEventListener(evt, unlock);
            });
        };

        ["click", "keydown", "pointerdown", "touchstart"].forEach(evt => {
            window.addEventListener(evt, unlock, { once: true });
        });
    }

    // --- LOAD A SOUND ---
    // This now returns a Promise that resolves when the sound is actually ready.
    loadSound(name, url) {
        return new Promise((resolve, reject) => {
            // Check if the scene has been set
            if (!this.scene) {
                const errorMsg = "SoundManager Error: You must call .init(scene) before loading sounds.";
                console.error(errorMsg);
                return reject(errorMsg);
            }

            // Create the sound object
            const sound = new BABYLON.Sound(
                name,
                url,
                this.scene,
                // --- This function runs ONLY when the sound is successfully loaded ---
                () => {
                    this.sounds[name] = sound; // Add the ready sound to our list
                    console.log(`[SoundManager] SUCCESS: Sound '${name}' is loaded and ready.`);
                    resolve(sound); // The Promise is complete
                },
                // --- Options for the sound ---
                {
                    loop: false,   // Set to true if you want it to loop
                    autoplay: false,
                    // This function runs ONLY if the file can't be found or is corrupt
                    errorCallback: () => {
                        const errorMsg = `[SoundManager] FATAL ERROR: Could not load sound '${name}' from path: ${url}. Check the path and file.`;
                        console.error(errorMsg);
                        reject(errorMsg); // The Promise has failed
                    }
                }
            );
        });
    }

    // --- PLAY A SOUND ---
    // Plays a sound that has already been loaded.
    playSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            console.log(`[SoundManager] Playing '${name}'.`);
            sound.play();
        } else {
            console.error(`[SoundManager] Cannot play sound '${name}'. It was never loaded.`);
        }
    }

    // --- STOP A SOUND ---
    stopSound(name) {
        const sound = this.sounds[name];
        if (sound && sound.isPlaying) {
            sound.stop();
            console.log(`[SoundManager] Stopped '${name}'.`);
        }
    }
}
