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
      this.centerX = (this.x + this.width / 2);
      this.centerY = (this.y + this.height / 2);
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
        } else {
          this.y -= this.speed;
        }
      }
      this.centerX = (this.x + this.width / 2);
      this.centerY = (this.y + this.height / 2);
    }
  
    draw = () => {
      canvas.fillStyle = this.color;
      canvas.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  