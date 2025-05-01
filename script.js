const canvas = document.getElementById('game-board');
        const ctx = canvas.getContext('2d');
        const messageBox = document.getElementById('message-box');
        const startButton = document.getElementById('start-button');
        const pauseButton = document.getElementById('pause-button');
        const soundButton = document.getElementById('sound-button');

        const gridSize = 20;
        let snake = [{ x: 10, y: 10 }];
        let food = { x: 15, y: 15 };
        let direction = 'right';
        let gameSpeed = 100; 
        let gameRunning = false;
        let gameInterval;
        let score = 0;
        let soundEnabled = true;
        const particles = []; 

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            
            ctx.fillStyle = '#0f172a'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            
            snake.forEach((segment, index) => {
            
                const gradient = ctx.createLinearGradient(
                    segment.x * gridSize, segment.y * gridSize,
                    (segment.x + 1) * gridSize, (segment.y + 1) * gridSize
                );

                const startColor = `hsl(${(index * 30 + 180) % 360}, 100%, 65%)`;
                const endColor = `hsl(${(index * 30 + 200) % 360}, 100%, 85%)`;

                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, endColor);

                ctx.fillStyle = gradient;

            
                ctx.shadowColor = `hsl(${(index * 30 + 190) % 360}, 100%, 75%)`;
                ctx.shadowBlur = 12;

            
                ctx.strokeStyle = '#6ee7b7';
                ctx.lineWidth = 2;

                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
                ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);

            
                if (index % 2 === 0) {
                    emitParticles(segment.x * gridSize + gridSize / 2, segment.y * gridSize + gridSize / 2, startColor);
                }

                ctx.shadowBlur = 0; 
            });

            
            const foodSize = gridSize * (1 + 0.15 * Math.sin(Date.now() / 150)); 
            ctx.fillStyle = '#f87171';
            ctx.fillRect(food.x * gridSize - (foodSize - gridSize) / 2, food.y * gridSize - (foodSize - gridSize) / 2, foodSize, foodSize);

            
            drawParticles();
        }

        function update() {
            if (!gameRunning) return;

            const head = { x: snake[0].x, y: snake[0].y };

            switch (direction) {
                case 'up':
                    head.y--;
                    break;
                case 'down':
                    head.y++;
                    break;
                case 'left':
                    head.x--;
                    break;
                case 'right':
                    head.x++;
                    break;
            }


            if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
                gameOver();
                return;
            }


            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    gameOver();
                    return;
                }
            }

            snake.unshift(head);


            if (head.x === food.x && head.y === food.y) {
                if (soundEnabled) {
                    playEatSound();
                }
                score += 10;
                food = {
                    x: Math.floor(Math.random() * (canvas.width / gridSize)),
                    y: Math.floor(Math.random() * (canvas.height / gridSize))
                };
            } else {
                snake.pop();
            }

            updateParticles();
            draw();
            messageBox.textContent = `Score: ${score}`;
        }

        function emitParticles(x, y, color) {
            for (let i = 0; i < 3; i++) { 
                particles.push({
                    x: x,
                    y: y,
                    color: color,
                    size: Math.random() * 4 + 2, 
                    speedX: (Math.random() - 0.5) * 3, 
                    speedY: (Math.random() - 0.5) * 3,
                    opacity: 1,
                    decay: 0.02 
                });
            }
        }

        function updateParticles() {
            for (let i = 0; i < particles.length; i++) {
                particles[i].x += particles[i].speedX;
                particles[i].y += particles[i].speedY;
                particles[i].opacity -= particles[i].decay;

                if (particles[i].opacity <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }

        function drawParticles() {
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = particle.opacity;
                ctx.fill();
                ctx.globalAlpha = 1; 
            });
        }

        function startGame() {
            if (gameRunning) return;
            gameRunning = true;
            messageBox.textContent = 'Game Started!';
            gameInterval = setInterval(update, gameSpeed);
            score = 0;
        }

        function pauseGame() {
            gameRunning = false;
            messageBox.textContent = 'Game Paused!';
            clearInterval(gameInterval);
        }

        function gameOver() {
            if (soundEnabled) {
                playGameOverSound();
            }
            gameRunning = false;
            messageBox.textContent = `Game Over! Score: ${score} Press Start to play again.`;
            clearInterval(gameInterval);
            snake = [{ x: 10, y: 10 }];
            direction = 'right';
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            soundButton.textContent = soundEnabled ? 'Sound On' : 'Sound Off';
        }

        document.addEventListener('keydown', (event) => {
            if (!gameRunning) return;
            if (soundEnabled) {
                playMoveSound();
            }
            switch (event.key) {
                case 'ArrowUp':
                    if (direction !== 'down') direction = 'up';
                    break;
                case 'ArrowDown':
                    if (direction !== 'up') direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (direction !== 'right') direction = 'left';
                    break;
                case 'ArrowRight':
                    if (direction !== 'left') direction = 'right';
                    break;
            }
        });

        startButton.addEventListener('click', startGame);
        pauseButton.addEventListener('click', pauseGame);
        soundButton.addEventListener('click', toggleSound);

        draw();