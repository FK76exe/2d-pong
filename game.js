import Bar from "./bar.js";
import Puck from "./puck.js";
import Vector2D from "./vector.js";

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

// The bars are a class

/* The bar class represents the player and AI's bar.
It will hold bar data will be drawn into the canvas

NOTE: In a canvas, the origin is on top left!
positive x = movement towards the right
positive y = movement towards the bottom
*/
let playerBar = new Bar(665, 175);
let oppBar = new Bar(20, 175);
let puck = new Puck(350, 200, new Vector2D(1, 0));

// player coord is a param of drawCanvas, updating bar location on new drawing
function drawCanvas() {
    // create the arena
    context.fillStyle = "black";
    // fillRect is what makes rectangles... such as the arena and bars
    context.fillRect(0, 0, canvas.width, canvas.height);

    // player bar - right bar
    context.fillStyle = "white";
    context.fillRect(
        playerBar.x,
        playerBar.y,
        playerBar.width,
        playerBar.height
    );

    // AI bar - left bar
    context.fillStyle = "white";
    context.fillRect(
        oppBar.x,
        oppBar.y,
        oppBar.width,
        oppBar.height
    );

    // boundary between halves
    context.fillStyle = "grey";
    let y_position = 0;
    while (y_position < 740) {
        context.fillRect(347.5, y_position, 5, 20);
        y_position += 30;
    }


    // draw puck
    context.fillStyle = "white";
    context.beginPath();
    context.arc(puck.x, puck.y, 10, 0, 2 * Math.PI);
    context.stroke();
    context.fill();

    // move puck
    puck.move();

    // why did I have this?
    // while (true) {
    //     requestAnimationFrame()
    // }
}

// player controls
// up key = move up
// down key = move down
const speed = 10;
// keydown event is triggered when we press any key
// W and S will be up and down respectively
addEventListener("keydown", (keyboardEvent) => {
    // need to do some boundary checking first!
    if (keyboardEvent.code == "KeyW" && playerBar.y > 0) {
        playerBar.move(-speed);
    }
    // 400 (h of canvas) - 70 (h of bar) = 330
    else if (keyboardEvent.code == "KeyS" && playerBar.y < 330) {
        playerBar.move(speed);
    }
})

// game loop -> redraws canvas with updated player position
Game.run = function() {
    handlePuckCollisions();
    drawCanvas();
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

function handlePuckCollisions() {
    // if the puck collided with any of these objects,
    
    // what happens if it hits arena and bar? 
    handleArenaPuckCollisions();
    // handle bar collisions -> should change to paddle
    handlePlayerBarPuckCollisions();
    handleOppBarPuckCollisions();
}

// puck-to-arena collisions
// if the puck hits a horizontal wall of the arena: deflect y part of direction vector
function handleArenaPuckCollisions() {
    if (puck.y <= 0 || puck.y >= 400) { // just reverse y-coord
        puck.vector = new Vector2D(puck.vector.x, -puck.vector.y);
    }
}

const boundingBoxMargin = 5;
// puck-to-player bar collisions
// keep it as a function for now... we can refactor later
function handlePlayerBarPuckCollisions() {
    // REMEMBER: position of player is top-left corner
    // so [x, x+width] is the vertical plane the puck must cross
    // and [y, y+height] is the range it must be in
    // what if it goes beyond? that is a score
    if ( 
        puck.x >= playerBar.x + boundingBoxMargin 
        && puck.x <= playerBar.x + playerBar.width
        && puck.y >= playerBar.y - boundingBoxMargin
        && puck.y <= playerBar.y + playerBar.height + boundingBoxMargin
    ) {
        let newVector = updateCollisionVector(puck.y, playerBar);
        newVector.x = -(newVector.x);
        puck.vector = newVector;
    }
}

function handleOppBarPuckCollisions() {
    // remember: we have to look at collisions alongside right-side, so
    // add width
    if ( 
        // flipped the signs around to detect collisions from the right side
        puck.x <= oppBar.x + oppBar.width + boundingBoxMargin
        && puck.x >= oppBar.x
        && puck.y >= oppBar.y - boundingBoxMargin
        && puck.y <= oppBar.y + oppBar.height + boundingBoxMargin
    ) {
        let newVector = updateCollisionVector(puck.y, oppBar);
        puck.vector = newVector;
    }
}

function updateCollisionVector(yImpact, bar) {
    /** 
     * yImpact is the point on the bar's height the object made impact
     * with. Get the ratio of yImpact / (max - min) and then normalize
     * to get it within range (pi/4, -pi/4)
     * Finally, create a unit vector where x = cos-1(angle) and
     * y = sin-1(angle)
     */
    // 1. normalize point of impact with min-max normalization
    let ratio = (yImpact - bar.y) / bar.height;
    // in case of bounding box hit -> round down to 1 or up to 0
    ratio = Math.max(0, ratio);
    ratio = Math.min(1, ratio);
    // 2. convert to radians (negative sign flips it)
    let angleRadians = ((Math.PI/2 * ratio) - Math.PI/4);
    // 3. create vector, and deflect horizontally.
    return new Vector2D(Math.cos(angleRadians), Math.sin(angleRadians));
}