export class SoundManager {
    constructor() {
        this.scene = null;
        this.sounds = {};
    }


    loadSound(name, url) {
        if (!this.scene) {
            console.error('SoundManager: Scene not set before loading sound!');
            return;
        }
        console.log(`[SoundManager] Loading sound '${name}' from URL:`, url);
        const sound = new BABYLON.Sound(name, url, this.scene, () => {
            sound._isReady = true;
            console.log(`Sound ${name} loaded successfully from:`, url);
            if (sound._playQueued) {
                try {
                    sound.play();
                    sound._playQueued = false;
                    console.log(`Sound ${name} started playing (delayed until ready).`);
                } catch (e) {
                    console.error(`[SoundManager] Error playing sound '${name}' after load:`, e);
                }
            }
        }, {
            loop: true,
            autoplay: false,
            errorCallback: (e) => {
                console.error(`[SoundManager] Error loading sound '${name}' from ${url}:`, e);
            }
        });
        sound._playQueued = false;
        sound._isReady = false;
        this.sounds[name] = sound;
    }


    playSound(name) {
        console.log(`[SoundManager] Attempting to play sound: ${name}`);
        const sound = this.sounds[name];
        if (!sound) {
            console.warn(`[SoundManager] Sound '${name}' not loaded yet.`);
            return;
        }
        if (!sound._isReady) {
            console.warn(`[SoundManager] Sound '${name}' is not ready to play. Queuing play request.`);
            sound._playQueued = true;
            return;
        }
        if (!sound.isPlaying) {
            try {
                sound.play();
                console.log(`[SoundManager] Sound '${name}' started playing.`);
            } catch (e) {
                console.error(`[SoundManager] Failed to play sound '${name}':`, e);
            }
        }
    }

    stopSound(name) {
        if (this.sounds[name] && this.sounds[name].isPlaying) {
            this.sounds[name].stop();
            console.log(`Sound ${name} stopped.`);
        }
    }

    init() {
        // Unlock audio context on any user interaction
        const unlock = () => {
            if (BABYLON.Engine.audioEngine && !BABYLON.Engine.audioEngine.audioContext.isRunning) {
                BABYLON.Engine.audioEngine.unlock();
                console.log("Audio context unlocked.");
            }
        };
        ["click", "keydown", "pointerdown", "touchstart"].forEach(evt => {
            window.addEventListener(evt, unlock, { once: true });
        });
    }
}