function Ship() {
    
    this.x = width/2-68;
    this.y = height/2;
    this.xdir=0;
    this.life = 3;
    this.width = shooterimg.width/4
    this.height = shooterimg.height/4
    this.CanMoveUp = true;
    this.CanMoveDown = true;
    this.CanMoveLeft = true;
    this.CanMoveRight = true;

    xspeed = 10
    yspeed = 10

    this.show = function(input,mobile) {
        fill(255);
        this.dx = mouseX - this.x;
        this.dy = mouseY - this.y;
        imageMode(CORNER)
        
        //maket the ship smaller if game is being played on mobile
        if (mobile === true) {
            sizereduction = 8
        } else {
            sizereduction = 4
        }

        //figure out which shooter img to show
        switch(input){
            case 0:
                image(shooterimg, this.x, this.y, shooterimg.width/sizereduction, shooterimg.height/sizereduction)
                break;
            case 1:
                image(shooterimgshoot, this.x, this.y, shooterimg.width/sizereduction, shooterimg.height/sizereduction)
                break;
            case 2:
                image(shooterimgdie, this.x, this.y, shooterimg.width/sizereduction, shooterimg.height/sizereduction)
                break;
            case 3:
                image(shooterimgdead, this.x, this.y, shooterimg.width/sizereduction, shooterimg.height/sizereduction)
                break;    
        }  
    }

    //SHOOT THE BALL!!!
    this.shoot = function() {
        fill(255);
        imageMode(CENTER);
        image(shooterimgshoot, this.x, this.y, shooterimg.width/4, shooterimg.height/4);
    }

    this.setDir = function(dir) {
        this.xdir = dir;
    }

    //determine where Ship can move
    this.SetShipDirections = function() {
        //on the bottom right edge
        if (this.x >= width-this.width/2 & this.y >= height-this.height/2) {
            this.CanMoveUp = true;
            this.CanMoveDown = false;
            this.CanMoveLeft = true;
            this.CanMoveRight = false;
        }
        //on the bottom left edge
        else if (this.x <= this.width/2 & this.y >= height-this.height/2) {
            this.CanMoveUp = true;
            this.CanMoveDown = false;
            this.CanMoveLeft = false;
            this.CanMoveRight = true;
        }
        //on the top right edge
        else if (this.x >= width-this.width/2 & this.y <= 0+this.height/2) {
            this.CanMoveUp = false;
            this.CanMoveDown = true;
            this.CanMoveLeft = true;
            this.CanMoveRight = false;
        } 
        //on the top left edge
        else if (this.x <= this.width/2 & this.y <= 0+this.height/2) {
            this.CanMoveUp = false;
            this.CanMoveDown = true;
            this.CanMoveLeft = false;
            this.CanMoveRight = true;
        }
        // right edge only
        else if(this.x >= width-this.width/2) {
            this.CanMoveUp = true;
            this.CanMoveDown = true;
            this.CanMoveLeft = true;
            this.CanMoveRight = false;
        }
        // left edge only
        else if (this.x <= this.width/2) {
            this.CanMoveUp = true;
            this.CanMoveDown = true;
            this.CanMoveLeft = false;
            this.CanMoveRight = true;
        }
        // bottom edge only
        else if (this.y >= height-this.height/2) {
            this.CanMoveUp = true;
            this.CanMoveDown = false;
            this.CanMoveLeft = true;
            this.CanMoveRight = true;
        }
        // top edge only
        else if (this.y <= 0+this.height/2) {
            this.CanMoveUp = false;
            this.CanMoveDown = true;
            this.CanMoveLeft = true;
            this.CanMoveRight = true;
        }
        //You are not on a edge
        else {
            this.CanMoveUp = true;
            this.CanMoveDown = true;
            this.CanMoveLeft = true;
            this.CanMoveRight = true;
        }
    }

    this.move = function(dir,GameEndSequence, ShipDieing) {
        
        //The ship falls when the game is over so dont disable controls
        if(ShipDieing === true) {
            return;
        }
        //If the ship is dieing dont move it
        else if(GameEndSequence === true) {
            this.y += 10
            return;
        }
        
        switch(dir) {
            case 0:
            break;
            // move up
            case 1:
            if (this.CanMoveUp === true) {
                this.y = this.y - yspeed
            }  
            break;
            // move down
            case 2:
            if (this.CanMoveDown === true) {
            this.y = this.y + yspeed
            }
            break;
            // move right
            case 3:
            if (this.CanMoveRight === true) {
                this.x = this.x + xspeed}
            break;
            // move left
            case 4:
            if (this.CanMoveLeft === true) {
                this.x = this.x - xspeed}
            break;
            // move up left
            case 5:
            if (this.CanMoveUp === true & this.CanMoveLeft === true) {
                this.y = this.y - yspeed
                this.x = this.x - xspeed 
            }
            else if (this.CanMoveUp === true) {
                this.y = this.y - yspeed
            }
            else if (this.CanMoveLeft === true) {
                this.x = this.x - xspeed
            }
            break;
            // move up right
            case 6:
            if (this.CanMoveUp === true & this.CanMoveRight === true) {
                this.y = this.y - yspeed
                this.x = this.x + xspeed
            }
            else if (this.CanMoveUp === true) {
                this.y = this.y - yspeed
            }
            else if (this.CanMoveRight === true) {
                this.x = this.x + xspeed
            }
            break;
            //move down left
            case 7:
            if (this.CanMoveDown === true & this.CanMoveLeft === true) {
                this.y = this.y + yspeed
                this.x = this.x - xspeed
            }
            else if (this.CanMoveDown === true) {
                this.y = this.y + yspeed
                }
            else if (this.CanMoveLeft === true) {
                this.x = this.x - xspeed
                }
            break;
            // move down right
            case 8:
            if (this.CanMoveDown === true & this.CanMoveRight === true) {
                this.y = this.y + yspeed
                this.x = this.x + xspeed
                }
            else if (this.CanMoveDown === true) {
                this.y = this.y + yspeed
                }
            else if (this.CanMoveRight === true) {
                this.x = this.x + xspeed
                }
            break;
    } 
 }

 //figure out if ball hits the ship
 this.hits = function(ball,gameon) {
    if(gameon === true){
        var d = dist(this.x, this.y, ball.x, ball.y);
        return d < this.height/2+ball.height/2 
    }
}

}