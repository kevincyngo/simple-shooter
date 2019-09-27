const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 480;
const PLAYER_MOVESPEED = 5;
const BULLET_SIZE = 15;
const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;
var scoreCounter = 0;
var enemies = [];
const FPS = 30;


var canvasElement = document.createElement("canvas");
canvasElement.setAttribute("width", CANVAS_WIDTH);
canvasElement.setAttribute("height", CANVAS_HEIGHT);
canvasElement.setAttribute("style", "border:solid 1px;");


var canvas = canvasElement.getContext("2d");
document.body.appendChild(canvasElement);

const shootSound = document.querySelector(`audio[data-event="shoot"]`);
shootSound.volume = 0.1;
const splatSound = document.querySelector(`audio[data-event="splat"]`);
shootSound.volume = 0.2;

let keyPresses = {};

var score = document.querySelector(`#score`);

let img = new Image();

function loadImage() {
    img.src = 'https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png';
  }
  
loadImage();
const DIFFICULTY = prompt("ENTER DIFFICULTY", 1);

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    if (event.key == " ") {
        shootSound.currentTime = 0;
        shootSound.play();
        player.bullets.push(new Bullet(player.centerX - BULLET_SIZE / 2, player.centerY - BULLET_SIZE / 2, player.horizontal, player.vertical));

    } else {
        keyPresses[event.key] = true;
    }
}
//TODO: finish shooting direction mechanic
window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    if (event.key == "w" || event.key == "s") {
        if (!keyPresses.a && !keyPresses.d) {
            player.vertical = event.key;
            player.horizontal = "";
        } else {
            player.vertical = "";
            player.horizontal = event.key;
        }
    } else if (event.key == "a" || event.key == "d") {
        if (!keyPresses.w && !keyPresses.s) {
            player.horizontal = event.key;
            player.vertical = "";
        } else {
            player.horizontal = "";
            player.vertical = event.key;
        }
    }
    keyPresses[event.key] = false;
}



var clampSpriteToWalls = (position, min, max) => position <= min ? min : position >= max ? max : position;

var drawClearBoard = () => canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

var objCollision = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

var randomEnemyPosition = () => new Enemy(Math.floor(Math.random() * Math.floor(CANVAS_WIDTH - 32)), Math.floor(Math.random() * Math.floor(CANVAS_HEIGHT - 32)));

function handleCollisions() {
    player.bullets.forEach(function (bullet) {
        bullet.wallCollision();
        enemies.forEach(function (enemy) {
            if (objCollision(bullet, enemy)) {
                // enemy.explode();
                splatSound.currentTime = 0;
                splatSound.play();
                enemy.isActive = false;
                bullet.isActive = false;
                scoreCounter++;
                score.innerHTML = scoreCounter;
            }
        });
    });

    enemies.forEach(function (enemy) {
        if (objCollision(enemy, player)) {
            // var gameover = prompt("game over");
            // enemy.explode();
            // player.explode();
        }
    });
}

//general update and drawing
setInterval(function () {
    //updating
    player.gameLoop();
    player.bullets.forEach(item => item.update());

    //check collision
    handleCollisions();

    player.bullets = player.bullets.filter((value) => value.isActive);
    enemies.forEach(item => item.update());
    enemies = enemies.filter((value) => value.isActive);

    //drawing
    drawClearBoard();
    enemies.forEach(item => item.draw());

    player.bullets.forEach(item => item.draw());
    player.draw();
}, 1000 / FPS);

//spawn rate of enemies
setInterval(function () {
    enemies.push(randomEnemyPosition());
}, 5000 / DIFFICULTY);
