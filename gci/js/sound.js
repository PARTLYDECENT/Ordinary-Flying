/**
 * sound.js
 * * This script waits for the webpage to fully load, then listens for a click 
 * on the start button. When the button is clicked, it plays the game audio.
 * This is necessary because modern browsers block sound until the user
 * interacts with the page.
 */

// Wait until the entire HTML page is loaded and ready.
document.addEventListener('DOMContentLoaded', () => {

    // --- STEP 1: FIND YOUR HTML ELEMENTS ---
    
    // Find the button with the ID "startButton".
    // IMPORTANT: If your start button in index.html has a different id,
    // change "startButton" to match it exactly.
    // Example: If your button is <button id="play-game">, change it to 'play-game'.
    const startButton = document.getElementById('startButton');

    // Find the audio element with the ID "gameAudio".
    // IMPORTANT: Make sure your <audio> tag in index.html has this ID.
    // Example: <audio id="gameAudio" src="your-sound.mp3"></audio>
    const gameAudio = document.getElementById('gameAudio');


    // --- STEP 2: CHECK IF ELEMENTS WERE FOUND ---

    // This is a safety check. If the button or audio can't be found, 
    // it will print an error to the browser's developer console (F12).
    if (!startButton) {
        console.error('ERROR: Could not find the start button. Check the ID in your HTML and JS.');
        return; // Stop the script if the button is missing.
    }
    if (!gameAudio) {
        console.error('ERROR: Could not find the audio element. Check the ID in your HTML and JS.');
        return; // Stop the script if the audio element is missing.
    }


    // --- STEP 3: CREATE THE CLICK EVENT ---

    // This "listens" for a click on your start button.
    startButton.addEventListener('click', () => {
        
        // When the button is clicked, attempt to play the audio.
        console.log('Start button clicked. Attempting to play audio...');

        // The .play() function returns a "Promise". The .catch() part
        // is crucial for debugging because it will tell you if something
        // went wrong (e.g., file not found, browser blocked it).
        gameAudio.play().catch(error => {
            console.error('AUDIO PLAYBACK ERROR:', error);
        });

        // Optional: If you want the button to disappear after being clicked.
        // startButton.style.display = 'none';
    });

});
