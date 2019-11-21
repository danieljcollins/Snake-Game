// canvas related variables
var canvas = document.getElementById("play-area");
var ctx = canvas.getContext("2d");
var cw = canvas.width;
var ch = canvas.height;

// the size of the snake and the food (width and height in pixels)
var snakeSize = 50;
var snakeSpeed = 50;	// pixels travelled per drawFrame() call
var snakeFoodSize = 50;

// with every collision between the snake's head and food, the score will increase by 1
var score = 0;

// set up the play-area to listen for key press events which will control the snake
window.addEventListener('keydown', this.onKeyPress, false);

// direction is the current direction of the snake's head. the body will move to the location of the previous
// part of the snake's body, leading back to the head
var direction = "left";

// this variable will trigger false if the player hits the space bar, which will then stop the triggering of the 
// next drawFrame
var resumeGame = true;

function onKeyPress(event){
	var key = event.which || event.keycode;
		
	// if I want to use arrow keys later
	/* 37 = left
	 * 38 = up
	 * 39 = right
	 * 40 = down
	 */
	
	/* To solve an issue with the browser window moving up and down when using the arrow keys,
	 * I have switched it to the w,a,s,d keys to signify up, left, down and right, similar to 
	 * first-person shooter games
	 */	
	if(key == 65){	// left
		direction = "left";
	}
	else if(key == 87){	// up
		direction = "up";
	}
	else if(key == 68){	// right
		direction = "right";
	}
	else if(key == 83){	// down
		direction = "down";
	}
	else if(key == 32){	// space bar, press space to pause, press space again to resume the game
		if(resumeGame == false){
			resumeGame = true;
			drawFrame();	// call the drawFrame() function to continue the game
		}
		else{
			resumeGame = false;
		}
	}
}

// the snake itself is comprised of snake objects, which will be stored in an array
// when the snake eats food, a new object will be created, which will track that piece of the snake's
// growing body
var snake = {
	x: 300,	// starting x coordinate
	y: 300,	// starting y coordinate
	prevX: 300,	// store the previous x coordinate as the snake moves, so the rest of the snake's body can follow
	prevY: 300	// previous y coordinate
};

// snakeBody is an array which holds snake objects
var snakeBody = [];
snakeBody.push(snake);

// the snake food is always located on one location of the play area
// the player must guide the snake to the food, to eat the food and enlarge the snake.
// after which, a new random piece of food will be spawned and the process is repeated
var snakeFood = {
	x: 10,	// x coordinate location of food
	y: 10	// y coordinate location
};

placeFood();

// move the snake's head one space based on what arrow key was last pressed
function moveSnake(){
	
	// update the movement history of the snake so the snakeBody can follow
	snakeBody[0].prevX = snakeBody[0].x;
	snakeBody[0].prevY = snakeBody[0].y;
	
	if(direction == "left"){	// left arrow key was pressed		
		snakeBody[0].x -= snakeSpeed;		
	}
	else if(direction == "up"){	// up key		
		snakeBody[0].y -= snakeSpeed;
	}
	else if(direction == "right"){	// right key		
		snakeBody[0].x += snakeSpeed;
	}		
	else if(direction == "down"){	// down		
		snakeBody[0].y += snakeSpeed;		
	}	
	
	if(snakeBody.length > 1){
		moveSnakeBody();		
	}
	console.log("snakeBody[0] X: " + snakeBody[0].x);
	console.log("snakeBody[0] Y: " + snakeBody[0].y);
}

// cascade the location change across all parts of the snake's body
// starting from the second element, which will base it's new location off of the previous location of the
// snake	
function moveSnakeBody(){
	
	var i;
	var j;
		
	for(i = 1; i < snakeBody.length; i++){
		j = i-1;
		
		snakeBody[i].prevX = snakeBody[i].x;
		snakeBody[i].prevY = snakeBody[i].y;
		
		snakeBody[i].x = snakeBody[j].prevX;
		snakeBody[i].y = snakeBody[j].prevY;
		
		// for diag reasons:
		if(i == 1){
			console.log("snakeBody[1] x = " + snakeBody[i].x);
			console.log("snakeBody[1] y = " + snakeBody[i].y);
		}		
	}
	
	// check for collisions between the snake and it's own body (game over)
	checkSnakeCollision();
}

// this will compare the coordinates of the snake's head with that of the food, if it collides,
// then eat the food, create a new piece of food, and increase the size of the snake's body by one.
// if the snake's body collides with itself, that triggers a "game over" state.
function checkFoodCollision(){
	var differenceX;
	var differenceY;
	
	// X
	if(snakeBody[0].x < snakeFood.x){
		differenceX = snakeFood.x - snakeBody[0].x;		
	}
	else{
		differenceX = snakeBody[0].x - snakeFood.x;
	}
	
	// Y
	if(snakeBody[0].y < snakeFood.y){
		differenceY = snakeFood.y - snakeBody[0].y;		
	}
	else{
		differenceY = snakeBody[0].y - snakeFood.y;
	}
	
	// 50 is the size (in pixels) of the snake and the food, so a difference less than 50 indicates a collision
	if(differenceX <= snakeFoodSize && differenceY <= snakeFoodSize){
		// the current piece of food has been eaten, create a new one
		placeFood();
		
		// make the snake's body bigger
		enlargeSnake();
	}
}

// loop through the snakeBody array of snake objects. check to see if the snake's head collides with the snake's body
// which results in a game over.
function checkSnakeCollision(){
	for(var i = 1; i < snakeBody.length; i++){
		var differenceX;
		var differenceY;
		
		// X
		if(snakeBody[0].x < snakeBody[i].x){
			differenceX = snakeBody[i].x - snakeBody[0].x;		
		}
		else{
			differenceX = snakeBody[0].x - snakeBody[i].x;
		}
		
		// Y
		if(snakeBody[0].y < snakeBody[i].y){
			differenceY = snakeBody[i].y - snakeBody[0].y;		
		}
		else{
			differenceY = snakeBody[0].y - snakeBody[i].y;
		}
		
		// 50 is the size (in pixels) of the snake so a difference less than 50 indicates a collision,
		// deprecated comment below for posterity
		// but speed is 10 pixels and currently the snake parts are staggered by 10 pixels each
		// (following the exact path of the preceeding snake body part)
		if(differenceX < snakeSpeed && differenceY < snakeSpeed){
			alert("A snake collision has occurred");
			resumeGame = false;
		}		
	} // ends for loop	
}

// check if the snake collides with the canvas' walls
function checkWallCollision(){
	// check to see if the snake hit a wall
	if(snakeBody[0].x < 0 || snakeBody[0].x > cw){	// we've come into contact with the left or right walls
		alert("A snake collision has occurred on the left or right wall");
		resumeGame = false;
	}
	
	if(snakeBody[0].y < 0 || snakeBody[0].y > ch){	// we've come into contact with the top or bottom walls
		alert("A snake collision has occurred on the top or bottom wall");
		resumeGame = false;
	}	
}

// upon collision between the snake's head and some food, the snake's body will grow
// so we create a new object which will store the information for that new portion of the snake's
// body
function enlargeSnake(){
	if(snakeBody.length < 100){	// temporary restriction for development reasons
		//var newBodyPart = Object.assign({}, snakeBody[snakeBody.length-1]);
		var newBodyPart = Object.assign({}, snake);
		snakeBody.push(newBodyPart);
	}
	
	score += 100;
	var scoreCounter = document.getElementById("score-keeper").innerHTML = "Score = " + score;
}

// generate a random coordinate that fits inside the canvas window
// used to place snake food at a random location
function randomCoordinate(canvasSize){
	var validCoordinate = false;
		
	// check to see if the coordinate will place the food too close to the edge of the canvas
	// where it might be difficult for the player to see the food
	do{
		var coordinate = Math.random() * canvasSize;
		
		// if this value is less than the size of the food, the food will be partially off-screen
		// so we will re-randomize a new value until we get a value that places the food completely 
		// in view
		if((canvasSize - coordinate) >= snakeFoodSize){
			// now I need to check to see if the coordinate conflicts with where the snake's body is
			// since I don't want to food to appear under the snake's body
			// HOWEVER, 2019-era javascript on this 2008-era laptop is too slow for this algorithm, 
			// so we will not do this - there isn't multi-threading in javascript
			/*
			if(snakeBody.length >= 1){
				for(var i = 0; i < snakeBody.length; i++){
					if((snakeBody[i].x - coordinate) <= snakeSize && (coordinate - snakeBody[i].x) <= snakeSize){
						if((snakeBody[i].y - coordinate) <= snakeSize && (coordinate - snakeBody[i].y) <= snakeSize){
							validCoordinate = true;
							return Math.round(coordinate);
						}		
					}
				}
			}
			*/
			validCoordinate = true;
			return Math.round(coordinate);
		}
	}
	while(validCoordinate == false);
}

// place a piece of snake food for the player to attempt to capture to enlarge the snake and gain points
function placeFood(){	
	Object.defineProperties(snakeFood, {
		x: {value: randomCoordinate(cw)},
		y: {value: randomCoordinate(ch)}
	});		
}

// render a frame of the snake's body, the snake food, and update the location of the snake's body
// as they move
function drawFrame(){
	document.getElementById("play-area").focus();
	// draw over the previous frame
	ctx.clearRect(0, 0, cw, ch);	
	
	// draw the food
	ctx.fillStyle = '#ff0000';	// red
	ctx.fillRect(snakeFood.x, snakeFood.y, snakeFoodSize, snakeFoodSize);
		
	// draw the snake, by going through the snakeBody array of snake objects which keeps track of where
	// each part of the snake's body has been
	var i = 0;
	do{		
		if(i == 0){	// the head of the snake will be a different colour than the rest of the body
			ctx.fillStyle = '#0000ff';	// blue
			ctx.fillRect(snakeBody[i].x, snakeBody[i].y, snakeSize, snakeSize);		
		}
		else if(i == 1){
			ctx.fillStyle = '#00ffff';	// light blue
			ctx.fillRect(snakeBody[i].x, snakeBody[i].y, snakeSize, snakeSize);
		}
		else{
			ctx.fillStyle = '#00ff00';	// green
			ctx.fillRect(snakeBody[i].x, snakeBody[i].y, snakeSize, snakeSize);
		}
		i++;
	}
	while(i < snakeBody.length);
	
	// update the snake object's coordinates based on the last arrow key that was pressed
	moveSnake();
	
	// check for collisions between the snake and a piece of food
	checkFoodCollision();
	
	// check for collisions between the snake and the walls
	checkWallCollision();
		
	// draw another frame
	if(resumeGame == true){
		var timeout = setTimeout(function(){
			window.requestAnimationFrame(drawFrame)
		}, 100);		
	}	
}

// start the game
//drawFrame(0);	// this will currently fire based on when the player hits the start game button in the html page


