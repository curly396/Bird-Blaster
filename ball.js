function Ball(mobile) {

this.radius = 25
if(mobile){
    this.imagereduction = 25
}
else{
    this.imagereduction = 14
}
this.hitboundary = false
this.spawned = false
this.width = ballimg.width/this.imagereduction
this.height = ballimg.height/this.imagereduction

this.show = function (mobile) {
    fill(50, 0, 200)
    imageMode(CORNER)

    if(this.spawned === false) {
        switch (Math.round(Math.random() * 3)) {
            //Spawn from top
            case 0:
                this.y = height
                this.x = Math.random() * width
                break;
            //Spawn from bottom
            case 1:
                this.y = 0
                this.x = Math.random() * width
                break;
            //Spawn from left
            case 2:
                this.y = Math.random() * height
                this.x = 0
                break;
            //Spawn from right
            case 3:
                this.y = Math.random() * height
                this.x = width
                break;
        }
    }
    image(ballimg, this.x, this.y, this.width, this.height)
    this.spawned = true
}

this.determineSpeed = function() {
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    if(Math.round(Math.random()) === 0){
        this.xspeed = plusOrMinus*Math.random()*3+5
        this.yspeed = plusOrMinus*8
        }
    else {
        this.xspeed = plusOrMinus*8
        this.yspeed = plusOrMinus*Math.random()*3+5
    }
}

this.move = function(GameOn) {
    //only move balls if game is on
    if(GameOn === true){
        this.x -= this.xspeed
        this.y -= this.yspeed
    }
}

this.touchingboundary = function () {
    //hit right edge
    if (this.x>width || this.x<0) {
        this.xspeed *= -1
    }
    else if (this.y> height || this.y<0)
    {
        this.yspeed *= -1
    }
    }

//ballhitsball
this.ballhit = function(ball) {
    //var d = dist(this.x, this.y, ball.x, ball.y);
    if (this.x - this.width/2 < ball.x + this.width/2 &
		this.x + this.width/2 > ball.x - this.width/2 &
		this.y - this.height/2 < ball.y + this.height/2 &
		this.y + this.height/2 > ball.y - this.height/2 ) {
            this.xspeed *= -1;
            this.yspeed *= -1;
            //print('hit it')
    }
    }

}

