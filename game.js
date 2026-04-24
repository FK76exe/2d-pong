import Bar from "./bar.js";
import Puck from "./puck.js";
import Vector2D from "./vector.js";
import GameState from "./game_state.js";

// TODO: Refactor

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

const pauseMsg = document.getElementById("pause-msg")
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
let gameState = new GameState();

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

    // display score
    // opponent score
    context.font = "bold 60px serif";
    context.fillText(gameState.score.opp, 300, 60);
    context.fillText(gameState.score.player, 370, 60);

    /** Draw puck if...
     * 1. puck is in arena
     * 2. the respawn delay is complete
     */
    if (gameState.puckStatus.inArena || Date.now() - gameState.puckStatus.arenaExitTime >= 2000) {
        context.fillStyle = "white";
        context.beginPath();
        context.arc(puck.x, puck.y, 10, 0, 2 * Math.PI);
        context.stroke();
        context.fill();

        // reset vars
        gameState.puckStatus.arenaExitTime = Date.now();
        gameState.puckStatus.inArena = true;

        // move puck
        puck.move();
    }
}

// player controls
// up key = move up
// down key = move down
const speed = 10;
// keydown event is triggered when we press any key
// W and S will be up and down respectively
let pressedKey = null; // handle one key at a time

/** Controls and Keypresses
 * W (move bar up)
 * keydown -> summon the action and start moving up
 * keyup -> action has stopped -> stop moving bar
 * 
 * S (move bar down)
 * keydown -> start moving bar down
 * keyup -> stop moving bar
 * 
 * P (pause/resume)
 * keydown -> reverse the pause/play state (if playing previously, pause, v.v)
 * keyup -> Don't do anything! Only another keydown can change state
 */

addEventListener("keydown", (keyboardEvent) => {
    // if key is P -> add/remove depending on if it is present or not
    if (keyboardEvent.code == "KeyP") {
        if (gameState.activeKeys.has("KeyP")) {
            gameState.activeKeys.delete("KeyP");
        }
        else {
            gameState.activeKeys.add("KeyP");
        }
    }
    // otherwise if it's W/S and not present, add
    else if (gameState.validKeys.has(keyboardEvent.code)) {
        // set silently ignores key if already present
        gameState.activeKeys.add(keyboardEvent.code)
    }
})

addEventListener("keyup", (keyboardEvent) => {
    // if key is P -> ignore
    if (keyboardEvent.code == "KeyP") {
        return;
    }
    // else -> remove (set ignores elems that don't exist)
    gameState.activeKeys.delete(keyboardEvent.code);
})


// BUG: there is a small pause after pressing key down, then it continues like normal
// This is due to OS/browser preventing accidental input
// to bypass: manage keyboard input in event loop where it checks at interval (smoother?)
// https://www.reddit.com/r/javascript/comments/1bzdzgo/comment/kypd69h/

// game loop -> redraws canvas with updated player position
// add update logic here.
Game.run = function() {
    // if the game is paused, don't change a thing
    if (!gameState.isGamePaused()) {
        // if someone scores 10 -> GG
        if (Math.max(gameState.score.player, gameState.score.opp) == 10) {
            // game is over, so show the winner
            context.fillStyle = "red";
            context.textAlign = "center";
            context.font = "bold 100px serif";
            context.fillText(gameState.score.player > gameState.score.opp ? "You Win" : "Try Again", 350, 200);
            return; // freezes the game
        }
        handlePuckCollisions();
        handleOpponentBehaviour();
        drawCanvas();
        pauseMsg.style.visibility = "hidden";
    }
    else {
        pauseMsg.style.visibility = "visible";
    }

    // input should be handled regardless if game is paused or not
    handleInput(); // otherwise game will be paused forever!
    requestAnimationFrame(Game.run);
}

function handleInput() {
    if (!gameState.isGamePaused()) {
        // without the above condition, player can move bar
        // while its paused -> no bueno!
        // need to do some boundary checking first!
        if (gameState.activeKeys.has("KeyW") && playerBar.y > 0) {
            playerBar.move(-speed);
        }
        // 400 (h of canvas) - 70 (h of bar) = 330
        else if (gameState.activeKeys.has("KeyS") && playerBar.y < 330) {
            playerBar.move(speed);
        }
    }
}

/** What's all this?
 * setInterval takes in a function and repeatedly execute over a 
 * provided interval.
 * 
 * Here, we are redrawing the canvas at 60fps, by dividing 1 second by 60
 * setInterval returns an ID that represents the interval timer
 * We're storing it as a property of the game module
 */
// let fps = 60;
// Game._intervalId = setInterval(Game.run, 1000 / fps);
// problem with above - not efficient! So we have to sync with screen's refresh rate

// solution -> requestAnimationFrame syncs game loop to refresh rate of screen
// may be way faster on different screens. but this is an amateur project so
// why care?
requestAnimationFrame(Game.run) 

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
    // if the puck is beyond the vertical bars, reset its location after a two-second wait
    if (puck.x < 0 || puck.x >= 700) {
        // manage score
        if (puck.x < 0) { gameState.score.player++; }
        else {gameState.score.opp++;}

        gameState.puckStatus.inArena = false;
        gameState.puckStatus.arenaExitTime = Date.now();
        // relocate
        puck.x = 350;
        puck.y = 200;
        // generate new direction vector
        puck.vector = generateRandom2DVector();

    }
}

const boundingBoxMargin = 10;
// puck-to-player bar collisions
// keep it as a function for now... we can refactor later
function handlePlayerBarPuckCollisions() {
    // REMEMBER: position of player is top-left corner
    // so [x, x+width] is the vertical plane the puck must cross
    // and [y, y+height] is the range it must be in
    // what if it goes beyond? that is a score

    // to prevent puck cutting through player bar... up the margin
    if ( 
        puck.x >= playerBar.x - boundingBoxMargin // inward-facing side w/ margin
        && puck.x <= playerBar.x + playerBar.width // outward-side/interior
        && puck.y >= playerBar.y - boundingBoxMargin // top end w/ margin
        && puck.y <= playerBar.y + playerBar.height + boundingBoxMargin // bottom w/ margin
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

/** AI
 * iirc from cps643...
 * Sense: what do I (AI POV) need to look for
 * - puck location (where to go)
 * Think: what should I do based on where puck is going?
 * - I need to stay close to puck's location on y-axis -> why? to react better to collisions
 * Act:
 * - move myself to puck's location at my speed
 * 
 * so to program...
 * 1. get puck's vertical location RELATIVE to my location (is it above or below? Or the same?)
 * 2. move myself until I'm at puck's vertical location
 * -> this needs to be run in game loop with every frame
 * DO NOT LOCK TO PUCK'S LOCATION PROGRAMMATICALLY. NEEDS TO BEHAVE LIKE A HUMAN
 * 
 * issue: the opponent bar is too good -> catches puck all the time... how to fix?
 * - give it a speed < puck (otherwise it will always catch it)
 * - have it only react if the puck is x pixels away (mimic "reading" play)
 */
const opponentSpeed = 5;
function handleOpponentBehaviour() {
    if (puck.x < canvas.width * 0.75) {
        if (puck.y > oppBar.y + oppBar.height && oppBar.y < 330) { // puck is below oppBar's bottom
            oppBar.move(opponentSpeed)
        }
        else if (oppBar.y > puck.y && oppBar.y > 0) { // puck is above oppBar' top
            oppBar.move(-opponentSpeed);
        }
        // if it's equal, no need to change anything
    }

}

function generateRandom2DVector() {
    // halved angles in radians s.t. player can realistically react to them
    let angle = (Math.random()*Math.PI/4) - Math.PI/8;
    return new Vector2D(Math.cos(angle), Math.sin(angle));
}