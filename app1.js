// app1.js - Neural Network Visualizer & Trainer
// Complete app with real-time visualization, data persistence, and interactive training

TentacleOS.api.registerApp({
    id: 'neural-viz',
    name: 'Neural Network Visualizer',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/>
             <circle cx="12" cy="8" r="2"/><circle cx="12" cy="16" r="2"/>
             <circle cx="19" cy="10" r="2"/><circle cx="19" cy="14" r="2"/>
             <path d="m7 8 3-2m0 8-3-2m6-2 3-2m0 4-3 2"/>
             <circle cx="12" cy="12" r="1" fill="currentColor"/>
           </svg>`,
    content: `
        <div style="display: flex; height: 100%; gap: 10px;">
            <div style="flex: 1;">
                <canvas id="networkCanvas" width="400" height="300" style="border: 1px solid var(--border-color); background: var(--bg-deep);"></canvas>
                <div style="margin: 10px 0;">
                    <button id="trainBtn" class="btn-primary">Start Training</button>
                    <button id="pauseBtn" class="btn-secondary">Pause</button>
                    <button id="resetBtn" class="btn-danger">Reset</button>
                    <button id="saveBtn" class="btn-success">Save Model</button>
                    <button id="loadBtn" class="btn-info">Load Model</button>
                </div>
                <div id="dataInput" style="margin: 10px 0;">
                    <h4>Training Data:</h4>
                    <textarea id="trainingData" rows="4" style="width: 100%; background: var(--bg-medium); color: var(--text-primary); border: 1px solid var(--border-color); padding: 5px; font-family: monospace;">0,0,0
0,1,1
1,0,1
1,1,0</textarea>
                    <small>Format: input1,input2,expected_output (XOR example)</small>
                </div>
            </div>
            <div style="width: 200px; padding: 10px; background: var(--bg-medium); border-radius: 4px;">
                <h4 style="color: var(--accent-cyan);">Network Stats</h4>
                <div id="stats">
                    <p>Epoch: <span id="epoch">0</span></p>
                    <p>Error: <span id="error">0.000</span></p>
                    <p>Accuracy: <span id="accuracy">0%</span></p>
                    <p>Learning Rate: <span id="learningRate">0.5</span></p>
                </div>
                <h4 style="color: var(--accent-cyan); margin-top: 20px;">Controls</h4>
                <label>Neurons: <input id="neurons" type="range" min="2" max="8" value="4" style="width: 100%;"></label>
                <label>Learning Rate: <input id="lrSlider" type="range" min="0.1" max="2" step="0.1" value="0.5" style="width: 100%;"></label>
                <h4 style="color: var(--accent-cyan); margin-top: 20px;">Test</h4>
                <input id="testInput1" type="number" min="0" max="1" value="0" placeholder="Input 1">
                <input id="testInput2" type="number" min="0" max="1" value="0" placeholder="Input 2">
                <button id="testBtn" class="btn-info">Test</button>
                <div id="testResult"></div>
            </div>
        </div>
        <style>
            .btn-primary, .btn-secondary, .btn-danger, .btn-success, .btn-info {
                padding: 8px 15px; margin: 2px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s;
            }
            .btn-primary { background: var(--accent-cyan); color: var(--bg-deep); }
            .btn-secondary { background: var(--border-color); color: var(--text-primary); }
            .btn-danger { background: var(--accent-red); color: white; }
            .btn-success { background: var(--accent-green); color: var(--bg-deep); }
            .btn-info { background: var(--accent-magenta); color: white; }
            .btn-primary:hover, .btn-secondary:hover, .btn-danger:hover, .btn-success:hover, .btn-info:hover {
                transform: scale(1.05); opacity: 0.9;
            }
            #testInput1, #testInput2 { width: 45%; margin: 2px; padding: 5px; background: var(--bg-deep); color: var(--text-primary); border: 1px solid var(--border-color); }
        </style>
    `,
    init: function(win) {
        // Neural Network Class
        class NeuralNetwork {
            constructor(inputSize = 2, hiddenSize = 4, outputSize = 1, learningRate = 0.5) {
                this.learningRate = learningRate;
                this.weights1 = this.randomMatrix(inputSize, hiddenSize);
                this.weights2 = this.randomMatrix(hiddenSize, outputSize);
                this.bias1 = this.randomMatrix(1, hiddenSize);
                this.bias2 = this.randomMatrix(1, outputSize);
            }

            randomMatrix(rows, cols) {
                return Array(rows).fill().map(() => Array(cols).fill().map(() => Math.random() * 2 - 1));
            }

            sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
            sigmoidDerivative(x) { return x * (1 - x); }

            forward(input) {
                this.input = input;
                this.hidden = this.matMul([input], this.weights1)[0].map((x, i) => this.sigmoid(x + this.bias1[0][i]));
                this.output = this.matMul([this.hidden], this.weights2)[0].map((x, i) => this.sigmoid(x + this.bias2[0][i]));
                return this.output;
            }

            backward(expected) {
                const outputError = expected.map((exp, i) => exp - this.output[i]);
                const outputDelta = outputError.map((err, i) => err * this.sigmoidDerivative(this.output[i]));
                
                const hiddenError = this.matMulTranspose(this.weights2, outputDelta);
                const hiddenDelta = hiddenError.map((err, i) => err * this.sigmoidDerivative(this.hidden[i]));

                // Update weights
                for (let i = 0; i < this.weights2.length; i++) {
                    for (let j = 0; j < this.weights2[i].length; j++) {
                        this.weights2[i][j] += this.learningRate * this.hidden[i] * outputDelta[j];
                    }
                }
                for (let i = 0; i < this.weights1.length; i++) {
                    for (let j = 0; j < this.weights1[i].length; j++) {
                        this.weights1[i][j] += this.learningRate * this.input[i] * hiddenDelta[j];
                    }
                }

                return Math.abs(outputError[0]);
            }

            matMul(a, b) {
                return a.map(row => b[0].map((_, j) => row.reduce((sum, el, k) => sum + el * b[k][j], 0)));
            }

            matMulTranspose(matrix, vector) {
                return matrix.map(row => row.reduce((sum, el, i) => sum + el * vector[i], 0));
            }

            train(inputs, outputs, epochs = 1) {
                let totalError = 0;
                for (let epoch = 0; epoch < epochs; epoch++) {
                    totalError = 0;
                    for (let i = 0; i < inputs.length; i++) {
                        this.forward(inputs[i]);
                        totalError += this.backward(outputs[i]);
                    }
                }
                return totalError / inputs.length;
            }
        }

        // Initialize components
        const canvas = win.querySelector('#networkCanvas');
        const ctx = canvas.getContext('2d');
        const network = new NeuralNetwork();
        let training = false;
        let epoch = 0;
        let animationId = null;

        // Data parsing
        function parseTrainingData() {
            const data = win.querySelector('#trainingData').value.trim().split('\n');
            const inputs = [], outputs = [];
            data.forEach(line => {
                const parts = line.split(',').map(x => parseFloat(x.trim()));
                if (parts.length >= 3) {
                    inputs.push(parts.slice(0, 2));
                    outputs.push([parts[2]]);
                }
            });
            return { inputs, outputs };
        }

        // Visualization
        function drawNetwork() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00e5ff';
            ctx.strokeStyle = '#ff00e5';
            
            // Draw connections
            const inputY = [100, 200], hiddenY = [60, 120, 180, 240], outputY = [150];
            ctx.lineWidth = 1;
            
            // Input to hidden
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < network.weights1[i].length; j++) {
                    ctx.globalAlpha = Math.abs(network.weights1[i][j]) / 2;
                    ctx.strokeStyle = network.weights1[i][j] > 0 ? '#00e5ff' : '#ff3914';
                    ctx.beginPath();
                    ctx.moveTo(80, inputY[i]);
                    ctx.lineTo(200, hiddenY[j]);
                    ctx.stroke();
                }
            }

            // Hidden to output
            for (let i = 0; i < network.weights2.length; i++) {
                for (let j = 0; j < network.weights2[i].length; j++) {
                    ctx.globalAlpha = Math.abs(network.weights2[i][j]) / 2;
                    ctx.strokeStyle = network.weights2[i][j] > 0 ? '#00e5ff' : '#ff3914';
                    ctx.beginPath();
                    ctx.moveTo(200, hiddenY[i]);
                    ctx.lineTo(320, outputY[j]);
                    ctx.stroke();
                }
            }

            ctx.globalAlpha = 1;
            
            // Draw neurons
            inputY.forEach((y, i) => {
                ctx.beginPath();
                ctx.arc(80, y, 15, 0, Math.PI * 2);
                ctx.fillStyle = '#00e5ff';
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.fillText(`I${i+1}`, 75, y+5);
            });

            hiddenY.slice(0, network.weights1[0].length).forEach((y, i) => {
                ctx.beginPath();
                ctx.arc(200, y, 12, 0, Math.PI * 2);
                const activation = network.hidden ? network.hidden[i] : 0;
                ctx.fillStyle = `rgba(255, 0, 229, ${activation})`;
                ctx.fill();
                ctx.strokeStyle = '#ff00e5';
                ctx.stroke();
            });

            outputY.forEach((y, i) => {
                ctx.beginPath();
                ctx.arc(320, y, 15, 0, Math.PI * 2);
                const activation = network.output ? network.output[i] : 0;
                ctx.fillStyle = `rgba(57, 255, 20, ${activation})`;
                ctx.fill();
                ctx.strokeStyle = '#39ff14';
                ctx.stroke();
                ctx.fillStyle = '#000';
                ctx.fillText(activation ? activation.toFixed(2) : '0.00', 305, y+5);
            });
        }

        // Training loop
        function trainStep() {
            if (!training) return;
            
            const { inputs, outputs } = parseTrainingData();
            if (inputs.length === 0) return;

            network.learningRate = parseFloat(win.querySelector('#lrSlider').value);
            const error = network.train(inputs, outputs, 1);
            epoch++;

            // Update UI
            win.querySelector('#epoch').textContent = epoch;
            win.querySelector('#error').textContent = error.toFixed(4);
            
            // Calculate accuracy
            let correct = 0;
            for (let i = 0; i < inputs.length; i++) {
                const prediction = network.forward(inputs[i])[0];
                if (Math.round(prediction) === outputs[i][0]) correct++;
            }
            win.querySelector('#accuracy').textContent = `${Math.round(correct / inputs.length * 100)}%`;
            
            drawNetwork();
            
            if (training) {
                animationId = requestAnimationFrame(trainStep);
            }
        }

        // Event listeners
        win.querySelector('#trainBtn').onclick = () => {
            training = true;
            trainStep();
        };

        win.querySelector('#pauseBtn').onclick = () => {
            training = false;
            if (animationId) cancelAnimationFrame(animationId);
        };

        win.querySelector('#resetBtn').onclick = () => {
            training = false;
            epoch = 0;
            Object.assign(network, new NeuralNetwork());
            win.querySelector('#epoch').textContent = '0';
            win.querySelector('#error').textContent = '0.000';
            win.querySelector('#accuracy').textContent = '0%';
            drawNetwork();
        };

        win.querySelector('#neurons').oninput = (e) => {
            const size = parseInt(e.target.value);
            Object.assign(network, new NeuralNetwork(2, size, 1, network.learningRate));
            drawNetwork();
        };

        win.querySelector('#lrSlider').oninput = (e) => {
            win.querySelector('#learningRate').textContent = e.target.value;
        };

        win.querySelector('#testBtn').onclick = () => {
            const input1 = parseFloat(win.querySelector('#testInput1').value);
            const input2 = parseFloat(win.querySelector('#testInput2').value);
            const result = network.forward([input1, input2])[0];
            win.querySelector('#testResult').innerHTML = 
                `<div style="margin-top: 10px; padding: 10px; background: var(--bg-deep); border-radius: 4px;">
                    Input: [${input1}, ${input2}]<br>
                    Output: <span style="color: var(--accent-green);">${result.toFixed(4)}</span><br>
                    Rounded: <span style="color: var(--accent-cyan);">${Math.round(result)}</span>
                </div>`;
            drawNetwork();
        };

        // Save/Load functionality
        win.querySelector('#saveBtn').onclick = () => {
            const modelData = JSON.stringify({
                weights1: network.weights1,
                weights2: network.weights2,
                bias1: network.bias1,
                bias2: network.bias2,
                epoch: epoch
            });
            const blob = new Blob([modelData], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'neural_model.json';
            a.click();
        };

        win.querySelector('#loadBtn').onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            network.weights1 = data.weights1;
                            network.weights2 = data.weights2;
                            network.bias1 = data.bias1;
                            network.bias2 = data.bias2;
                            epoch = data.epoch || 0;
                            win.querySelector('#epoch').textContent = epoch;
                            drawNetwork();
                        } catch (err) {
                            alert('Invalid model file');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        };

        // Initial draw
        drawNetwork();
    }
});
