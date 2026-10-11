const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const healthEl = document.getElementById("health");

let score = 0;
let health = 100;

const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  speed: 6,
  dx: 0
};

const enemies = [];
const enemyInterval = 800;
let lastEnemyTime = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    player.dx = -player.speed;
  } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    player.dx = player.speed;
  }
});

document.addEventListener("keyup", (e) => {
  if (
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "a" ||
    e.key === "A" ||
    e.key === "d" ||
    e.key === "D"
  ) {
    player.dx = 0;
  }
});

function spawnEnemy() {
  const size = Math.random() * 20 + 20;
  const x = Math.random() * (canvas.width - size);
  const speed = Math.random() * 2 + 2;
  enemies.push({ x, y: -size, size, speed });
}

function update(time = 0) {
  if (health <= 0) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 90, canvas.height / 2);
    return;
  }

  player.x += player.dx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  if (time - lastEnemyTime > enemyInterval) {
    spawnEnemy();
    lastEnemyTime = time;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00e5ff";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    enemy.y += enemy.speed;

    ctx.fillStyle = "#ff0055";
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);

    if (
      player.x < enemy.x + enemy.size &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.size &&
      player.y + player.height > enemy.y
    ) {
      health -= 10;
      healthEl.innerText = health;
      enemies.splice(i, 1);
      i--;
      continue;
    }

    if (enemy.y > canvas.height) {
      score += 1;
      scoreEl.innerText = score;
      enemies.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(update);
}

update();