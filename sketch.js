var MobileVersion = false;
var ship;
var keys = [];
var bullets = [];
var balls = [];
var bulletspeeds = [];
var shooterimg;
var ballimg;
var score = 0;
var ballLimit = 20;
var CanShoot = true;
var GameOn = false;
var GameEndSequenceOn = false;
var ShowInstructions = true;
var ShipDieing = false;
var xhr = new XMLHttpRequest();
var postlocation = 'https://birdblaster.xyz/api/submit-score';
var commentpostlocation = 'https://birdblaster.xyz/api/submit-comment';
var scoresubmitted = false;
var ShowDieingShip = 1;

//dom elements
var UsernameInput;
var SubmitSocreButton;

//disable spacebar
document.addEventListener("keydown", function(e) {
  if (e.key === " ") {
    e.preventDefault();
  }
});

//Tell if user is using mobile device
// function detectmob() { 
  
//  }

// function detectmob() {
//   if(window.innerWidth <= 800 && window.innerHeight <= 600) {
//     MobileVersion = true;
//   } else {
//     MobileVersion = false;
//   }
// }

//Stop mobile users from being able to put into landscape
// screen.lockOrientation("orientation");

function docNav(option) {
  switch(option){
  case 0: 
    document.getElementById("game-container").scrollIntoView(false);
    break
  case 1:
    document.getElementById("highscores").scrollIntoView(false);
    break
  case 2:
    document.getElementById("comment-area").scrollIntoView(false);
    break
  case 3:
    document.getElementById("footer").scrollIntoView(false);
    break
}
}

//give dom elements click events
document.getElementById('game-nav-tag').addEventListener("click",function(){docNav(0)});
document.getElementById('score-table-nav-tag').addEventListener("click",function(){docNav(1)});
document.getElementById('comment-nav-tag').addEventListener("click",function(){docNav(2)});
document.getElementById('info-nav-tag').addEventListener("click",function(){docNav(3)});
document.getElementById('post-comment-button').addEventListener("click",postcomment);
document.getElementById('game-start-button').addEventListener("click",startgame);

//hide all the elements that show after game is done
document.getElementById('restart-button').style.display = 'none';
document.getElementById("UserNameSubmitHolder").style.display = 'none';
document.getElementById("game-over-text").style.display = 'none';
document.getElementById('user-end-score').style.display = 'none';
document.getElementById('score').style.display = 'none';
  
function preload() {
  shooterimg = loadImage('Assets/ShooterImageIdle.png');
  shooterimgshoot = loadImage('Assets/ShooterImageShoot.png');
  shooterimgdie = loadImage('Assets/ShooterImageDie.png');
  shooterimgdead = loadImage('Assets/ShooterImageDead.png');
  ballimg = loadImage('Assets/FlyingMonster.png');
  gamestartimage = loadImage('Assets/ball-blaster-game-start.png')
}

function setup() {
  //Check what device user is on
  if( navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)
  ){
    MobileVersion = true;
   }
  else {
    MobileVersion = false;
   }
  
  if(MobileVersion){
    document.getElementById('app').style.gridTemplateColumns = "375px";
    var canvas = createCanvas(displayWidth,displayHeight-50);
  }
  else{
  var canvas = createCanvas(1000, 800);
  }
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('game');
  //hook up the submit button
  UsernameInput = select('#username-input');
  SubmitScoreButton = select('#submit-score-button');
  
  ship = new Ship();
  balls = []
  MakeBalls();
  setInterval(MakeBalls, 500);
  setInterval(function () {
    if (GameOn === true & document.visibilityState==='visible') {
      score += 1
    }
  }, 300);
  setInterval(function () {
    CanShoot = true
  }, 150);
  }

function draw() {
  
  //Color the canvas background
  if(GameOn===true | ShowInstructions === false) {
  background(51);
  }
  else if(GameOn===false && ShowInstructions === true){
    background(gamestartimage);
  }
  
  //draw the score
  document.getElementById("score").innerHTML = 'Score: '+score+' Life: '+ship.life

  //check if user is on a different tab
  if(document.visibilityState === 'hidden'){
    return
  }

  //check if the game should be over
  if(ship.life===0){
    GameOn = false;
  }

  //Game End Sequence Start
  if (ship.life===0 & ShowDieingShip === 0){
    GameEndSequenceOn = true;
    ShipDieing = false;
  }
  //Ship Dieing Start
  else if (ship.life === 0 & ShowDieingShip > 0){
    ShipDieing = true;
    setTimeout(() => {
      ShowDieingShip = 0
    }, 350);
  }
  
  if (ship.life===0 & ShowDieingShip === 0 & ship.y>height-110) {
    endgame();
    return
  }
  
    //this is how you shoot this shoot be more specfici
    //and now depend on the window
    if (GameEndSequenceOn === true){
      ship.show(3,MobileVersion);
    }
    else if (ShipDieing === true) {
      ship.show(2,MobileVersion);
    }
    else if (window.MouseDown === false) {
      ship.show(0,MobileVersion);
    } else if (window.MouseDown === true) {
      ship.show(1,MobileVersion)
    }
  
  //Set ship properties that allow movement in the 4 possible directions
  ship.SetShipDirections();

  //Make new bullets when you shoot
  if(window.MouseDown===true && CanShoot ===true & GameOn === true){
    var bullet = new Bullet(ship.x,ship.y)
    bullets.push(bullet)
    bulletspeeds.push([bullets[0].speed * cos(atan2(mouseY - ship.y, mouseX - ship.x)),bullets[0].speed * sin(atan2(mouseY - ship.y, mouseX - ship.x))]);
    CanShoot = false;
  }
  
  //show all the balls
  for (let j = 0; j < balls.length; j++) {
    balls[j].show(MobileVersion);
    balls[j].move(GameOn);
    balls[j].touchingboundary();
    
    //The ball hits the "ship"
    if (ship.hits(balls[j],GameOn)) {
      ship.life = ship.life - 1
      balls.splice(j, 1)
    }
    
  }
  
  //Show all the bullets and move them
  //if a bullet hits the edge remove it from bullets array and its speed
  //from the bulletspeeds array
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].show();
    bullets[i].move(bulletspeeds[i][0],bulletspeeds[i][1]);
    bullets[i].touchingboundary();
    if (bullets[i].hitboundary === true){
      bullets.splice(i,1)
      bulletspeeds.splice(i,1)
    }
    else if (bullets.length>0){
    for (let j = 0; j < balls.length; j++) {
      if(typeof bullets[i] != "undefined") {
        if(bullets[i].hits(balls[j])) {
          balls.splice(j,1)
          bullets.splice(i,1)
          bulletspeeds.splice(i,1)
          score += 10
      }}
    }}
  }

  //Call the move keys down function defined below
  //to keep track of what keys the user has down at any given time
  //Im always just taknig 2 of the move keys in case more then 2 
  //move keys are down
  MoveKeysDown(keyIsDown(87),keyIsDown(65),keyIsDown(83),keyIsDown(68))
  
  ////Tell the ship what direction to go
  // move up
  if (keys.slice(0,2).includes('w') & keys.slice(0,2).length ===1) {
    ship.setDir(1)
  }
  // move down
  else if(keys.slice(0,2).includes('s') & keys.slice(0,2).length ===1) {
    ship.setDir(2)
  }
  // move right
  else if(keys.slice(0,2).includes('d') & keys.slice(0,2).length ===1) {
    ship.setDir(3)
  }
  // move left
  else if(keys.slice(0,2).includes('a') & keys.slice(0,2).length ===1) {
    ship.setDir(4)
  }
  // move up left
  else if (keys.slice(0,2).includes('w') & keys.slice(0,2).includes('a')) {
    ship.setDir(5)
  }
  // move up right
  else if (keys.slice(0,2).includes('w') & keys.slice(0,2).includes('d')) {
    ship.setDir(6)
  }
  // move down left
  else if (keys.slice(0,2).includes('s') & keys.slice(0,2).includes('a')) {
    ship.setDir(7)
  }
  // move down right
  else if (keys.slice(0,2).includes('s') & keys.slice(0,2).includes('d')) {
    ship.setDir(8)
  }
  else if (keys.length === 0) {
    ship.setDir(0)
  }

  ship.move(ship.xdir,GameEndSequenceOn,ShipDieing)
}

//Shoot Bullet
function mousePressed() {
    if(GameOn === true){ 
      var bullet = new Bullet(ship.x,ship.y)
      bullets.push(bullet)
      bulletspeeds.push([bullets[0].speed * cos(atan2(mouseY - ship.y, mouseX - ship.x)),bullets[0].speed * sin(atan2(mouseY - ship.y, mouseX - ship.x))]);
      ship.show(1);
    }
}

function MakeBalls() {
  if(balls.length < ballLimit & GameOn === true & document.visibilityState==='visible'){
  ball = new Ball(MobileVersion);
  ball.determineSpeed();
  balls.push(ball);}
}

function resetSketch() {
  //hide all the end game elements
  document.getElementById('UserNameSubmitHolder').style.display = 'none';
  document.getElementById('game-over-text').style.display = 'none';
  document.getElementById('restart-button').style.display = 'none';
  document.getElementById('defaultCanvas0').style.opacity = 1;
  document.getElementById('username-label').innerHTML = "Enter Username to Submit Score";
  document.getElementById('user-end-score').style.display = 'none';
  
  score = 0
  ship = new Ship();
  balls = [];
  bullets = [];
  GameEndSequenceOn = false;
  GameOn = true;
  ShowDieingShip = 1;
  loop();
}

function endgame() {
  GameOn = false;
  
  balls.forEach((ball) => {
    ball.show(1)
  })
  ship.show(3)
  noLoop();

  //hide in game score
  document.getElementById('score').innerHTML = ''

  //show game over
  document.getElementById('game-over-text').style.display = 'block';
  document.getElementById('defaultCanvas0').style.opacity = .8;
  
  //show the submiting score elements after a delay
  //later this will be dynamic on the score
  // setTimeout(function(){
    document.getElementById('UserNameSubmitHolder').style.display = 'block';
    document.getElementById('restart-button').style.display = 'block';
    document.getElementById('restart-button').style.display = 'block';
    document.getElementById('submit-score-button').style.display = 'block';
    document.getElementById('restart-button').addEventListener("click",resetSketch);
    document.getElementById('submit-score-button').addEventListener("click",postscore);
    document.getElementById('username-input').style.display = "block";
    document.getElementById('user-end-score').innerHTML = 'Your Score is: ' +score;
    document.getElementById('user-end-score').style.display = "block";
  // }
    // ,
    // 500
    // )
  
  

}

//maintains the array keys to let the program
//know what user keys are down
MoveKeysDown = function(up,left,down,right) {
  if (up === true & keys.includes('w')=== false) {
      keys.push('w')
  }
  else if (up === false & keys.includes('w') === true) {
      keys.splice(keys.indexOf('w'), 1)
  }
  else if (left === true & keys.includes('a') === false) {
      keys.push('a')
  }
  else if (left === false & keys.includes('a') === true) {
      keys.splice(keys.indexOf('a'), 1)
  }
  else if (down === true & keys.includes('s') === false) {
      keys.push('s')
  }
  else if (down === false & keys.includes('s') === true) {
      keys.splice(keys.indexOf('s'), 1)
  }
  else if (right === true & keys.includes('d') === false) {
      keys.push('d')
  }
  else if (right === false & keys.includes('d') === true) {
      keys.splice(keys.indexOf('d'), 1)
  }
}

//start the game
function startgame() {
  GameOn = true;
  // ship = new Ship();
  document.getElementById('game-start-button').style.display = 'none';
  ShowInstructions = false;
  document.getElementById('score').style.display = 'block';
  // document.getElementById('game-title').style.display = 'none';
}

//send high score to database
function postscore () {
  xhr.open("POST", postlocation, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  
  //start of internet stuff
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      loadHighScores();
      document.getElementById('submit-score-button').style.display = "none";
      document.getElementById('username-input').style.display = "none";
      document.getElementById('username-label').innerHTML = "Thanks for playing!";
    }
}

  xhr.send(JSON.stringify({
    name: UsernameInput.value(), score: score
  }));
  
}

//send user comments to database
function postcomment () {
  xhr.open("POST", commentpostlocation, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  
//   //start of internet stuff
  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      document.getElementById('user-comments').value = '';
    }
}

  xhr.send(JSON.stringify({
    comment: document.getElementById('user-comments').value
  }));
  
}

//start of index.html stuff
const highscorestable = document.querySelector("#highscorestable > tbody");
    document.addEventListener("DOMContentLoaded",() => {loadHighScores();});
    
    function loadHighScores() {
      var highscores = []
      var xhr = new XMLHttpRequest();
      var getHighScoresLoc = 'https://birdblaster.xyz/api/scores'
      xhr.open("GET",getHighScoresLoc);
      xhr.send();
      xhr.onload = function () {
        // Begin accessing JSON data here
      highscores = JSON.parse(this.response);
      if (xhr.status >= 200 && xhr.status < 400) {
      console.log(highscores);
      populateHighScores(highscores);
      } else {
      console.log('error');
      };
        }
      }

    function populateHighScores(json) {
      //Clears out existing table data
      while (highscorestable.firstChild){
        highscorestable.removeChild(highscorestable.firstChild);
      }

      //Populate Table
      json.forEach((object,index) => {
        const th = document.createElement("th");
        th.scope = "row";
        th.innerHTML = index+1;
        // th.setAttribute("width",20);
        const tr = document.createElement("tr");
        const Scorestd = document.createElement("td");
        const Userstd = document.createElement("td");
        Userstd.textContent = object.player_name
        Scorestd.textContent = object.player_score
        Userstd.setAttribute("class","col-xs-3");
        Scorestd.setAttribute("class","col-xs-3");
        // Userstd.setAttribute("width",50);
        // Scorestd.setAttribute("width",20)
        tr.appendChild(th);
        tr.appendChild(Userstd);
        tr.appendChild(Scorestd);
        highscorestable.appendChild(tr);
      })
    }

    function DrawScore() {
      fill(255);
      text('score: '+score+' Life: '+ship.life, 310,720);
    }
