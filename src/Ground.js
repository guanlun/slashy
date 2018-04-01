const LEVEL_HEIGHT = 180;
const LENGTH_UNIT = 20;
const HEIGHT_UNIT = 20;

export default class Ground {
    constructor(pos, length) {
        this.position = {
            x: pos.x * LENGTH_UNIT,
            y: pos.y * LEVEL_HEIGHT,
        };
        this.length = length * LENGTH_UNIT;
    }

    render(ctx) {
        ctx.save();

        ctx.fillStyle = 'white';

        ctx.translate(this.position.x, -this.position.y);
        ctx.fillRect(0, 0, this.length, HEIGHT_UNIT);

        ctx.restore();
    }

    getRange() {
        return {
            from: this.position.x,
            to: this.position.x + this.length,
        };
    }
}