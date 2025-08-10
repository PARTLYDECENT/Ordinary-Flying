# Space Combat Simulator (Babylon.js)

## Project Overview
This is a browser-based 3D space combat game built with Babylon.js. The player pilots a spaceship in a simulated combat zone, facing off against AI enemies. The project is an extension of prior spaceship mechanics, now incorporating enhanced audio, visual effects, and a more modular codebase. The design draws inspiration from the concept of holographic theory, aiming for immersive, layered feedback and dynamic interactions.

## Current State of Development (August 2025)
- **Core Gameplay:**
  - Player ship with WASD+RFQE controls for full 6DOF movement (thrust, yaw, pitch, roll).
  - Plasma cannon (spacebar) and enemy AI that chases and fires at the player.
  - Tactical pause (P key) with UI overlay.
- **Visuals:**
  - Particle systems for thrusters, muzzle flash, afterburner trails, and shield glow.
  - 3D models for player, enemy, and map loaded from GLB files.
- **Audio:**
  - Engine sound loops when thrusting, with robust handling for browser autoplay restrictions.
  - Sound system queues play requests until audio is ready and unlocked by user interaction.
- **UI:**
  - Start menu, pause menu, and control info overlays.
  - Responsive design for desktop browsers.
- **Code Structure:**
  - Modular ES6 classes: `Game`, `Player`, `Enemy`, `Bullet`, `SoundManager`, `GameStateManager`.
  - All main logic is in the `gci/js/` folder. Other folders/files are remnants from prior experiments.

## Sound System Notes
- Uses Babylon.js `Sound` class for playback.
- Handles browser autoplay policy by unlocking audio context on any user interaction (click, keydown, pointerdown, touchstart).
- If a sound is requested before it is loaded or ready, the play request is queued and will play as soon as possible.
- All sound files must be present in the `static/` directory. Missing files will cause errors in the console.
- Known issue: If the required `textures/flare.png` is missing, particle effects will not render correctly (does not affect sound).

## Change Log
- **v0.2 (August 2025):**
  - Refactored sound engine for Babylon.js v8 compatibility.
  - Added robust audio unlock and play queueing.
  - Improved error logging for missing/failed sounds.
  - Modularized all gameplay logic into ES6 classes.
  - Enhanced particle and shield effects.
- **v0.1:**
  - Initial Babylon.js port with basic ship, enemy, and shooting mechanics.

## Holographic Theory Extension
This project is a technical and creative extension of earlier spaceship mechanics, now exploring the "holographic theory" in game design:
- **Layered Feedback:** Visual, audio, and gameplay systems are designed to reinforce each other, creating a sense of depth and immersion.
- **Emergent Interactions:** Modular code allows for future expansion (e.g., more ship systems, advanced AI, multiplayer, or narrative overlays).
- **Simulation Focus:** The game aims to simulate not just movement and combat, but also the feel of being in a dynamic, responsive environment.

## How to Play
1. Open `gci/index.html` in a modern browser (desktop recommended).
2. Click "START GAME" and interact with the page to unlock audio.
3. Use the controls shown in the overlay to fly and fight.

## Developer Notes
- All main code is in `gci/js/`. Other files/folders are legacy and not used in the current build.
- For best results, ensure all referenced assets (GLB, MP3, PNG) are present in the `static/` and `textures/` folders.
- The project is in active development and subject to major changes.
