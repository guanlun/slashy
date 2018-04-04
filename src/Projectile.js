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

            const yDiff = Math.abs(char.position.y - this.position.y);


            const xDiff = this.position.x - char.position.x;

            if (yDiff < 30 && xDiff < 150 && xDiff > 0) {
                char.takeDamage(100);
                this.defunct = true;
            }
        }
    }
}