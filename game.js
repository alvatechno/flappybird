const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 320;
canvas.height = 480;

// Load assets
const birdImg = new Image();
birdImg.src = 'assets/bird.png';

const bgImg = new Image();
bgImg.src = 'assets/bg.png';

const pipeNorth = new Image();
pipeNorth.src = 'assets/pipeNorth.png';

const pipeSouth = new Image();
pipeSouth.src = 'assets/pipeSouth.png';

// Variables
let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

let pipes = [];
let pipeGap = 100;
let frame = 0;
let score = 0;
let gameOver = false;

// Control the bird
document.addEventListener('keydown', () => {
    bird.velocity = bird.lift;
});

// Generate pipes
function createPipe() {
    let pipeHeight = Math.floor(Math.random() * canvas.height / 2);
    pipes.push({
        x: canvas.width,
        y: pipeHeight
    });
}

// Update the game
function updateGame() {
    if (gameOver) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Check collision with the ground or sky
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
    }

    // Move and generate pipes
    pipes.forEach((pipe, index) => {
        pipe.x -= 2;
        if (pipe.x + pipeNorth.width <= 0) {
            pipes.splice(index, 1);
            score++;
        }

        // Check collision with pipes
        if (
            bird.x < pipe.x + pipeNorth.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y + pipeNorth.height ||
             bird.y + bird.height > pipe.y + pipeGap)
        ) {
            gameOver = true;
        }
    });

    if (frame % 100 === 0) createPipe();
    frame++;
}

// Draw the game
function drawGame() {
    ctx.drawImage(bgImg, 0, 0);

    pipes.forEach(pipe => {
        ctx.drawImage(pipeNorth, pipe.x, pipe.y);
        ctx.drawImage(pipeSouth, pipe.x, pipe.y + pipeNorth.height + pipeGap);
    });

    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);

    if (gameOver) {
        ctx.fillText('Game Over', canvas.width / 2 - 50, canvas.height / 2);
    }
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Start the game
birdImg.onload = () => {
    gameLoop();
};
