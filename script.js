var CANVAS_WIDTH = 720;
var CANVAS_HEIGHT = 480;
var PLAYER_MOVESPEED = 15;
var DIFFICULTY = prompt("ENTER DIFFICULTY",1);

var enemies = [];
var FPS = 30;
var canvasElement = document.createElement("canvas");
canvasElement.setAttribute("width", CANVAS_WIDTH);
canvasElement.setAttribute("height", CANVAS_HEIGHT);
canvasElement.setAttribute("style", "border:solid 1px;");


var canvas = canvasElement.getContext("2d");
document.body.appendChild(canvasElement);


class Bullet {
  constructor(x, y, direction) {
    this.color = "#AAA";
    this.x = x;
    this.y = y;
    this.width = 15;
    this.height = 15;
    this.direction = direction;
    this.isActive = true;
  }

  update() {
    if (this.direction === "N") {
      this.y -= 10;
    } else if (this.direction === "E") {
      this.x += 10;
    } else if (this.direction === "S") {
      this.y += 10;
    } else if (this.direction === "W") {
      this.x -= 10;
    }
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


class Player {
  constructor() {
    this.color = "#00A";
    this.x = 220;
    this.y = 270;
    this.width = 32;
    this.height = 32;
    this.direction = "N";
    this.bullets = [];
  }

  update = (keyCode) => {
    if (keyCode === 37) {
      this.x -= PLAYER_MOVESPEED;
      this.direction = "W";
    }
    //up
    else if (keyCode === 38) {
      this.y -= PLAYER_MOVESPEED;
      this.direction = "N";
    }
    //right
    else if (keyCode === 39) {
      this.x += PLAYER_MOVESPEED;
      this.direction = "E";
    }
    //down
    else if (keyCode === 40) {
      this.y += PLAYER_MOVESPEED;
      this.direction = "S";
    }
    //space
    else if (keyCode === 32) {
      this.bullets.push(new Bullet(this.x, this.y, this.direction));
    }

    this.x = clampSpriteToWalls(this.x, 0, CANVAS_WIDTH - this.width);
    this.y = clampSpriteToWalls(this.y, 0, CANVAS_HEIGHT - this.height);
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
    this.direction = "N";
    this.bullets = [];
    this.isActive = true;
  }

  update = () => {
    //decide to move x or y
    //move x
    if (Math.floor(Math.random()*2) === 1) {
      if (this.x < player.x) {
        this.x += 5;
      } else {
        this.x -= 5;
      }
    //move y
    } else {
      if (this.y < player.y) {
        this.y += 5;
      } else {
        this.y -= 5;
      }
    }
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
        enemy.isActive = false;
        bullet.isActive = false;
      }
    });
  });

  // enemies.forEach(function(enemy) {
    // if (objCollision(enemy, player)) {
      // player = null;
  //     enemy.explode();
  //     player.explode();
    // }
  // });
}

var player = new Player();


//general update and drawing
setInterval(function() {
  //updating
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


document.addEventListener("keydown", (event) => {
  player.update(event.keyCode);
});