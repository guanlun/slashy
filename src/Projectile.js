import Item from './Item';

export default class Projectile extends Item {
    constructor(sceneManager, position, velocity, image, parent) {
        super(sceneManager, position, velocity, image);
        this.parent = parent;
    }

    checkCharacterCollision(characters) {
        if (this.defunct) {
            return;
        }

        for (const char of characters) {
            if (char === this.parent || char.dead) {
                continue;
            }

            const hitBox = char.getHitBox();

            const relativeProjectiveYPos = this.position.y + 50;

            if (this.position.x >= hitBox.left &&
                this.position.x <= hitBox.right &&
                relativeProjectiveYPos >= hitBox.bottom &&
                relativeProjectiveYPos <= hitBox.top) {
                char.takeDamage(100);
                this.defunct = true;
            }
        }
    }
}