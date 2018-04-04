export default class Item {
    constructor(position, velocity = { x: 0, y: 0 }) {
        this.position = position;
        this.velocity = velocity;

        this.defunct = false;
    }

    update(characters) {
        if (this.defunct) {
            return;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.checkCharacterCollision(characters);
    }

    checkCharacterCollision(characters) {
        return false;
    }

    render(ctx) {
        if (this.defunct) {
            return;
        }

        ctx.save();

        ctx.translate(this.position.x, this.position.y);

        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 30, 30);

        ctx.restore();
    }
}