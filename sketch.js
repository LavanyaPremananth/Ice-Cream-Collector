/*

COURSEWORK 1.2 GAME PROJECT SUBMISSION [001]

*/

var gameChar_world_x;

var gameChar_x;
var gameChar_y;
var gameChar_width;
var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var scrollPos;

var clouds;
var trees_x;
var mountains;
var canyons;
var collectables;

const drops =[];

function setup(){
    
	createCanvas(1024, 576);
    c1 = color(63, 191, 191);
    c2 = color(255);
    
//BACKGROUND SNOW
    for(let x = 0; x < width; x++) {
    drops[x] = random(height);
  }
    
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    gameChar_width = 50;

//BOOLIAN VARIABLES T0 CONTROL THE MOVEMENT OF THE GAME CHARACTER.
    isLeft       = false;
    isRight      = false;
    isFalling    = false;
    isPlummeting = false;
    
//VARIABLE TO CONTROL THE BACKGROUND SCROLLING.
    scrollPos = 0;

//INITIALSE gameChar_world_x.
    gameChar_world_x = gameChar_x;

//INITIALISE ARRAYS OF SCENERY OBJECTS    
    clouds = [{pos_x:-100,pos_y:150, size:30},
              {pos_x:200, pos_y:50,  size:30},
              {pos_x:500, pos_y:100, size:20},
              {pos_x:800, pos_y:70,  size:35}];
    
    trees_x = [-50, 350, 1400, 2000,];
    
    mountains = [{pos_x:360,  pos_y:floorPos_y, height:350, width:200},
                 {pos_x:520,  pos_y:floorPos_y, height:250, width:100},
                 {pos_x:1100, pos_y:floorPos_y, height:250, width:100},
                 {pos_x:1190, pos_y:floorPos_y, height:150, width:50}];
    
    collectables = [{x_pos:10,   y_pos:floorPos_y, size: 30, isFound:false},
                    {x_pos:200,  y_pos:floorPos_y, size: 30, isFound:false},
                    {x_pos:700,  y_pos:floorPos_y, size: 30, isFound:false},
                    {x_pos:1000, y_pos:floorPos_y, size: 30, isFound:false}];
    

    canyons = [{x_pos:80, width:100},
               {x_pos:800, width:100},
               {x_pos:1500, width:100}];
    
}

//UPDATE THE REAL POSITION OF THE GAMECHAR FOR COLLISION DETECTION
    gameChar_world_x = gameChar_x - scrollPos;

//---------------
//  DRAWING CODE 
//---------------

function draw(){
    
//BACKGROUND GRADIENT EFFECT
    for(let y=0; y<height; y++){
        n = map(y,0,height,0,1);
        let newc = lerpColor(c1,c2,n);
        stroke(newc);
        line(0,y,width, y);
    }

//BACKGROUND SNOW EFFECT
    for(let x = 0; x < drops.length; x++){
        drops[x] += random(1);
        if(drops[x] > height){
            drops[x] = 0;
        }
        point(x, drops[x]);
    }
 
//GROUND
    noStroke();
	fill(41,79,79);
	rect(0, floorPos_y, width, height - floorPos_y);

//PUSH & TRANSLATE
push(); 
//CHANGE THE ORIGIN TO (scrollPos,0)
translate(scrollPos,0); 
    
//DRAW MOUNTAINS
drawmountains();

//ANIMATE CLOUDS
animateClouds();
//DRAW CLOUDS
drawclouds();
    
//DRAW TREES
drawtrees_x();
    
//DRAW CANYONS
drawCanyons();

//DRAW COLLECTABLES
drawCollectables();
    
//POP BACK THE ORIGIN
pop();

//DRAW THE GAMECHAR - THIS MUST BE LAST 
if(isLeft && isFalling)
	{
        drawIsLeftAndIsFalling();
	}
	else if(isRight && isFalling)
	{
        drawIsRightAndISFalling();
	}
	else if(isLeft)
	{
        drawIsLeft();
	}
	else if(isRight)
	{
        drawIsRight();
	}
	else if(isFalling || isPlummeting)
	{
        drawIsFallingOrIsPlummeting();
	}
	else
	{
        drawStandingFront();
	}

//-------------------
//  INTERACTION CODE 
//-------------------
    
//CONDITIONAL STATEMENTS TO MOVE THE GAME CHAR
    if(isPlummeting)
    {
        gameChar_y +=10;
        return;
    }
    if(gameChar_y < floorPos_y)
    {
        gameChar_y += 1;
        isFalling = true;
    }
    else
        {
            isFalling = false;
        }
    if(isLeft == true)
//IF GAMECHAR IS WITHIN THE ORIGINAL FRAME
    {
        if(gameChar_x > width*0.2)
            {
                gameChar_x -= 5; 
            }
//TRANSLATE DRAWING TOWARDS RIGHT
        else
            {
                scrollPos += 5;
            }
    }
    else if(isRight == true)
//IF GAMECHAR IS WITHIN THE ORIGINAL FRAME
    {
        if(gameChar_x < width*0.8)
             {
                gameChar_x +=5;
            }
//TRANSLATE DRAWING TOWARDS LEFT
    else
        {
            scrollPos -=5;
        }
    }

//UPDATE THE REAL POSITION OF THE GAMECHAR FOR COLLISION DETECTION
    gameChar_world_x = gameChar_x - scrollPos;
    
//CHECK IF GAME CHAR IN RANGE OF COLLECTABLES
    checkIfGameCharInCollectablesRange();

//CHECK IF GAME CHAR IS OVER CANYONS
    checkIfGameCharIsOverCanyons();
    
}

//-----------------------------
//  BACKGROUND RENDER FUNCTION
//-----------------------------

//DRAW MOUNTAINS
function drawmountains(){
    for(var i = 0; i < mountains.length; i++){
    mountain_x1 = mountains[i].pos_x;
    mountain_y1 = mountains[i].pos_y;
    mountain_x2 = mountains[i].width+mountain_x1;
    mountain_y2 = mountain_y1;
    mountain_x3 = mountains[i].width/2+mountain_x1;
    mountain_y3 = mountain_y1 - mountains[i].height;
        
    noStroke();
    fill(211.211,255);
    triangle(mountain_x1, mountain_y1, mountain_x2, mountain_y2, mountain_x3, mountain_y3);
    }
}

//ANIMATE CLOUDS
function animateClouds(){
    clouds[0].pos_x = clouds[0].pos_x + 0.3; 
    clouds[1].pos_x = clouds[1].pos_x + 0.3;
    clouds[2].pos_x = clouds[2].pos_x + 0.3;
    clouds[3].pos_x = clouds[3].pos_x + 0.3;}

//DRAW CLOUDS
function drawclouds(){
    for(var i = 0; i < clouds.length; i++){
    fill(255);
    ellipse(clouds[i].pos_x,   clouds[i].pos_y,clouds[i].size+30,clouds[i].size+30);
    ellipse(clouds[i].pos_x-30,clouds[i].pos_y,clouds[i].size+20,clouds[i].size+20);
    ellipse(clouds[i].pos_x+30,clouds[i].pos_y,clouds[i].size+20,clouds[i].size+20);
    }
}

//DRAW TREES
function drawtrees_x(){
    for(var i = 0;i < trees_x.length;i++){
        
        noStroke();
        fill(139,69,19);
        rect(trees_x[i],floorPos_y-100,50,100);
        
        noStroke();
        fill(32,178,170);
        triangle(trees_x[i]-50, floorPos_y-100,
                 trees_x[i]+25, floorPos_y-180,
                 trees_x[i]+100,floorPos_y-100);

        triangle(trees_x[i]-50, floorPos_y-50,
                 trees_x[i]+25, floorPos_y-130,
                 trees_x[i]+100,floorPos_y-50);

        triangle(trees_x[i]-50, floorPos_y-150,
                 trees_x[i]+25, floorPos_y-230,
                 trees_x[i]+100,floorPos_y-150);
        }
}

// ---------------------------------
// CANYON RENDER AND CHECK FUNCTION
// ---------------------------------

//CHECK IF GAME CHAR IS OVER CANYONS
function checkIfGameCharIsOverCanyons(){
    for(var i=0; i<canyons.length;i++){
        var canyon = canyons[i];
        checkIfGameCharIsOverCanyon(canyon);
    }
}

function checkIfGameCharIsOverCanyon(canyon){
        //check if game char is on the floor
        console.log(gameChar_x);
        var cond1 = gameChar_y == floorPos_y
        //check if game char is from the left of canyon
        var cond2 = gameChar_world_x - gameChar_width/2>(canyon.x_pos)
        //check if game char is from the right of canyon
        var cond3 = gameChar_world_x + gameChar_width/2<(canyon.x_pos + canyon.width)
        //check if game char is over the canyon 
        if(cond1 && cond2 && cond3)
            {
                isPlummeting = true;
            }
    }

//DRAW CANYONS
function drawCanyons(){
    for(var i=0;i<canyons.length; i++){
        var canyon = canyons[i];
        drawCanyon(canyon);
    }
}
    
function drawCanyon(canyon){
    fill(175, 238, 238);
    rect(canyon.x_pos,floorPos_y,canyon.width,height-floorPos_y);
}

// ---------------------------------------
// COLLECTABLES RENDER AND CHECK FUNCTION
// ---------------------------------------

//CHECK IF GAME CHAR IN RANGE OF COLLECTABLES
function checkIfGameCharInCollectablesRange(){
    for(var i=0;i<collectables.length;i++){
        var collectable = collectables[i];
        checkIfGameCharInCollectableRange(collectable);
    }
}

function checkIfGameCharInCollectableRange(collectable){
    var d = dist(gameChar_world_x,gameChar_y,collectable.x_pos,collectable.y_pos)
    if(d<20)
    {
        collectable.isFound = true;
    }
}

//DRAW COLLECTABLES 
function drawCollectables(){
    for(var i=0; i<collectables.length;i++){
        var collectable = collectables[i];
        drawCollectable(collectable);
    }
}

function drawCollectable(collectable){
    if(collectable.isFound == false){
        noStroke();
        fill(184,134,11)
        
        triangle(collectable.x_pos-12,collectable.y_pos-20,
                 collectable.x_pos,collectable.y_pos,
                 collectable.x_pos+12, collectable.y_pos-20);
        
        noStroke();
        fill(255, 222, 173);
        ellipse(collectable.x_pos,collectable.y_pos - 28,collectable.size);
    }
}

// ---------------------
// Key control functions
// ---------------------

//KEY PRESSED & KEY RELEASED FUNCTIONS
function keyPressed()
{
// if statements to control the animation of the character when keys are pressed.
    if(keyCode == 37)
    {
        isLeft = true;
    }
    else if(keyCode == 39)
    {
        isRight = true;
    }
    else if(keyCode == 32)
    {
        if(gameChar_y >= floorPos_y)
        {
            gameChar_y -=50;
        }
    }
}

function keyReleased()
{
// if statements to control the animation of the character when keys are released.
    if(keyCode == 37)
    {
        isLeft = false;
    }
    else if(keyCode == 39)
    {
        isRight = false;
    }
}

// ------------------------------
// Game character render function
// ------------------------------

//DRAWING OF GAME CHARACTER
function drawIsLeftAndIsFalling()
{
//Body
  stroke(0);
  fill(0);
  ellipse(gameChar_x,gameChar_y - 20 ,32,28);
  fill(255)
  ellipse(gameChar_x - 6,gameChar_y - 20 ,18,24);
//Head
  ellipse(gameChar_x,gameChar_y - 39 ,25,22);
//Right ear
  stroke(255);
  fill(0);
  ellipse(gameChar_x -1 , gameChar_y - 53,10,10);
  ellipse(gameChar_x + 3, gameChar_y - 50,10,10);
//Right leg
  noStroke();
  fill(0);
  ellipse(gameChar_x + 1, gameChar_y - 6,12,12)
  fill(255);
  ellipse(gameChar_x-3, gameChar_y - 5,3,7)
//Right eye
  noStroke();
  fill(0);
  ellipse(gameChar_x - 7, gameChar_y - 40,5,5);
  fill(255);
  ellipse(gameChar_x - 6, gameChar_y - 41,2,2);
}
    
function drawIsRightAndISFalling()
{
//Body
  stroke(0);
  fill(0);
  ellipse(gameChar_x,gameChar_y - 20,32,28);
  fill(255)
  ellipse(gameChar_x + 6,gameChar_y - 20,18,24);
//Head
  ellipse(gameChar_x,gameChar_y - 39,25,22);
//Left ear
  stroke(255);
  fill(0);
  ellipse(gameChar_x + 3, gameChar_y - 53,10,10);
  ellipse(gameChar_x -1 , gameChar_y - 50,10,10);
//Left leg
  noStroke();
  fill(0);
  ellipse(gameChar_x + 1, gameChar_y - 6,12,12)
  fill(255);
  ellipse(gameChar_x+3, gameChar_y - 5,3,7)
//Right eye
  noStroke();
  fill(0);
  ellipse(gameChar_x + 7, gameChar_y - 40,5,5);
  fill(255);
  ellipse(gameChar_x + 6, gameChar_y - 41,2,2);
}

function drawIsLeft()
{
//Body
  stroke(0);
  fill(0);
  ellipse(gameChar_x,gameChar_y - 20,32,28);
  fill(255)
  ellipse(gameChar_x - 6,gameChar_y - 20,18,24);
//Head
  ellipse(gameChar_x,gameChar_y - 39,25,22);
//right ear
  stroke(255);
  fill(0);
  ellipse(gameChar_x -1 , gameChar_y - 53,10,10);
  ellipse(gameChar_x + 3, gameChar_y - 50,10,10);
//right leg
  noStroke();
  fill(0);
  ellipse(gameChar_x + 1, gameChar_y - 6,12,12)
  fill(255);
  ellipse(gameChar_x-3, gameChar_y - 5,3,7)
//right eye
  noStroke();
  fill(0);
  ellipse(gameChar_x - 7, gameChar_y - 40,5,5);
  fill(255);
  ellipse(gameChar_x - 6, gameChar_y - 41,2,2);
}
    
function drawIsRight()
{
//Body
  stroke(0);
  fill(0);
  ellipse(gameChar_x,gameChar_y - 20,32,28);
  fill(255)
  ellipse(gameChar_x + 6,gameChar_y - 20,18,24);
//Head
  ellipse(gameChar_x,gameChar_y - 39,25,22);
//Left ear
  stroke(255);
  fill(0);
  ellipse(gameChar_x + 3, gameChar_y - 53,10,10);
  ellipse(gameChar_x -1 , gameChar_y - 50,10,10);
//Left leg
  noStroke();
  fill(0);
  ellipse(gameChar_x + 1, gameChar_y - 6,12,12)
  fill(255);
  ellipse(gameChar_x+3, gameChar_y - 5,3,7)
//Left eye
  noStroke();
  fill(0);
  ellipse(gameChar_x + 7, gameChar_y - 40,5,5);
  fill(255);
  ellipse(gameChar_x + 6, gameChar_y - 41,2,2);
}

function drawIsFallingOrIsPlummeting()
{
  stroke(0);
  fill(0);
//Right ear
  ellipse(gameChar_x - 12, gameChar_y - 46,10,10);
//Left ear
  ellipse(gameChar_x + 12, gameChar_y - 46,10,10);  
//Body
  fill(0);
  ellipse(gameChar_x,gameChar_y - 20 ,32,28);
  fill(255)
  ellipse(gameChar_x,gameChar_y - 20 ,22,18);
  
//Head
  ellipse(gameChar_x,gameChar_y - 39 ,27,22);  
//Nose
  noStroke();
  fill(0);
  ellipse(gameChar_x,gameChar_y - 36,8,4);  
//Right eye
  noStroke();
  fill(0);
  ellipse(gameChar_x - 5, gameChar_y - 43, 5,5);
  fill(255);
  ellipse(gameChar_x - 4, gameChar_y - 44,2,2);
//Left eye
  noStroke();
  fill(0);
  ellipse(gameChar_x + 5, gameChar_y - 43, 5,5);
  fill(255);
  ellipse(gameChar_x + 4, gameChar_y - 44,2,2);
//Right leg
  noStroke();
  fill(0);
  ellipse(gameChar_x - 7, gameChar_y - 6,12,12)
  fill(255);
  ellipse(gameChar_x - 6, gameChar_y - 5,7,8)
//Left leg
  noStroke();
  fill(0);
  ellipse(gameChar_x + 7, gameChar_y - 6,12,12)
  fill(255);
  ellipse(gameChar_x + 6, gameChar_y - 5,7,8)
}

function drawStandingFront()
{
  stroke(0);
  fill(0);
//Right ear
  ellipse(gameChar_x - 12, gameChar_y - 46,10,10);
//Left ear
  ellipse(gameChar_x + 12, gameChar_y - 46,10,10);
//Body
  fill(0);
  ellipse(gameChar_x,gameChar_y - 20,32,28);
  fill(255)
  ellipse(gameChar_x,gameChar_y - 20,22,18);
//Head
  ellipse(gameChar_x,gameChar_y - 39,27,22);
//Nose
  noStroke();
  fill(0);
  ellipse(gameChar_x,gameChar_y - 36,8,4);
//Right eye
  noStroke();
  fill(0);
  ellipse(gameChar_x - 5, gameChar_y - 43,5,5);
  fill(255);
  ellipse(gameChar_x - 4, gameChar_y - 44,2,2);
//Left eye
  noStroke();
  fill(0);
  ellipse(gameChar_x + 5, gameChar_y - 43,5,5);
  fill(255);
  ellipse(gameChar_x + 4, gameChar_y - 44,2,2);
//Right leg
  noStroke();
  fill(0);
  ellipse(gameChar_x - 7, gameChar_y - 6,12,12)
  fill(255);
  ellipse(gameChar_x - 6, gameChar_y - 5,7,8)
//Left leg
  noStroke();
  fill(0);
  ellipse(gameChar_x + 7, gameChar_y - 6,12,12)
  fill(255);
  ellipse(gameChar_x + 6, gameChar_y - 5,7,8)
}
