import Item from './Item';

export default class Projectile extends Item {
    constructor(sceneManager, position, velocity, image) {
        super(sceneManager, position, velocity, image);
        this.hasGravity = true;
    }

    customScale(ctx) {
        ctx.scale(3, 3);
    }

    checkCharacterCollision(characters) {
        if (this.defunct) {
            return;
        }

        for (const char of characters) {
            const yDiff = this.position.y - char.position.y;
            const xDiff = this.position.x - char.position.x;

            if (yDiff > -10 && yDiff < 10 && xDiff < 30 && xDiff > -30) {
                char.heal(100);
                this.defunct = true;
            }
        }
    }
}