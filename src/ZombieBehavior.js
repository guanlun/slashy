import BaseBehavior from './BaseBehavior';
import { ACTIONS } from './Constants';

const MAX_DETECT_DISTANCE = 200;
const MAX_ATTACK_DISTANCE = 90;

const ATTACK_COOLDOWN = 2000;

export default class ZombieBehavior extends BaseBehavior {
    constructor(target) {
        super();
        this.defaultFlipped = true;
        this.target = target;

        this.lastAttackTime = 0;
    }

    update() {
        const targetPos = this.target.position;

        const xDiff = this.character.position.x - targetPos.x;

        this.character.flipped = xDiff > 0;

        if (xDiff < MAX_DETECT_DISTANCE && xDiff > MAX_ATTACK_DISTANCE) {
            this.character.changeAction(ACTIONS.WALK);
        } else if (xDiff > -MAX_DETECT_DISTANCE && xDiff < -MAX_ATTACK_DISTANCE) {
            this.character.changeAction(ACTIONS.WALK);
        } else if (xDiff >= -MAX_ATTACK_DISTANCE && xDiff <= MAX_ATTACK_DISTANCE) {
            const currTime = Date.now();

            if (currTime - this.lastAttackTime > ATTACK_COOLDOWN) {
                this.character.changeAction(ACTIONS.ATTACK);

                this.lastAttackTime = currTime;
            }
        }
    }

    isCoolingDown(currTime) {

    }
}