import BaseBehavior from './BaseBehavior';
import { ACTIONS } from './Constants';
import Projectile from './Projectile';

const MAX_DETECT_DISTANCE = 1000;
const MAX_ATTACK_DISTANCE = 1000;

const ATTACK_COOLDOWN = 2000;

export default class FrogBehavior extends BaseBehavior {
    constructor(target) {
        super();
        this.defaultFlipped = true;
        this.target = target;

        this.lastAttackTime = 0;

        this.walkingSpeed = 5;
        this.hp = 1000;
        this.animationFrameLength = 4;
        this.attackFrameInSequence = 1;
    }

    update() {
        if (this.character.dead) {
            return;
        }

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
            } else {
                this.character.changeAction(ACTIONS.IDLE);
            }
        }
    }

    performAttack(sceneManager) {
        const position = {
            x: this.character.position.x,
            y: this.character.position.y,
        }
        this.character.spawnItem(new Projectile(position, { x: -6, y: 0 }, this.character));
    }

    isCoolingDown(currTime) {

    }
}