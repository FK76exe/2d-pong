# Pong

This is a JavaScript implementation of Pong, one of the first video games ever made.
While it's been made many times before, I programmed this because of the game's simplicity, meaning I can focus on the fundamentals of game development.

## Feature Requirements
Just a place for me to map out what needs to be done :)

### First Stage - Seeing and Moving
The goal of this stage is to set up the main parts of Pong:

✅ **R1:** Render the "arena", player bar, and opponent bar onto the screen 

✅ **R2:** Enable the player to move the bar on the vertical axis with the "W" and "S" arrow keys

### Second Stage - The Puck, Collision Detection, and AI

✅ **R3:** Genereate a puck that is emitted from the centre of the arena

✅ **R3.1:** Enable collision detection with bars and the arena wall, changing its direction angle (remember vectors from math? May wanna look into that...)

**R4:** Get the opponent bar to "react" to the puck's movements.

### Third Stage - Cosmetics and Touch-Ups

**R5:** Display scoring and end the game when one player reaches ten points.

**R6:** Create a "pause" feature to freeze game movements.
Be sure to display that game is paused and tell player how to resume.

**R7:** Provide a collapsible dialog on how to play the game.

**R8:** Map controls for mouse and give player option to pick mouse or keyboard when starting up game

**R9:** Create a starter screen that displays control options and how to play the game.

# How to Run Locally
Run a live server with `python -m http.server` in a command shell in the root directory.

Why a server? Well, if my understanding of this [site](https://security.stackexchange.com/questions/201208/why-do-browsers-disallow-accessing-files-from-local-file-system-even-if-the-html) is correct, security issues in the past have taught browser developers that it should only fetch JS files rather than doubling as a server.