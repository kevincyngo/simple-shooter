var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;
var PLAYER_MOVESPEED = 15;
var canvasElement = document.createElement("canvas");
canvasElement.setAttribute("width", CANVAS_WIDTH);
canvasElement.setAttribute("height", CANVAS_HEIGHT);
canvasElement.setAttribute("style", "border:solid 1px;");


var canvas = canvasElement.getContext("2d");
document.body.appendChild(canvasElement);


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

  draw = () => {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
    if (this.bullets.length > 0) {
      for (var index = 0 ; index < this.bullets.length; ++index) {
        this.bullets[index].update();

        if (this.bullets[index].collision()) {
          this.bullets[index].draw();
        }else {
          this.bullets = this.bullets.filter((value) => value.collision());
        }
      }
    }
  }


};

class Bullet {
  constructor(x, y, direction) {
    this.color = "#AAA";
    this.x = x;
    this.y = y;
    this.direction = direction;
    // this.collisio = false;
  }

  update() {
    this.x += 0;
    this.y -= 10;
  }

  draw() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, 15, 15);
  }

  collision() {
    if (this.direction === "N" && this.y <= 0) {
      return false;
    }
    return true;
  }

};

// function collisonDetection(obj1, obj2) {...}

function collisionDetectionWall(obj1) {
  if (obj1.x <= 0 || obj1.y <= 0) {
    return true;
  }
  return false;

}

var player = new Player();
var FPS = 30;
setInterval(function() {
  draw();
  player.draw();
}, 1000/FPS);




function draw() {
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}






document.addEventListener("keydown", (event) => {
//left
if (event.keyCode === 37) {
  player.x -= PLAYER_MOVESPEED;
  player.direction = "W";
}
//up
else if (event.keyCode === 38) {
  player.y -= PLAYER_MOVESPEED;
  player.direction = "N";
}
//right
else if (event.keyCode === 39) {
  player.x += PLAYER_MOVESPEED;
  player.direction = "E";
}
//down
else if (event.keyCode === 40) {
  player.y += PLAYER_MOVESPEED;
  player.direction = "S";
}
//space
else if (event.keyCode === 32) {
  player.bullets.push(new Bullet(player.x, player.y, "N"));
}
});