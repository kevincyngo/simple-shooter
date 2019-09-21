var CANVAS_WIDTH = 720;
var CANVAS_HEIGHT = 480;
var PLAYER_MOVESPEED = 5;
var DIFFICULTY = prompt("ENTER DIFFICULTY",1);

var enemies = [];
var FPS = 30;
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


class Bullet {
  constructor(x, y, horizontal, vertical) {
    this.color = "#AAA";
    this.x = x;
    this.y = y;
    this.width = 15;
    this.height = 15;
    this.horizontal = horizontal;
    this.vertical = vertical;
    this.isActive = true;
  }

  update() {
    if (this.vertical === "w") {
      this.y -= 10;
    }  else if (this.vertical === "s") {
      this.y += 10;
    }
    if (this.horizontal === "d") {
      this.x += 10;
    } else if (this.horizontal === "a") {
      this.x -= 10;
    }
    // console.log(this.direction);
  }

  draw() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, 15, 15);
  }

  wallCollision() {
    if (this.y <= 0 || this.y >= CANVAS_HEIGHT || this.x <= 0 || this.x >= CANVAS_WIDTH) {
      this.isActive = false;
    }
   
  }
};


let keyPresses = {};

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    if (event.keyCode === 32) {
      shootSound.currentTime = 0;
      shootSound.play();
      // console.log(this.direction);
      player.bullets.push(new Bullet(player.x, player.y, player.horizontal, player.vertical));
    } else {
    keyPresses[event.key] = true;
  }
}
//TODO: finish shooting direction mechanic
window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
  if ((event.key == "w" || event.key == "s")  && keyPresses['a']) {
    player.vertical = "";
  } else if ((event.key == "w" || event.key == "s") && keyPresses['d']) {
    player.vertical = "";
  } else if ((event.key == "a" || event.key == "d") && (keyPresses['s'] || keyPresses['w'])) {
    player.horizontal = "";
  }
  keyPresses[event.key] = false;
  
}

class Player {
  constructor() {
    this.color = "#00A";
    this.x = 220;
    this.y = 270;
    this.width = 32;
    this.height = 32;
    this.vertical = "";
    this.horizontal = "d";
    this.bullets = [];
    this.centerX = (this.x + this.width/2);
    this.centerY = (this.y + this.height/2);
  }

  gameLoop = () => {
    if (keyPresses.w) {
      this.y -= PLAYER_MOVESPEED;
      this.vertical = "w";
    } else if (keyPresses.s) {
      this.y += PLAYER_MOVESPEED;
      this.vertical = "s";
    }
    if (keyPresses.a) {
      this.x -= PLAYER_MOVESPEED;
      this.horizontal = "a";
    } else if (keyPresses.d) {
      this.x += PLAYER_MOVESPEED;
      this.horizontal = "d";
    }

    this.x = clampSpriteToWalls(this.x, 0, CANVAS_WIDTH - this.width);
    this.y = clampSpriteToWalls(this.y, 0, CANVAS_HEIGHT - this.height);
    this.centerX = (this.x + this.width/2);
    this.centerY = (this.y + this.height/2);
  }

  draw = () => {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  }


};

class Enemy {
  constructor(x, y) {
    this.color = "#fc4503";
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.bullets = [];
    this.isActive = true;
    this.speed = 5;
    this.centerX = (this.x + this.width/2);
    this.centerY = (this.y + this.height/2);
  }

  update = () => {

    if (Math.abs(player.centerX - this.centerX) >= Math.abs(player.centerY - this.centerY)) {
      if (player.centerX > this.centerX) {
        this.x += this.speed;
      } else {
        this.x -= this.speed;
      }
    } else {
      if (player.centerY > this.centerY) {
        this.y += this.speed;
      }else {
        this.y -= this.speed;
      }
    }
    this.centerX = (this.x + this.width/2);
    this.centerY = (this.y + this.height/2);
  }

  draw = () => {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  }
};

var clampSpriteToWalls = (position, min, max) => position <= min ? min : position >= max ? max : position;

var drawClearBoard = () => canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

var objCollision = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

var randomEnemyPosition = () => new Enemy(Math.floor(Math.random() * Math.floor(CANVAS_WIDTH - 32)), Math.floor(Math.random() * Math.floor(CANVAS_HEIGHT - 32)));


function handleCollisions() {
  player.bullets.forEach(function(bullet) {
    bullet.wallCollision();
    enemies.forEach(function(enemy) {
      if (objCollision(bullet, enemy)) {
        // enemy.explode();
        splatSound.currentTime = 0;
        splatSound.play();
        enemy.isActive = false;
        bullet.isActive = false;
      }
    });
  });

  enemies.forEach(function(enemy) {
    if (objCollision(enemy, player)) {
      // var gameover = prompt("game over");
      // enemy.explode();
      // player.explode();
    }
  });
}

var player = new Player();


//general update and drawing
setInterval(function() {
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
  player.draw();
  enemies.forEach(item => item.draw());

  player.bullets.forEach(item => item.draw());
}, 1000/FPS);

//spawn rate of enemies
setInterval(function(){
  enemies.push(randomEnemyPosition());
},5000/DIFFICULTY);




