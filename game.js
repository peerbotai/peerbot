const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// Game settings
const gridSize = 20;
const cellSize = 20;
canvas.width = gridSize * cellSize;
canvas.height = gridSize * cellSize;

let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
let food = generateFood();
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameSpeed = 100;

highScoreElement.textContent = highScore;

// Generate random food position
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

// Draw functions
function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        const color = index === 0 ? '#4caf50' : '#66bb6a';
        drawCell(segment.x, segment.y, color);
    });

    // Draw food
    ctx.fillStyle = '#ff5252';
    ctx.beginPath();
    ctx.arc(food.x * cellSize + cellSize/2, food.y * cellSize + cellSize/2, cellSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();
}

// Game logic
function update() {
    if (!gameRunning) return;

    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    // Check wall collision
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        gameOver();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        food = generateFood();
        // Increase speed slightly
        gameSpeed = Math.max(50, gameSpeed - 2);
    } else {
        snake.pop();
    }

    draw();
}

function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverDiv.style.display = 'block';

    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    direction = {x: 0, y: 0};
    food = generateFood();
    score = 0;
    scoreElement.textContent = score;
    gameSpeed = 100;
    gameOverDiv.style.display = 'none';
    draw();
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        startBtn.textContent = 'Pause';
        gameLoop();
    } else {
        gameRunning = false;
        startBtn.textContent = 'Resume';
    }
}

function gameLoop() {
    if (gameRunning) {
        update();
        setTimeout(gameLoop, gameSpeed);
    }
}

// Controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction.y === 0) {
                direction = {x: 0, y: -1};
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y === 0) {
                direction = {x: 0, y: 1};
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x === 0) {
                direction = {x: -1, y: 0};
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x === 0) {
                direction = {x: 1, y: 0};
            }
            break;
    }
});

// Touch controls for mobile
let touchStartX = null;
let touchStartY = null;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY || !gameRunning) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction.x === 0) {
            direction = {x: -1, y: 0};
        } else if (direction.x === 0) {
            direction = {x: 1, y: 0};
        }
    } else {
        if (diffY > 0 && direction.y === 0) {
            direction = {x: 0, y: -1};
        } else if (direction.y === 0) {
            direction = {x: 0, y: 1};
        }
    }
});

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
    resetGame();
    startGame();
});

// Initialize
draw();