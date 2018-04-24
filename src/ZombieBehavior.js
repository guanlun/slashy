import BaseBehavior from './BaseBehavior';
import { ACTIONS, ITEM_TYPES } from './Constants';

const MAX_DETECT_DISTANCE = 500;
const MAX_ATTACK_DISTANCE = 90;

const ATTACK_COOLDOWN = 2000;

export default class ZombieBehavior extends BaseBehavior {
    constructor(target) {
        super();
        this.defaultFlipped = true;
        this.target = target;

        this.lastAttackTime = 0;

        this.walkingSpeed = 3;
        this.hp = 1;
    }

    update() {
        if (this.character.dead || this.character.dying || this.target.dead) {
            return;
        }

        const targetPos = this.target.position;

        const xDiff = this.character.position.x - targetPos.x;
        const yDiff = this.character.position.y - targetPos.y;

        this.character.flipped = xDiff > 0;

        if (xDiff < MAX_DETECT_DISTANCE && xDiff > MAX_ATTACK_DISTANCE) {
            this.character.changeAction(ACTIONS.WALK);
        } else if (xDiff > -MAX_DETECT_DISTANCE && xDiff < -MAX_ATTACK_DISTANCE) {
            this.character.changeAction(ACTIONS.WALK);
        } else if (xDiff >= -MAX_ATTACK_DISTANCE && xDiff <= MAX_ATTACK_DISTANCE) {
            const currTime = Date.now();

            if (Math.abs(yDiff) < 10) {
                if (currTime - this.lastAttackTime > ATTACK_COOLDOWN) {
                    this.character.changeAction(ACTIONS.ATTACK);

                    this.lastAttackTime = currTime;
                } else {
                    this.character.changeAction(ACTIONS.IDLE);
                }
            } else {
                this.character.changeAction(ACTIONS.IDLE);
            }
        } else {
            this.character.changeAction(ACTIONS.IDLE);
        }
    }

    die() {
        const position = {
            x: this.character.position.x,
            y: this.character.position.y,
        }

        console.log(position)

        this.character.spawnItem({
            type: ITEM_TYPES.HEALTH_POTION,
            position,
            velocity: { x: 6, y: 12 },
        });
    }

    isCoolingDown(currTime) {

    }
}