import { Game } from './game.js';

// Wait for the DOM to be fully loaded before starting the game
window.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const startMenu = document.getElementById('start-menu');
    const renderCanvas = document.getElementById('renderCanvas');


    startButton.addEventListener('click', async () => {
        // Hide start menu and show canvas
        startMenu.style.display = 'none';
        renderCanvas.style.display = 'block';

        const game = new Game('renderCanvas');
        window.game = game; // Expose globally for debug
        await game.run();
    });

    // Initially hide the canvas until game starts
    renderCanvas.style.display = 'none';
});
