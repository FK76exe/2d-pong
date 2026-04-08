class Bar {
    constructor(pos_x, pos_y) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;

    }

    get fields() {
        return {
            'x': this.pos_x,
            'y': this.pos_y,
            // these fields aren't gonna change... for now :)            
            'colour': "white",
            'height': 70,
            'width': 15
        }
    }

    move(delta) {
        this.pos_y += delta;
    }
}

// export for external JS files to use?
export default Bar;