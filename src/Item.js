export default class Item {
    constructor(position, velocity = { x: 0, y: 0 }, image) {
        this.position = position;
        this.velocity = velocity;
        this.image = image;

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
        if (this.velocity.x < 0) {
            ctx.scale(-1, 1);
        }

        ctx.drawImage(this.image, 0, 0, this.velocity.x < 0 ? -50 : 50, 30);

        ctx.restore();
    }
}