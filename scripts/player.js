const SCALE = 2;
const WIDTH = 16;
const HEIGHT = 18;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const CYCLE_LOOP = [0, 1, 0, 2];
const FRAME_LIMIT = 3;
let currentDirection = FACING_DOWN;
let currentLoopIndex = 0;
let frameCount = 0;



class Player {
    constructor() {
        this.x = 220;
        this.y = 270;
        this.vertical = "";
        this.horizontal = "";
        this.bullets = [];
        this.centerX = (this.x + SCALED_WIDTH / 2);
        this.centerY = (this.y + SCALED_HEIGHT / 2);
    }

    gameLoop = () => {
        let hasMoved = false;
        if (keyPresses.w) {
            this.y -= PLAYER_MOVESPEED;
            this.vertical = "w";
            hasMoved = true;
            currentDirection = FACING_UP;
        } else if (keyPresses.s) {
            this.y += PLAYER_MOVESPEED;
            this.vertical = "s";
            hasMoved = true;
            currentDirection = FACING_DOWN;
        }

        if (keyPresses.a) {
            this.x -= PLAYER_MOVESPEED;
            this.horizontal = "a";
            hasMoved = true;
            currentDirection = FACING_LEFT;
        } else if (keyPresses.d) {
            this.x += PLAYER_MOVESPEED;
            this.horizontal = "d";
            hasMoved = true;
            currentDirection = FACING_RIGHT;
        }

        if (keyPresses[" "]) {
            shootSound.currentTime = 0;
            shootSound.play();
            player.bullets.push(new Bullet(player.centerX - BULLET_SIZE / 2, player.centerY - BULLET_SIZE / 2, player.horizontal, player.vertical));

        }

        this.x = clampSpriteToWalls(this.x, 0, CANVAS_WIDTH - SCALED_WIDTH);
        this.y = clampSpriteToWalls(this.y, 0, CANVAS_HEIGHT - SCALED_HEIGHT);
        this.centerX = (this.x + SCALED_WIDTH / 2);
        this.centerY = (this.y + SCALED_HEIGHT / 2);

        if (hasMoved) {
            frameCount++;
            if (frameCount >= FRAME_LIMIT) {
              frameCount = 0;
              currentLoopIndex++;
              if (currentLoopIndex >= CYCLE_LOOP.length) {
                currentLoopIndex = 0;
              }
            }
          }
          if (!hasMoved) {
            currentLoopIndex = 0;
          }   
    }

    draw = () => {
        canvas.drawImage(img,
            CYCLE_LOOP[currentLoopIndex] * WIDTH, currentDirection * HEIGHT, WIDTH, HEIGHT,
            this.x, this.y, SCALED_WIDTH, SCALED_HEIGHT);
    }
};

var player = new Player();