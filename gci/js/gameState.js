// Define all possible states
export const GameState = {
    START_MENU: 0,
    PLAYING: 1,
    PAUSED: 2,
    GAME_OVER: 3,
};

export class GameStateManager {
    constructor(game) {
        this.game = game; // Reference to the main Game class
        this.currentState = null;
        
        // UI Elements
        this.pauseMenu = document.getElementById('pause-menu');
        this.canvas = document.getElementById('renderCanvas');
    }

    setState(newState) {
        this.currentState = newState;
        
        // Handle logic for entering a new state
        switch (this.currentState) {
            case GameState.PAUSED:
                this.pauseMenu.style.display = 'block';
                this.canvas.classList.add('paused');
                // stop engine sounds etc.
                break;
            case GameState.PLAYING:
                 this.pauseMenu.style.display = 'none';
                 this.canvas.classList.remove('paused');
                break;
        }
    }

    // This gets called every frame by the main render loop
    update() {
        switch (this.currentState) {
            case GameState.PLAYING:
                // When playing, update the player
                this.game.player.update();
                // Check for pause input
                if (this.game.player.inputMap['p']) {
                    this.game.player.inputMap['p'] = false; // Prevent rapid toggling
                    this.setState(GameState.PAUSED);
                }
                break;
            case GameState.PAUSED:
                // When paused, only check for unpause input
                 if (this.game.player.inputMap['p']) {
                    this.game.player.inputMap['p'] = false; // Prevent rapid toggling
                    this.setState(GameState.PLAYING);
                }
                break;
        }
    }
}