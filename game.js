// alright, time for the fun stuff
const canvas = document.getElementById("canvas")
/**
 * .getContext("2d") creates a CanvasRenderingContext2D object... huh?
 * The context is where the drawing takes place -> we create the bar
 * and puck and everything else within the context!
 */
const context = canvas.getContext("2d")

function drawCanvas() {
    // NOTE: In a canvas, the origin is on top left!
    // positive x = movement towards the right
    // positive y = movement towards the bottom
    // create the arena
    context.fillStyle = "black";
    // fillRect is what makes rectangles... such as the arena and bars
    context.fillRect(0, 0, canvas.width, canvas.height);

    // player bar
    context.fillStyle = "white";
    context.fillRect(20, 175, 15, 70);

    // AI bar
    context.fillRect(665, 175, 15, 70);

    // boundary between halves
    context.fillStyle = "grey";
    let y_position = 0;
    while (y_position < 740) {
        context.fillRect(347.5, y_position, 5, 20);
        y_position += 30;
    }
}

drawCanvas();