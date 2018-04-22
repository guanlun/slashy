const LEVEL_HEIGHT = 180;
const LENGTH_UNIT = 20;
const HEIGHT_UNIT = 40;

export default class Ground {
    constructor(pos, length, img) {
        this.position = {
            x: pos.x * LENGTH_UNIT,
            y: pos.y * LEVEL_HEIGHT,
        };
        this.length = length * LENGTH_UNIT;
        this.img = img;

        this.pattern = null;
    }

    render(ctx) {
        if (!this.pattern) {
            this.pattern = ctx.createPattern(this.img, 'repeat-x');
        }

        ctx.save();

        // ctx.fillStyle = 'white';
        ctx.fillStyle = this.pattern;

        ctx.translate(this.position.x, -this.position.y);

        ctx.beginPath();
        const x = 0;
        const y = 0;
        const radius = 20;
        const width = this.length;
        const height = HEIGHT_UNIT;

        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();

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