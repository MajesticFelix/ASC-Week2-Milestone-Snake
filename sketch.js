let appleImg, playImg, pauseImg, restartImg, gameOverImg;
let score = 0;
let pause = true;
let appleX = 425, appleY = 325;
let startingX = 200, startingY = 325;
let snakeX = [], snakeY = [];
let numSegments = 20;
let speed = 5;
let direction = "right";
let backgroundMusic, appleBite, bump; 

function preload(){
    //Load images
    appleImg = loadImage("images/apple.png");
    playImg = loadImage("images/play.png");
    pauseImg = loadImage("images/pause.png");
    restartImg = loadImage("images/restart.png");
    gameOverImg = loadImage("images/gameOver.png");

    //Load sounds
    backgroundMusic = loadSound("sounds/The Legend of Ninetales - Pokémon Mystery Dungeon Rescue Team DX.mp3");
    appleBite = loadSound("sounds/appleBite.mp3");
    bump = loadSound("sounds/bump.mp3");
}

function setup(){
    createCanvas(600,700);
    background(255);

    //Load Pause, Running, and Restart Buttons
    backgroundMusic.play();
    imageMode(CENTER);
    image(playImg, 525, 675, 50, 50);
    image(restartImg, 575, 675, 50, 50);

    for (let i = 0; i < numSegments; i++) {
        snakeX.push(startingX + i + speed);
        snakeY.push(startingY);
    }
}

function draw(){
    //setupGrid();
    noStroke();
    fill(0);
    rect(0,0,600,650);

    //Score Tracker
    image(appleImg, 25, 675, 50, 50);
    noStroke();
    fill(255,255,255);
    rect(60, 650, 50, 50);
    noStroke();
    textSize(40);
    fill(0,0,0);
    text(score, 60, 695);

    for (let i = 0; i < numSegments - 1; i++) {
        stroke(71,117,233);
        strokeWeight(30);
        line(snakeX[i], snakeY[i], snakeX[i + 1], snakeY[i + 1]);
    }
    updateSnake();
    checkStatus();
    checkApple();
}


function checkStatus(){
    //Snake head collision checker
    if(snakeX[snakeX.length-1] > 600 || snakeX[snakeX.length-1] < 0 || snakeY[snakeY.length-1] > 650 || snakeY[snakeY.length-1] < 0 || checkHeadCollision()){
        image(gameOverImg, 300, 300, 500, 500);
        backgroundMusic.stop();
        bump.play();        
        noLoop();
        noStroke();
        textSize(50);
        fill(0,0,0);
        text(`Final Score: ${score}`, 150, 695);
    }
}

function checkHeadCollision(){
    for (let i = 0; i < snakeX.length - 1; i++) {
        if (snakeX[i] === snakeX[snakeX.length-1] && snakeY[i] === snakeY[snakeY.length-1]) {
          return true;
        }
    }
}

function checkApple(){
    //Checks for collision with the apple
    image(appleImg, appleX, appleY, 50, 50);
    snakeLeft = snakeX[snakeX.length-1] - 3;
    snakeRight = snakeX[snakeX.length-1] + 3;
    snakeTop = snakeY[snakeY.length-1] - 3;
    snakeBottom = snakeY[snakeY.length-1] + 3;
    appleLeft = appleX - 25;
    appleRight = appleX + 25;
    appleTop = appleY - 25;
    appleBottom = appleY + 25;
    if(snakeLeft <= appleRight && snakeRight >= appleLeft && snakeTop <= appleBottom && snakeBottom >= appleTop){
        appleBite.play();
        //Make the Snake longer
        for(let i = 0; i < 10; i++){
            snakeX.unshift(snakeX[0]);
            snakeY.unshift(snakeY[0]);
        }
        numSegments += 10;
        score++;
        updateApple();
    }
}

function updateApple(){
    appleX = Math.round(random(0,575)/50)*50+25;
    appleY = Math.round(random(0,575)/50)*50+25;
}

function updateSnake(){
    for (let i = 0; i < numSegments - 1; i++) {
        snakeX[i] = snakeX[i + 1];
        snakeY[i] = snakeY[i + 1];
    }
    if(direction == "left"){
        snakeX[numSegments-1] = snakeX[numSegments-2] - speed;
        snakeY[numSegments-1] = snakeY[numSegments-2];
        console.log('left',numSegments);
    }else if(direction == "right"){
        snakeX[numSegments-1] = snakeX[numSegments-2] + speed;
        snakeY[numSegments-1] = snakeY[numSegments-2];
        console.log('right',numSegments);
    }else if(direction == "up"){
        snakeX[numSegments-1] = snakeX[numSegments-2];
        snakeY[numSegments-1] = snakeY[numSegments-2] - speed;
        console.log('up',numSegments);
    }else if(direction == "down"){
        snakeX[numSegments-1] = snakeX[numSegments-2];
        snakeY[numSegments-1] = snakeY[numSegments-2] + speed;
        console.log('down',numSegments);
    }
}

function keyPressed(){
    //Spacebar or esc key to pause/play
    if(keyCode === 32 || keyCode === 27){
        pressedPlayOrPauseButtons();
    }

    //R key to reset
    if(keyCode == 82){
        pressedRestart();
    }

    //Snake move mechanics
    if (keyCode == LEFT_ARROW || keyCode == 65) {
        if (direction !== "right") { // Prevent turning back right
            direction = "left";
        }
    }
    if (keyCode == RIGHT_ARROW || keyCode == 68) {
        if (direction != "left") { // Prevent turning back left
            direction = "right";
        }
    }
    if (keyCode == UP_ARROW || keyCode == 87) {
        if (direction != "down") { // Prevent turning back down
            direction = "up";
        }
    }
    if (keyCode == DOWN_ARROW || keyCode == 83) {
        if (direction != "up") { // Prevent turning back up
            direction = "down";
        }
    }
}

function mouseClicked(){
    //play or pause button
    if(mouseX <= 550 && mouseX >= 500 && mouseY <= 700 && mouseY >= 650){
        pressedPlayOrPauseButtons();
    }
    //restart button
    if(mouseX <= 600 && mouseX >= 550 && mouseY <= 700 && mouseY >= 650){
        pressedRestart();
    }
}

function pressedPlayOrPauseButtons(){
    noStroke();
    fill(255,255,255);
    rect(500, 650, 50, 50);
    if(pause){
        image(pauseImg, 525, 675, 50, 50);
        backgroundMusic.stop();
        frameRate(0);
        pause = false;
    }else{
        image(playImg, 525, 675, 50, 50);
        backgroundMusic.play();
        frameRate(60);
        pause = true;
    }
}

function pressedRestart(){
    frameRate(60);
    backgroundMusic.stop();
    noStroke();
    fill(255,255,255);
    rect(60, 650, 50, 50);
    score = 0;
    pause = true;
    appleX = 425;
    appleY = 325;
    startingX = 200;
    startingY = 325;
    numSegments = 20;
    direction = "right";
    snakeX = [];
    snakeY = [];
    setup();
    loop();
}

