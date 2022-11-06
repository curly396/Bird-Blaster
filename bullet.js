function Bullet(x, y) {
    this.x = x;
    this.y = y;
    this.fired = 0;
    this.hitboundary = false;
    this.radius = 10;
    this.speed = 60;
    this.shooterAdjustx = 50;
    this.shooterAdjusty = 75;
    this.x += this.shooterAdjustx
    this.y += this.shooterAdjusty

    this.show = function () {
        fill(50, 0, 200)
        imageMode(CORNER)
        ellipse(this.x, this.y, this.radius*2, this.radius*2)
    }

    this.move = function (inputx, inputy) {
        this.x = this.x + inputx
        this.y = this.y + inputy
    }

    this.touchingboundary = function () {
        if (this.x>width || this.x<=0 || this.y>= height || this.y<=0) {
            this.hitboundary = true;
        }
    }

    this.hits = function(ball) {
        var distX = Math.abs(this.x - ball.x-ball.width/2);
        var distY = Math.abs(this.y - ball.y-ball.height/2);

        if (distX > (ball.width/2 + this.radius)) { return false; }
        if (distY > (ball.height/2 + this.radius)) { return false; }

        if (distX <= (ball.width/2)) { return true; } 
        if (distY <= (ball.height/2)) { return true; }

        var dx=distX-ball.width/2;
        var dy=distY-ball.height/2;
        return (dx*dx+dy*dy<=(this.radius*this.radius));
    }
}