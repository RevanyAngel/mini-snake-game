const board = document.getElementById('board');
const scoreEl = document.getElementById('score');
const gameOverEl = document.getElementById('game-over');
let snake, food, direction, nextDirection, gameInterval, score;
const gridSize = 10;

function startGame() {
    snake = [{x: 5, y: 5}];
    food = generateFood();
    direction = {x: 0, y: 0}; 
    nextDirection = {x: 0, y: 0};
    score = 0;
    scoreEl.innerText = score;
    gameOverEl.classList.add('hidden');
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 200); 
    draw();
}

function gameLoop() {
    if (nextDirection.x === 0 && nextDirection.y === 0) return;
    direction = nextDirection;

    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize || 
        snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        return endGame();
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.innerText = score;
        food = generateFood();
    } else {
        snake.pop();
    }
    draw();
}

function draw() {
    board.innerHTML = '';
    snake.forEach((seg, i) => {
        const d = document.createElement('div');
        d.style.gridArea = `${seg.y} / ${seg.x}`;
        d.className = `pixel snake ${i===0 ? 'head' : ''}`;
        board.appendChild(d);
    });
    const f = document.createElement('div');
    f.style.gridArea = `${food.y} / ${food.x}`;
    f.className = 'pixel food';
    board.appendChild(f);
}

function generateFood() {
    let newFood;
    while (!newFood || snake.some(s => s.x === newFood.x && s.y === newFood.y)) {
        newFood = { x: Math.ceil(Math.random() * gridSize), y: Math.ceil(Math.random() * gridSize) };
    }
    return newFood;
}

function endGame() {
    clearInterval(gameInterval);
    gameOverEl.classList.remove('hidden');
}

function inputDir(x, y) {
    if ((x !== 0 && direction.x === 0) || (y !== 0 && direction.y === 0)) {
        nextDirection = {x, y};
        if (direction.x === 0 && direction.y === 0) draw();
    }
}

window.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp') inputDir(0, -1);
    if(e.key === 'ArrowDown') inputDir(0, 1);
    if(e.key === 'ArrowLeft') inputDir(-1, 0);
    if(e.key === 'ArrowRight') inputDir(1, 0);
});

startGame();