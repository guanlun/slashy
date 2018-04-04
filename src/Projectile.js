import Item from './Item';

export default class Projectile extends Item {
    constructor(position, velocity, image, parent) {
        super(position, velocity, image);
        this.parent = parent;
    }

    checkCharacterCollision(characters) {
        if (this.defunct) {
            return;
        }

        for (const char of characters) {
            if (char === this.parent) {
                continue;
            }

            const yDiff = this.position.y - char.position.y;
            const xDiff = this.position.x - char.position.x;

            if (yDiff > 0 && yDiff < 100 && xDiff < 150 && xDiff > 0) {
                char.takeDamage(100);
                this.defunct = true;
            }
        }
    }
}