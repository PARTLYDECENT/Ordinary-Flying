<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chaotic Shader Dimension</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background-color: #000;
            color: white;
            font-family: 'Courier New', monospace;
        }
        canvas {
            display: block;
        }
        #info {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 100;
            background-color: rgba(0,0,0,0.7);
            padding: 15px;
            border-radius: 5px;
            max-width: 300px;
            border: 1px solid #f0f;
            font-size: 0.9em;
        }
        #crosshair {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 8px;
            height: 8px;
            background-color: #f0f;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px #f0f;
        }
        #chaos-meter {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 200px;
            height: 20px;
            background-color: rgba(0,0,0,0.7);
            border: 1px solid #f0f;
            border-radius: 10px;
            overflow: hidden;
        }
        #chaos-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #ff00ff, #00ffff, #ffff00);
            transition: width 0.3s;
        }
        #glitch-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3em;
            color: #f0f;
            text-shadow: 0 0 10px #f0f;
            display: none;
            z-index: 200;
            animation: glitch 0.5s infinite;
        }
        @keyframes glitch {
            0% { transform: translate(-50%, -50%); }
            20% { transform: translate(-52%, -48%); }
            40% { transform: translate(-48%, -52%); }
            60% { transform: translate(-50%, -50%); }
            80% { transform: translate(-51%, -49%); }
            100% { transform: translate(-50%, -50%); }
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="info">
        Use WASD to move, mouse to look around. This dimension is unstable. Expect chaos.
    </div>
    <div id="crosshair"></div>
    <div id="chaos-meter">
        <div id="chaos-fill"></div>
    </div>
    <div id="glitch-text">REALITY SHIFT</div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

    <script>
        // --- Basic Setup ---
        let scene, camera, renderer;
        let clock = new THREE.Clock();
        let floor, ceiling, wall1, wall2, wall3, wall4;
        let materials = {};
        let chaosObjects = [];
        let chaosLevel = 0;
        let lastChaosEvent = 0;
        let realityShiftText = document.getElementById('glitch-text');
        
        // --- World State ---
        let currentWorldId = 'chaos_nexus';
        let isTeleporting = false;
        let worldShiftTimer = 0;
        let nextWorldShift = 10; // Shift world every 10 seconds initially
        
        // --- Movement & Controls ---
        let controls = { moveForward: false, moveBackward: false, moveLeft: false, moveRight: false };
        let velocity = new THREE.Vector3();
        let direction = new THREE.Vector3();
        const moveSpeed = 40.0;
        const lookSpeed = 0.002;
        
        // --- Shaders ---
        const vertexShader = `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        // --- Fragment Shaders ---
        const chaosFloorShader = `
            uniform float time;
            uniform float chaos;
            varying vec2 vUv;
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
            }
            
            void main() {
                vec2 uv = vUv;
                float t = time * 0.5;
                
                // Base pattern that changes with chaos
                float scale = mix(5.0, 20.0, chaos);
                vec2 p = uv * scale;
                
                // Create chaotic pattern
                float n = noise(p + t);
                n += noise(p * 2.0 - t * 0.5) * 0.5;
                n += noise(p * 4.0 + t * 0.25) * 0.25;
                
                // Random color shifts
                vec3 color1 = vec3(
                    sin(t * 0.7) * 0.5 + 0.5,
                    cos(t * 0.3) * 0.5 + 0.5,
                    sin(t * 0.5) * 0.5 + 0.5
                );
                
                vec3 color2 = vec3(
                    cos(t * 0.4) * 0.5 + 0.5,
                    sin(t * 0.6) * 0.5 + 0.5,
                    cos(t * 0.8) * 0.5 + 0.5
                );
                
                // Mix colors based on noise and chaos
                vec3 color = mix(color1, color2, n);
                
                // Add glitch effects at high chaos
                if (chaos > 0.7) {
                    float glitch = step(0.98, random(vec2(floor(uv.x * 20.0), t)));
                    color = mix(color, vec3(1.0, 0.0, 1.0), glitch);
                }
                
                // Pulse effect
                float pulse = sin(t * 5.0) * 0.1 + 0.9;
                color *= pulse;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        const chaosWallShader = `
            uniform float time;
            uniform float chaos;
            varying vec2 vUv;
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            void main() {
                vec2 uv = vUv;
                float t = time * 0.3;
                
                // Base color that shifts with chaos
                vec3 baseColor = mix(
                    vec3(0.1, 0.0, 0.2),
                    vec3(0.8, 0.0, 0.8),
                    chaos
                );
                
                // Create chaotic patterns
                float pattern = 0.0;
                for (float i = 0.0; i < 10.0; i++) {
                    vec2 p = uv * (5.0 + i * chaos * 5.0);
                    p += vec2(sin(t * 0.2 + i), cos(t * 0.3 + i));
                    pattern += sin(p.x * 10.0) * cos(p.y * 10.0) * (0.1 - i * 0.01);
                }
                
                // Add random elements
                float rnd = random(vec2(uv.x + t, uv.y));
                pattern += rnd * chaos * 0.5;
                
                // Distortion effect at high chaos
                if (chaos > 0.5) {
                    vec2 distort = vec2(
                        sin(uv.y * 20.0 + t * 5.0) * chaos * 0.1,
                        cos(uv.x * 20.0 + t * 5.0) * chaos * 0.1
                    );
                    uv += distort;
                }
                
                // Final color
                vec3 color = baseColor + vec3(pattern);
                
                // Glitch effect
                if (chaos > 0.8 && random(vec2(t)) > 0.95) {
                    color = vec3(1.0, 1.0, 0.0);
                }
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        const voidShader = `
            uniform float time;
            uniform float chaos;
            varying vec2 vUv;
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            void main() {
                vec2 uv = vUv;
                float t = time * 0.2;
                
                // Create swirling void effect
                vec2 center = vec2(0.5, 0.5);
                vec2 pos = uv - center;
                float dist = length(pos);
                float angle = atan(pos.y, pos.x);
                
                // Swirl effect increases with chaos
                angle += dist * (5.0 + chaos * 20.0) - t;
                pos = vec2(cos(angle), sin(angle)) * dist;
                
                // Noise pattern
                float n = random(pos * (10.0 + chaos * 40.0) + t);
                
                // Color based on distance and noise
                vec3 color = mix(
                    vec3(0.0, 0.0, 0.1),
                    vec3(0.8, 0.0, 0.8),
                    n * chaos
                );
                
                // Add random flashes
                if (random(vec2(t)) > 0.98) {
                    color = vec3(1.0, 1.0, 1.0);
                }
                
                // Fade at edges
                color *= (1.0 - smoothstep(0.0, 0.7, dist));
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        const fractalShader = `
            uniform float time;
            uniform float chaos;
            varying vec2 vUv;
            
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            void main() {
                vec2 uv = vUv;
                float t = time * 0.1;
                
                // Create fractal pattern
                vec2 z = uv * 4.0 - 2.0;
                vec2 c = vec2(
                    sin(t) * chaos,
                    cos(t * 0.7) * chaos
                );
                
                int iterations = 20;
                float escape = 0.0;
                
                for (int i = 0; i < 100; i++) {
                    if (i >= iterations) break;
                    z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
                    if (length(z) > 2.0) {
                        escape = float(i) / float(iterations);
                        break;
                    }
                }
                
                // Color based on escape time
                vec3 color = hsv2rgb(vec3(
                    escape + t * 0.1,
                    0.8,
                    escape > 0.0 ? 1.0 : 0.0
                ));
                
                // Add chaos effects
                if (chaos > 0.5) {
                    color += vec3(
                        sin(uv.x * 50.0 + t * 10.0) * 0.1,
                        cos(uv.y * 50.0 + t * 10.0) * 0.1,
                        sin((uv.x + uv.y) * 50.0 + t * 10.0) * 0.1
                    ) * (chaos - 0.5) * 2.0;
                }
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        const chaosPortalShader = `
            uniform float time;
            uniform float chaos;
            varying vec2 vUv;
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            void main() {
                vec2 uv = vUv;
                float t = time * 0.8;
                
                // Create portal effect
                vec2 center = vec2(0.5, 0.5);
                float dist = distance(uv, center);
                
                // Portal ring that changes with chaos
                float ringSize = mix(0.4, 0.3, chaos);
                float ringWidth = mix(0.05, 0.1, chaos);
                float ring = smoothstep(ringSize + ringWidth, ringSize, dist) - 
                            smoothstep(ringSize, ringSize - ringWidth, dist);
                
                // Energy particles
                float particles = 0.0;
                for(float i = 0.0; i < 30.0; i++) {
                    vec2 particlePos = vec2(
                        0.5 + sin(t + i * 0.2 + chaos * 5.0) * ringSize,
                        0.5 + cos(t + i * 0.2 + chaos * 5.0) * ringSize
                    );
                    particles += 0.1 / distance(uv, particlePos);
                }
                
                // Color shifts with chaos
                vec3 color1 = vec3(1.0, 0.0, 1.0);
                vec3 color2 = vec3(0.0, 1.0, 1.0);
                vec3 color3 = vec3(1.0, 1.0, 0.0);
                
                vec3 color = mix(color1, color2, sin(t) * 0.5 + 0.5);
                color = mix(color, color3, chaos);
                
                // Apply effects
                vec3 finalColor = color * ring + color * particles;
                
                // Add glitch at high chaos
                if (chaos > 0.7 && random(vec2(t)) > 0.9) {
                    finalColor = vec3(1.0, 1.0, 1.0);
                }
                
                // Fade at edges
                float alpha = ring + particles * 0.5;
                alpha *= smoothstep(0.5, 0.3, dist);
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `;
        
        const chaosObjectShader = `
            uniform float time;
            uniform float chaos;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            void main() {
                vec2 uv = vUv;
                float t = time * 2.0;
                
                // Base color that shifts with chaos
                vec3 color = vec3(
                    sin(t + vPosition.x) * 0.5 + 0.5,
                    cos(t + vPosition.y) * 0.5 + 0.5,
                    sin(t + vPosition.z) * 0.5 + 0.5
                );
                
                // Add noise
                float n = random(uv + t);
                color += vec3(n) * chaos;
                
                // Pulsing effect
                float pulse = sin(t * 5.0) * 0.2 + 0.8;
                color *= pulse;
                
                // Add random flashes at high chaos
                if (chaos > 0.8 && random(vec2(t)) > 0.95) {
                    color = vec3(1.0);
                }
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        // --- World Data ---
        const worlds = {
            'chaos_nexus': {
                shaders: { 
                    floor: 'chaos_floor', 
                    ceiling: 'chaos_wall', 
                    wall1: 'chaos_wall', 
                    wall2: 'chaos_wall', 
                    wall3: 'chaos_wall', 
                    wall4: 'chaos_wall' 
                },
                portals: [
                    { 
                        triggerBox: new THREE.Box3(new THREE.Vector3(-10, 0, -55), new THREE.Vector3(10, 20, -45)), 
                        toWorld: 'void_realm', 
                        entryPoint: new THREE.Vector3(0, 5, 80),
                        position: new THREE.Vector3(0, 10, -49.9),
                        rotation: new THREE.Euler(0, 0, 0),
                        size: new THREE.Vector2(20, 20)
                    }
                ]
            },
            'void_realm': {
                shaders: { 
                    floor: 'void', 
                    ceiling: 'void', 
                    wall1: 'void', 
                    wall2: 'void', 
                    wall3: 'void', 
                    wall4: 'void' 
                },
                portals: [
                    { 
                        triggerBox: new THREE.Box3(new THREE.Vector3(-10, 0, 95), new THREE.Vector3(10, 20, 105)), 
                        toWorld: 'fractal_dimension', 
                        entryPoint: new THREE.Vector3(0, 5, 0),
                        position: new THREE.Vector3(0, 10, 99.9),
                        rotation: new THREE.Euler(0, Math.PI, 0),
                        size: new THREE.Vector2(20, 20)
                    }
                ]
            },
            'fractal_dimension': {
                shaders: { 
                    floor: 'fractal', 
                    ceiling: 'fractal', 
                    wall1: 'fractal', 
                    wall2: 'fractal', 
                    wall3: 'fractal', 
                    wall4: 'fractal' 
                },
                portals: [
                    { 
                        triggerBox: new THREE.Box3(new THREE.Vector3(-10, 0, -10), new THREE.Vector3(10, 20, 10)), 
                        toWorld: 'chaos_nexus', 
                        entryPoint: new THREE.Vector3(0, 5, 0),
                        position: new THREE.Vector3(0, 10, 0),
                        rotation: new THREE.Euler(0, 0, 0),
                        size: new THREE.Vector2(20, 20)
                    }
                ]
            }
        };
        
        function init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);
            scene.fog = new THREE.Fog(0x000000, 0, 150);
            
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 5, 20);
            
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            
            // --- Create all materials ---
            const createShaderMaterial = (fs, transparent = false) => new THREE.ShaderMaterial({
                uniforms: { 
                    time: { value: 0.0 },
                    chaos: { value: 0.0 }
                },
                vertexShader: vertexShader,
                fragmentShader: fs,
                transparent: transparent,
                depthWrite: !transparent
            });
            
            materials.chaos_floor = createShaderMaterial(chaosFloorShader);
            materials.chaos_wall = createShaderMaterial(chaosWallShader);
            materials.void = createShaderMaterial(voidShader);
            materials.fractal = createShaderMaterial(fractalShader);
            materials.portal = createShaderMaterial(chaosPortalShader, true);
            materials.chaos_object = createShaderMaterial(chaosObjectShader);
            
            // --- Create world geometry ---
            const planeSize = 200;
            const floorGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
            const wallGeometry = new THREE.PlaneGeometry(planeSize, planeSize / 2);
            
            floor = new THREE.Mesh(floorGeometry);
            floor.rotation.x = -Math.PI / 2;
            scene.add(floor);
            
            ceiling = new THREE.Mesh(floorGeometry);
            ceiling.rotation.x = Math.PI / 2;
            ceiling.position.y = planeSize / 2;
            scene.add(ceiling);
            
            wall1 = new THREE.Mesh(wallGeometry);
            wall1.position.set(0, planeSize / 4, -planeSize / 2);
            scene.add(wall1);
            
            wall2 = new THREE.Mesh(wallGeometry);
            wall2.position.set(-planeSize / 2, planeSize / 4, 0);
            wall2.rotation.y = Math.PI / 2;
            scene.add(wall2);
            
            wall3 = new THREE.Mesh(wallGeometry);
            wall3.position.set(planeSize / 2, planeSize / 4, 0);
            wall3.rotation.y = -Math.PI / 2;
            scene.add(wall3);
            
            wall4 = new THREE.Mesh(wallGeometry);
            wall4.position.set(0, planeSize / 4, planeSize / 2);
            wall4.rotation.y = Math.PI;
            scene.add(wall4);
            
            // --- Create portal group ---
            portalsGroup = new THREE.Group();
            scene.add(portalsGroup);
            
            // --- Create chaos objects group ---
            chaosObjects = [];
            
            // --- Load initial world ---
            loadWorld('chaos_nexus');
            
            // --- Event Listeners ---
            document.addEventListener('click', () => document.body.requestPointerLock());
            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('keydown', onKeyDown, false);
            document.addEventListener('keyup', onKeyUp, false);
            window.addEventListener('resize', onWindowResize, false);
        }
        
        function loadWorld(worldId) {
            if (!worlds[worldId]) return;
            currentWorldId = worldId;
            const worldData = worlds[worldId];
            
            // Update materials
            floor.material = materials[worldData.shaders.floor];
            ceiling.material = materials[worldData.shaders.ceiling];
            wall1.material = materials[worldData.shaders.wall1];
            wall2.material = materials[worldData.shaders.wall2];
            wall3.material = materials[worldData.shaders.wall3];
            wall4.material = materials[worldData.shaders.wall4];
            
            // Clear old portals and create new ones
            while (portalsGroup.children.length > 0) {
                portalsGroup.remove(portalsGroup.children[0]);
            }
            
            if (worldData.portals) {
                for (const portalData of worldData.portals) {
                    const portalGeometry = new THREE.PlaneGeometry(portalData.size.x, portalData.size.y);
                    const portalMesh = new THREE.Mesh(portalGeometry, materials.portal);
                    portalMesh.position.copy(portalData.position);
                    portalMesh.rotation.copy(portalData.rotation);
                    portalsGroup.add(portalMesh);
                }
            }
            
            // Trigger reality shift effect
            realityShiftText.style.display = 'block';
            setTimeout(() => {
                realityShiftText.style.display = 'none';
            }, 1500);
        }
        
        function checkPortals() {
            if (isTeleporting) return;
            const worldData = worlds[currentWorldId];
            if (!worldData.portals) return;
            
            for (const portal of worldData.portals) {
                if (portal.triggerBox.containsPoint(camera.position)) {
                    isTeleporting = true;
                    document.body.style.transition = 'opacity 0.5s';
                    document.body.style.opacity = 0;
                    
                    setTimeout(() => {
                        camera.position.copy(portal.entryPoint);
                        loadWorld(portal.toWorld);
                        document.body.style.opacity = 1;
                        setTimeout(() => { isTeleporting = false; }, 500);
                    }, 500);
                    break;
                }
            }
        }
        
        function spawnChaosObject() {
            const geometries = [
                new THREE.BoxGeometry(5, 5, 5),
                new THREE.SphereGeometry(3, 16, 16),
                new THREE.ConeGeometry(3, 6, 8),
                new THREE.TorusGeometry(3, 1, 8, 16)
            ];
            
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const object = new THREE.Mesh(geometry, materials.chaos_object);
            
            // Random position
            object.position.set(
                (Math.random() - 0.5) * 100,
                Math.random() * 20 + 5,
                (Math.random() - 0.5) * 100
            );
            
            // Random rotation
            object.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            // Random movement
            object.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                ),
                rotationSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1
                ),
                lifetime: Math.random() * 10 + 5 // 5-15 seconds
            };
            
            scene.add(object);
            chaosObjects.push(object);
        }
        
        function updateChaosObjects(delta) {
            for (let i = chaosObjects.length - 1; i >= 0; i--) {
                const obj = chaosObjects[i];
                const userData = obj.userData;
                
                // Update position
                obj.position.add(userData.velocity.clone().multiplyScalar(delta));
                
                // Update rotation
                obj.rotation.x += userData.rotationSpeed.x;
                obj.rotation.y += userData.rotationSpeed.y;
                obj.rotation.z += userData.rotationSpeed.z;
                
                // Update lifetime
                userData.lifetime -= delta;
                
                // Remove if lifetime expired
                if (userData.lifetime <= 0) {
                    scene.remove(obj);
                    chaosObjects.splice(i, 1);
                }
            }
        }
        
        function updateChaosMeter() {
            const chaosFill = document.getElementById('chaos-fill');
            chaosFill.style.width = (chaosLevel * 100) + '%';
        }
        
        function triggerChaosEvent() {
            // Random chaos event
            const eventType = Math.floor(Math.random() * 5);
            
            switch(eventType) {
                case 0: // Spawn multiple chaos objects
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => spawnChaosObject(), i * 200);
                    }
                    break;
                case 1: // Rapid world shift
                    const worldKeys = Object.keys(worlds);
                    const randomWorld = worldKeys[Math.floor(Math.random() * worldKeys.length)];
                    loadWorld(randomWorld);
                    break;
                case 2: // Camera shake
                    const originalPosition = camera.position.clone();
                    const shakeIntensity = chaosLevel * 2;
                    let shakeDuration = 0.5;
                    const shakeInterval = setInterval(() => {
                        camera.position.x = originalPosition.x + (Math.random() - 0.5) * shakeIntensity;
                        camera.position.y = originalPosition.y + (Math.random() - 0.5) * shakeIntensity;
                        camera.position.z = originalPosition.z + (Math.random() - 0.5) * shakeIntensity;
                        
                        shakeDuration -= 0.05;
                        if (shakeDuration <= 0) {
                            clearInterval(shakeInterval);
                            camera.position.copy(originalPosition);
                        }
                    }, 50);
                    break;
                case 3: // Flash effect
                    document.body.style.backgroundColor = '#ff00ff';
                    setTimeout(() => {
                        document.body.style.backgroundColor = '#000000';
                    }, 100);
                    break;
                case 4: // Spawn chaos objects in a circle
                    const count = 8;
                    const radius = 30;
                    for (let i = 0; i < count; i++) {
                        const angle = (i / count) * Math.PI * 2;
                        setTimeout(() => {
                            const geometries = [
                                new THREE.BoxGeometry(5, 5, 5),
                                new THREE.SphereGeometry(3, 16, 16),
                                new THREE.ConeGeometry(3, 6, 8),
                                new THREE.TorusGeometry(3, 1, 8, 16)
                            ];
                            
                            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
                            const object = new THREE.Mesh(geometry, materials.chaos_object);
                            
                            object.position.set(
                                Math.cos(angle) * radius,
                                10,
                                Math.sin(angle) * radius
                            );
                            
                            object.userData = {
                                velocity: new THREE.Vector3(
                                    Math.cos(angle) * 0.2,
                                    0,
                                    Math.sin(angle) * 0.2
                                ),
                                rotationSpeed: new THREE.Vector3(
                                    (Math.random() - 0.5) * 0.1,
                                    (Math.random() - 0.5) * 0.1,
                                    (Math.random() - 0.5) * 0.1
                                ),
                                lifetime: 10
                            };
                            
                            scene.add(object);
                            chaosObjects.push(object);
                        }, i * 100);
                    }
                    break;
            }
        }
        
        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();
            
            // Update all shader uniforms
            for (const key in materials) {
                materials[key].uniforms.time.value = time;
                materials[key].uniforms.chaos.value = chaosLevel;
            }
            
            // Update chaos level
            chaosLevel = (Math.sin(time * 0.1) + 1.0) * 0.5; // Oscillate between 0 and 1
            updateChaosMeter();
            
            // Random world shift
            worldShiftTimer += delta;
            if (worldShiftTimer > nextWorldShift) {
                const worldKeys = Object.keys(worlds);
                const randomWorld = worldKeys[Math.floor(Math.random() * worldKeys.length)];
                loadWorld(randomWorld);
                worldShiftTimer = 0;
                nextWorldShift = Math.random() * 15 + 5; // 5-20 seconds
            }
            
            // Trigger chaos events
            if (time - lastChaosEvent > 3.0 && Math.random() < 0.02) {
                triggerChaosEvent();
                lastChaosEvent = time;
            }
            
            // Spawn chaos objects randomly
            if (Math.random() < 0.02) {
                spawnChaosObject();
            }
            
            // Update chaos objects
            updateChaosObjects(delta);
            
            // Update movement
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            direction.z = Number(controls.moveForward) - Number(controls.moveBackward);
            direction.x = Number(controls.moveRight) - Number(controls.moveLeft);
            direction.normalize();
            if (controls.moveForward || controls.moveBackward) velocity.z -= direction.z * moveSpeed * delta;
            if (controls.moveLeft || controls.moveRight) velocity.x -= direction.x * moveSpeed * delta;
            camera.translateX(-velocity.x * delta);
            camera.translateZ(velocity.z * delta);
            camera.position.y = 5;
            
            // Check for portals
            checkPortals();
            
            renderer.render(scene, camera);
        }
        
        // --- Event Handlers ---
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        function onMouseMove(event) {
            if (document.pointerLockElement === document.body) {
                camera.rotation.y -= event.movementX * lookSpeed;
                camera.rotation.x -= event.movementY * lookSpeed;
                camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
            }
        }
        
        function onKeyDown(event) {
            switch (event.code) {
                case 'KeyW': controls.moveForward = true; break;
                case 'KeyA': controls.moveLeft = true; break;
                case 'KeyS': controls.moveBackward = true; break;
                case 'KeyD': controls.moveRight = true; break;
            }
        }
        
        function onKeyUp(event) {
            switch (event.code) {
                case 'KeyW': controls.moveForward = false; break;
                case 'KeyA': controls.moveLeft = false; break;
                case 'KeyS': controls.moveBackward = false; break;
                case 'KeyD': controls.moveRight = false; break;
            }
        }
        
        init();
        animate();
    </script>
</body>
</html>
