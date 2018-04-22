export default class RoadSign {
    constructor(position, text, image) {
        this.position = position;
        this.text = text;
        this.image = image;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y + 262);
        ctx.drawImage(this.image, 0, 0, 160, 160);

        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(this.text, 40, 60);
        ctx.restore();
    }
}