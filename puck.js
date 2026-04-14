class Puck {
    constructor(x, y, vector) {
        this.x = x;
        this.y = y;
        this.vector = vector;
        this.speed = 12;
    }

    move() {
        this.x += this.vector.x * this.speed;
        this.y += this.vector.y * this.speed;
    }
}

export default Puck;