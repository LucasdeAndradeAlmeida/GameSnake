const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score-value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const btnPlay = document.querySelector(".btn-play");

const audio = new Audio("assets/audio/audio.mp3");

const size = 20;

const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

let snake = [
  { x: 200, y: 200 },
  { x: 220, y: 200 },
];

const food = {
  x: Math.floor(Math.random() * 20 + 1) * size,
  y: Math.floor(Math.random() * 20 + 1) * size,
  color: "#ff0000",
};

let direction, loopId;

const moveSnake = () => {
  if (!direction) return;

  const head = snake.at(-1);

  snake.shift();

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y });
  } else if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y });
  } else if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size });
  } else if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size });
  }
};

const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};
const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  for (let i = 20; i < canvas.width; i += 20) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 500);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(500, i);
    ctx.stroke();
  }
};

const drawSnake = () => {
  ctx.fillStyle = "#ddd";

  snake.forEach((square, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "#fff";
    }
    ctx.fillRect(square.x, square.y, size, size);
  });
};

const checkEat = () => {
  const head = snake.at(-1);

  if (head.x == food.x && head.y == food.y) {
    incrementScore();
    snake.push(head);
    audio.play();
    food.x = Math.floor(Math.random() * 20 + 1) * size;
    food.y = Math.floor(Math.random() * 20 + 1) * size;
  }
};

const checkCollision = () => {
  const head = snake.at(-1);
  const limit = canvas.width - size;
  const neckIndex = snake.length - 2;
  const wallCollision =
    head.x < 0 || head.x > limit || head.y < 0 || head.y > limit;

  const snakeCollision = snake.find((square, index) => {
    return index < neckIndex && head.x == square.x && head.y == square.y;
  });

  if (wallCollision || snakeCollision) {
    gameOver();
  }
};

const gameOver = () => {
  direction = undefined;
  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(5px)";
};
const game = () => {
  clearInterval(loopId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkCollision();

  loopId = setTimeout(() => game(), 200);
};

game();

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowRight" && direction != "left") {
    direction = "right";
  } else if (event.key == "ArrowLeft" && direction != "right") {
    direction = "left";
  } else if (event.key == "ArrowUp" && direction != "down") {
    direction = "up";
  } else if (event.key == "ArrowDown" && direction != "up") {
    direction = "down";
  }
});

btnPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";
  snake = [
    { x: 200, y: 200 },
    { x: 220, y: 200 },
  ];
});
