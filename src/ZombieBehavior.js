import BaseBehavior from './BaseBehavior';

export default class ZombieBehavior extends BaseBehavior {
    constructor(target) {
        super();
        this.defaultFlipped = true;
        this.target = target;
    }

    update() {
        const targetPos = this.target.position;

        const xDiff = this.character.position.x - targetPos.x;

        if (xDiff < 400) {
            // this.character.walk();
        }
    }
}