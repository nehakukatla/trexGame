//states
var PLAY = 1; 
var END = 0; 
var gameState= PLAY 
//sprites (dist is distance)
var trex;
var ground, ground2, invisibleGround;
var obstaclesGroup, cloudsGroup;
var gameOver, restart, score, dist;
var flag = 0;
//images
var trex_runningImg, trex_collidedImg;
var cloudImg,gameOverImg,groundImg;
var obstacle1Img,obstacle2Img,obstacle3Img; 
var obstacle4Img,obstacle5Img,obstacle6Img;
var restartImg;

function preload(){
  trex_runningImg= loadAnimation("trex.gif");
  trex_collidedImg=loadImage("trex_collided.gif");
  groundImg=loadImage("ground2.gif");
  cloudImg=loadImage("cloud.gif");
  obstacle1Img=loadImage("obstacle1.gif");
  obstacle2Img=loadImage("obstacle2.gif");
  obstacle3Img=loadImage("obstacle3.gif");
  obstacle4Img=loadImage("obstacle4.gif");
  obstacle5Img=loadImage("obstacle5.gif");
  obstacle6Img=loadImage("obstacle6.gif");
  gameOverImg=loadImage("gameOver.gif");
  restartImg=loadImage("restart.gif");
}

function setup(){
createCanvas(displayWidth-20, windowHeight-100)

//create a trex sprite
trex = createSprite(50,180,20,50);
trex.addAnimation("trex_runningImg",trex_runningImg);
trex.addImage("trex_collidedImg", trex_collidedImg);

//place gameOver and restart icon on the screen
gameOver = createSprite(300,140);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.5;
gameOver.visible = false;
restart = createSprite(300,140);
restart.addImage(restartImg);
restart.scale = 0.5;
restart.visible = false;

//create a ground sprite
ground = createSprite(200,180,400,20);
ground.addImage("groundImg",groundImg);
ground.x = ground.width/2;

//put another ground when the 1st one reaches it's end
ground2 = createSprite(200,180,400,20);
ground2.addImage("groundImg",groundImg);
ground2.x = ground.width + ground.width/2;

//invisible Ground to support Trex
invisibleGround = createSprite(displayWidth/2,190,displayWidth, 10);
invisibleGround.visible = false;
invisibleGround.velocityX= 5;


//create obstacle and cloud groups
cloudsGroup = new Group();
obstaclesGroup = new Group();

score = 0;
dist =  ground.width;
}

function draw() {
  //set background
  background(180);

  if(gameState === PLAY){
    //make trex move
    trex.velocityX= 5;

    //start score
    score = score + Math.round(getFrameRate()/60);

    //display score
    text("Score: " + score, trex.x +200, 50);

    //jump when the space key is pressed
    if(keyDown(32)){
      trex.velocityY = -14 ;
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8;

   //moving game camera with trex =>  +500 so that camera is ahead of trex
    //+500 trex seems to be at the left of the screen
    camera.position.x = trex.x + 500;
    /* dist variable shows where the current ground ends
       if trex is reaching the end=>put grounds alternatively ahead of the previous ground
       flag variable helps in putting ground/ground/2 alternatively
    */
    if (trex.x >= dist - displayWidth) {
      if (flag == 0) {
        ground2.x = dist + ground.width / 2;
        //invisibleGround2.x = ground2.x;
        flag = 1;
      }
      else {
        ground.x = dist + ground.width / 2;
        //invisibleGround.x = ground.x;
        flag = 0;
      }
      dist += ground.width;
    }

    //stop trex from falling down
    trex.collide(invisibleGround);
    //trex.collide(invisibleGround2);

    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();

    //End the game when trex is touching the obstacle
    if(trex.isTouching(obstaclesGroup)){
      gameState = END;
    }
  }
  else if(gameState === END) {
    //display gamOver and restart
    gameOver.x = trex.x + 200;
    restart.x = trex.x + 200;
    gameOver.visible = true;
    restart.visible = true;
    
    //if-condition for pressing restart
    if(mousePressedOver(restart)) {
      reset();
    }

    //set velcity of each game object to 0
    trex.velocityX = 0;
    trex.velocityY = 0;
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    //change the trex Image
    trex.changeImage("trex_collidedImg",trex_collidedImg);
  }
  drawSprites();
}
function reset(){
  //start game again
  gameState = PLAY;

  //get rid of the gameOver and restart signs
  gameOver.visible = false;
  restart.visible = false;
  
  //destroy groups o you can make new ones when game starts
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  //change trex collided tp running
  trex.changeImage("trex_runningImg",trex_runningImg);
  
  //reset score
  count = 0;
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    //creat clouds
    var cloud = createSprite(trex.x + displayWidth - 100,120,40,10);

    //make cloud y position random
    cloud.y = Math.round(random(80,120));

    cloud.addImage("cloudImg",cloudImg);
    cloud.scale = 0.5;

    //assign lifetime to the variable
    cloud.lifetime = displayWidth / trex.velocityX + 30;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(World.frameCount % 120 === 0) {
    //create obstacles
    var obstacle = createSprite(trex.x + displayWidth - 100,165,10,40);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));

    switch (rand){
      case 1: obstacle.addImage(obstacle1Img);
      break;
      case 2: obstacle.addImage(obstacle2Img);
      break;
      case 3: obstacle.addImage(obstacle3Img);
      break;
      case 4: obstacle.addImage(obstacle4Img);
      break;
      case 5: obstacle.addImage(obstacle5Img);
      break;
      case 6: obstacle.addImage(obstacle5Img);
      break;
      default: break;
    }
  
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = displayWidth/ trex.velocityX + 30;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}



//
//
//  Ms. Goel, Ignore these below they are just notes |
//                                                   |
//                                                   V
//
//obstacle.addImage("obstacle" + random + ".gif");
//move the ground
//ground.velocityX = -(6 + 3*count/100);
//if (ground.x < 0){
//  ground.x = ground.width/2;
//}
//try: 44- "gameOverImg",48-"restartImg", 67- ground2 --> ground, 132- switch trex and obstacles group; 159 without the extra thing in (); trun changes to adds; 188-189- chand place in code (after addImage and scale); 
//ify: 135; i did 151, 152,153; 159- try animation, or add; make all counts to score
// read 100-119
// no velocities for clouds and obstacle spawn functions
//break , 227
//trex.scale = 0.5; on 39


//Putting another invisible ground when 1st one reaches it's end
//invisibleGround2 = createSprite(ground2.x, 190, ground.width,10);
//invisibleGround2.visible = false;
