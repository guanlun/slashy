export default class Item {
    constructor(sceneManager, position, velocity = { x: 0, y: 0 }, image) {
        this.sceneManager = sceneManager;
        this.position = position;
        this.velocity = velocity;
        this.image = image;

        this.defunct = false;
        this.isStill = false;
    }

    update(characters) {
        if (this.defunct) {
            return;
        }

        if (!this.isStill) {
            if (this.hasGravity) {
                this.velocity.y += 0.8;
            }

            const restingGround = this.sceneManager.getGroundForPosition(this.position);

            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            if (this.hasGravity && this.position.y > restingGround.position.y) {
                this.position.y = restingGround.position.y;
                this.isStill = true;
            }
        }

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

        this.customScale(ctx);

        ctx.drawImage(this.image, 0, 0, this.velocity.x < 0 ? -50 : 50, 30);

        ctx.restore();
    }

    customScale(ctx) {
    }
}