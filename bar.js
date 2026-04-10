class Bar {
    constructor(pos_x, pos_y) {
        this.x = pos_x;
        this.y = pos_y;
        this.width = 15;
        this.height = 70;
    }

    move(delta) {
        this.y += delta;
    }
}

// export for external JS files to use?
export default Bar;