// alright, time for the fun stuff
// game is a module that will manage the game's main operations, like drawing the canvas
let Game = {};
const canvas = document.getElementById("canvas")
/**
 * .getContext("2d") creates a CanvasRenderingContext2D object... huh?
 * The context is where the drawing takes place -> we create the bar
 * and puck and everything else within the context!
 */
const context = canvas.getContext("2d")
// player's vertical position is stored as a variable and will be manipulated
let playerY = 175;

// player coord is a param of drawCanvas, updating bar location on new drawing
function drawCanvas(y) {
    // NOTE: In a canvas, the origin is on top left!
    // positive x = movement towards the right
    // positive y = movement towards the bottom
    // create the arena
    context.fillStyle = "black";
    // fillRect is what makes rectangles... such as the arena and bars
    context.fillRect(0, 0, canvas.width, canvas.height);

    // player bar - right bar
    context.fillStyle = "white";
    context.fillRect(665, y, 15, 70);

    // AI bar - left bar
    context.fillRect(20, 175, 15, 70);

    // boundary between halves
    context.fillStyle = "grey";
    let y_position = 0;
    while (y_position < 740) {
        context.fillRect(347.5, y_position, 5, 20);
        y_position += 30;
    }
    while (true) {
        requestAnimationFrame()
    }
}

// player controls
// up key = move up
// down key = move down
const speed = 10;
// keydown event is triggered when we press any key
// W and S will be up and down respectively
addEventListener("keydown", (keyboardEvent) => {
    // need to do some boundary checking first!
    if (keyboardEvent.code === "KeyW" && playerY > 0) {
        playerY -= speed;
    }
    // 400 (h of canvas) - 70 (h of bar) = 330
    else if (keyboardEvent.code == "KeyS" && playerY < 330) {
        playerY += speed;
    }
})

// game loop -> redraws canvas with updated player position
Game.run = function() {
    drawCanvas(playerY);
}
/** What's all this?
 * setInterval takes in a function and repeatedly execute over a 
 * provided interval.
 * 
 * Here, we are redrawing the canvas at 60fps, by dividing 1 second by 60
 * setInterval returns an ID that represents the interval timer
 * We're storing it as a property of the game module
 */
let fps = 60;
Game._intervalId = setInterval(Game.run, 1000 / fps);
// http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html