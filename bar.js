import Vector2D from "./vector.js";

class Bar {
    constructor(pos_x, pos_y) {
        this.x = pos_x;
        this.y = pos_y;
        this.width = 15;
        this.height = 70;
    }

    get fields() {
        return {
            'x': this.x,
            'y': this.y,
            // these fields aren't gonna change... for now :)            
            'colour': "white",
            'height': this.height,
            'width': this.width
        }
    }

    move(delta) {
        this.y += delta;
    }

    isColliding(object) {
        // have to hit bounding box
        const boundingBoxMargin = 10;
        // obj within right-side
        return object.x <= this.x + (this.width / 2) + boundingBoxMargin
                // within left side
                && object.x >= this.x - (this.width / 2) - boundingBoxMargin
                // within top side (Y is flipped!)
                && object.y >= this.y - (this.height /2)  - boundingBoxMargin
                // within bottom side
                && object.y <= this.y + (this.height /2)+ boundingBoxMargin;
    }

    getCollisionVector(yImpact) {
        /** 
         * yImpact is the point on the bar's height the object made impact
         * with. Get the ratio of yImpact / (max - min) and then normalize
         * to get it within range (pi/4, -pi/4)
         * Finally, create a unit vector where x = cos-1(angle) and
         * y = sin-1(angle)
         */
        // first... use min-max normalization to get ratio
        let ratio = Math.min(1, (yImpact - this.y) / (this.height));
        if (ratio < 0) { ratio = 0; }
        // convert into radians with an offset
        let angleRadians = (Math.PI/2 * ratio) - Math.PI/4;
        // now... create vector (deflect horizontal)
        return new Vector2D(
            -Math.cosh(angleRadians),
            Math.sinh(angleRadians)
        );
    }
}

// export for external JS files to use?
export default Bar;