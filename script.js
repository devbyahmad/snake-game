const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i')

let foodX, foodY;
let snakeX = 5;
let snakeY = 10;
let snakeBody = [];
let velocityX = 0;
let velocityY = 0;
let gameOver = false;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const changeDirection = (e) => {
    if (e.key === 'ArrowUp' && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === 'ArrowDown' && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === 'ArrowLeft' && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === 'ArrowRight' && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

const handleGameOver = () => {
    clearInterval(gameInterval);
    alert(`Game Over! Your Score: ${score}`);
    location.reload();
};

const initGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class='food' style='grid-area: ${foodY} / ${foodX}'></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("high-score", highScore);
        }

        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = [...snakeBody[i - 1]];
    }

    snakeX += velocityX;
    snakeY += velocityY;
    snakeBody[0] = [snakeX, snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[0][0] === snakeBody[i][0] &&
            snakeBody[0][1] === snakeBody[i][1]) {
            gameOver = true;
        }
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class='head' style='grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}'></div>`;
    }

    playBoard.innerHTML = htmlMarkup;
};

controls.forEach(key => {
    key.addEventListener('click',()=>{
        changeDirection({key:key.dataset.key})
    })
});

changeFoodPosition();
let gameInterval = setInterval(initGame, 125);
document.addEventListener('keydown', changeDirection);
