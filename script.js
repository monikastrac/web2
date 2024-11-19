// Dohvacanje elementa gameCanvas, definiran kao canvas u index.html
const canvas = document.getElementById('gameCanvas');
// Canvas objekt pokriva cijeli prozor web preglednika
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

// radimo u 2d, ! jer se sigurno nece vratiti null
const ctx = canvas.getContext('2d');
const paddleWidth = 120;
const paddleHeight = 20;
const ballRadius = 10;
const paddleSpeed = 10;
const paddleY = canvas.height - paddleHeight - 20;

let ballSpeed = 2;
let brickRows = 5;
let brickCols = 6;
let paddleX = (canvas.width - paddleWidth) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height - 40;

// random kut između 45 i 135 stupnja
const angle = Math.random() * Math.PI / 2 + Math.PI / 4;
let ballDX = ballSpeed * Math.cos(angle);
let ballDY = -ballSpeed * Math.sin(angle);
let score = 0;

// Izrada brickova
const bricks = [];

function generateBricks() {
  bricks.length = 0; // makni cigle
  for (let row = 0; row < brickRows; row++) {
    for (let col = 0; col < brickCols; col++) {
      bricks.push({
        x: col * (canvas.width / brickCols) + 5,
        y: row * 40 + 5,
        width: canvas.width / brickCols - 10,
        height: 30,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`, // ton, zasicenost, svjetlina boje
        destroyed: false,
      });
    }
  }
}

function drawBricks() {
  for (const brick of bricks) {
    if (!brick.destroyed) {
      ctx.shadowColor = 'white';
      ctx.shadowBlur = 5;
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    }
  }
}

function drawPaddle() {
  // palica: pravokutnik crvene boje s obaveznim sjenčanjem ruba
  ctx.shadowColor = 'white';
  ctx.shadowBlur = 5;
  ctx.fillStyle = 'red'; 
  ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.shadowBlur = 0;
  ctx.beginPath(); // pocetak linije
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2); // x,y,r, pocetak kruznice, kraj kruznice
  ctx.fillStyle = 'white';
  ctx.closePath(); // spoji krajeve linije
  ctx.fill();
}
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fill

function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
}

function sudar() {
  // Loptica i cigle
  for (const brick of bricks) {
    if (!brick.destroyed && ballX > brick.x && ballX < brick.x + brick.width && 
      ballY - ballRadius > brick.y && ballY - ballRadius < brick.y + brick.height) {

      ballDY *= -1;
      brick.destroyed = true;
      score++;
    }
  }

  // Loptica i rub
  if (ballX - ballRadius <= 0 || ballX + ballRadius >= canvas.width) {
    ballDX *= -1;
  }
  if (ballY - ballRadius <= 0) {
    ballDY *= -1;
  }

  // Loptica i palica
  if (ballY + ballRadius >= paddleY && ballX > paddleX && ballX < paddleX + paddleWidth) {
    ballDY *= -1;
  }
  
}

function updateGame() {
  ballX += ballDX;
  ballY += ballDY;

  if (ballY - ballRadius > canvas.height) {
    alert('GAME OVER');
    document.location.reload();
  }
  if (bricks.every((brick) => brick.destroyed)) {
    alert('Win!');
    document.location.reload();
  }

  sudar();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawBricks();
  drawScore();
}

function gameLoop() {
  updateGame();
  render();
  requestAnimationFrame(gameLoop);
}

// upravljanje palicom
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && paddleX > 0) {
    paddleX -= 2 * paddleSpeed;
  } else if (e.key === 'ArrowRight' && paddleX < canvas.width - paddleWidth) {
    paddleX += 2 * paddleSpeed;
  }
});

// za form
document.getElementById('configForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const brickColsInput = document.getElementById('brickCols');
  const brickRowsInput = document.getElementById('brickRows');
  const ballSpeedInput = document.getElementById('ballSpeed');

  brickCols = parseInt(brickColsInput.value, 10);
  brickRows = parseInt(brickRowsInput.value, 10);
  ballSpeed = parseInt(ballSpeedInput.value, 10);

  generateBricks();
  updateGame();
});

generateBricks();
gameLoop();
