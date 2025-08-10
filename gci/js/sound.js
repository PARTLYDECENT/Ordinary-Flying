// sound.js

// Create an object that we can export.
const SoundManager = {
    
    // An 'init' function to set everything up. 
    // This will be called from your game.js file.
    init: function() {
        console.log("SoundManager initializing...");

        const startButton = document.getElementById('startButton');
        const gameAudio = document.getElementById('gameAudio');

        if (!startButton || !gameAudio) {
            console.error("SoundManager Error: Missing startButton or gameAudio element in HTML.");
            return;
        }

        startButton.addEventListener('click', () => {
            console.log("Start button clicked, playing audio.");
            gameAudio.play().catch(error => {
                console.error('Audio playback failed:', error);
            });
        });
    }
};

// --- THIS IS THE KEY ---
// This line makes the SoundManager available to be imported by other files.
export { SoundManager };
