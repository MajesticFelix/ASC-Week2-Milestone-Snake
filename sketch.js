let appleImg, playImg, pauseImg, restartImg;
let score = 0;
let pause = true;
let appleX = 425, appleY = 325;
let startingX = 200, startingY = 330;
let snakeX = [], snakeY = [];
let numSegments = 40;
let speed = 3;
let direction = "right";

function preload(){
    appleImg = loadImage("images/apple.png");
    playImg = loadImage("images/play.png");
    pauseImg = loadImage("images/pause.png");
    restartImg = loadImage("images/restart.png");
}

function setup(){
    createCanvas(600,700);
    background(255,255,255);

    //Load Pause, Running, and Restart Buttons
    imageMode(CENTER);
    image(playImg, 525, 675, 50, 50);
    image(restartImg, 575, 675, 50, 50);

    for (let i = 0; i < numSegments; i++) {
        snakeX.push(startingX + i * speed);
        snakeY.push(startingY);
    }
}

function draw(){
    setupGrid();

    //Score Tracker
    image(appleImg, 25, 675, 50, 50);
    noStroke();
    fill(255,255,255);
    rect(60, 650, 50, 50);
    noStroke();
    textSize(50);
    fill(0,0,0);
    text(score, 60, 695);

    for (let i = 0; i < numSegments - 1; i++) {
        stroke(71,117,233);
        strokeWeight(30);
        //line(Math.round(snakeX[i]/25)*25, Math.round(snakeY[i]/25)*25, Math.round(snakeX[i + 1]/25)*25, Math.round(snakeY[i + 1]/25)*25);
        line(snakeX[i], snakeY[i], snakeX[i + 1], snakeY[i + 1]);
    }
    updateSnake();
    checkStatus();
    checkApple();
}


function checkStatus(){
    //Snake head collision checker
    if(snakeX[snakeX.length-1] > 600 || snakeX[snakeX.length-1] < 0 || snakeY[snakeY.length-1] > 650 || snakeY[snakeY.length-1] < 0 || checkHeadCollision()){
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
    image(appleImg, appleX, appleY, 50, 50);
    snakeLeft = snakeX[snakeX.length-1] ;
    snakeRight = snakeX[snakeX.length-1] ;
    snakeTop = snakeY[snakeY.length-1] ;
    snakeBottom = snakeY[snakeY.length-1] ;
    appleLeft = appleX - 25;
    appleRight = appleX + 25;
    appleTop = appleY - 25;
    appleBottom = appleY + 25;
    if(snakeLeft <= appleRight && snakeRight >= appleLeft && snakeTop <= appleBottom && snakeBottom >= appleTop){
        for(let i = 0; i < 15; i++){
            snakeX.unshift(snakeX[0]);
            snakeY.unshift(snakeY[0]);
        }
        numSegments += 15;
        score++;
        updateApple();
    }
}

function updateApple(){
    appleX = Math.round(random(0,575)/50)*50+25;
    appleY = Math.round(random(0,575)/50)*50+25;
}

function setupGrid(){
    //13 rows by 12 columns
    //Tiles are 50x50
    let xPos = 0;
    let yPos = 0;
    let switchColors = false;
    //12 columns
    noStroke();
    for(let c = 0; c < 12; c++){
        //13 rows
        for(let r = 0; r < 13; r++){
            if(switchColors){
                fill(162,209,73); //Light green
                switchColors = false;
            }else{
                fill(64,145,13); //Dark green
                switchColors = true;
            }
            rect(xPos, yPos, 50, 50);
            yPos += 50;
        }
        yPos = 0;
        xPos += 50;
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
    if (keyCode === LEFT_ARROW || keyCode === 65) {
        direction = "left";
    }
    if (keyCode === RIGHT_ARROW || keyCode === 68) {
        direction = "right";
    }
    if (keyCode === UP_ARROW || keyCode === 87) {
        direction = "up";
    }
    if (keyCode === DOWN_ARROW || keyCode === 83) {
        direction = "down";
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
        frameRate(0);
        pause = false;
    }else{
        image(playImg, 525, 675, 50, 50);
        frameRate(60);
        pause = true;
    }
}

function pressedRestart(){
    frameRate(60);
    noStroke();
    fill(255,255,255);
    rect(60, 650, 50, 50);
    score = 0;
    pause = true;
    appleX = 425;
    appleY = 325;
    startingX = 200;
    startingY = 330;
    numSegments = 40;
    direction = "right";
    snakeX = [];
    snakeY = [];
    setup();
    loop();
}

function updateSnake(){
    for (let i = 0; i < numSegments - 1; i++) {
        snakeX[i] = snakeX[i + 1];
        snakeY[i] = snakeY[i + 1];
    }
    if(direction == "left"){
        snakeX[numSegments-1] = snakeX[numSegments-2] - speed;
        snakeY[numSegments-1] = snakeY[numSegments-2];
        console.log('left', numSegments);
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