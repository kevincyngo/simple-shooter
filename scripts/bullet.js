class Bullet {
    constructor(x, y, horizontal, vertical) {
        this.color = "#AAA";
        this.x = x;
        this.y = y;
        this.width = BULLET_SIZE;
        this.height = BULLET_SIZE;
        this.horizontal = horizontal;
        this.vertical = vertical;
        this.isActive = true;
    }

    update() {
        if (this.vertical == "w") {
            this.y -= 10;
        } else if (this.vertical == "s") {
            this.y += 10;
        }
        if (this.horizontal == "d") {
            this.x += 10;
        } else if (this.horizontal == "a") {
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