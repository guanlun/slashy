import Action from './Action';
import Collider from './Collider';
import { loadCharacterSprites } from './SpriteLoader';
import { ACTIONS, ATOMIC_ACTIONS, TERMINAL_ACTIONS } from './Constants';

function isAtomic(action) {
    return ATOMIC_ACTIONS.indexOf(action) !== -1;
}

function isTerminal(action) {
    return TERMINAL_ACTIONS.indexOf(action) !== -1;
}

const REFRESH_PER_FRAME = 3;

export default class Character {
    constructor({
        name = '',
        actionTemplate = {},
        position = { x: 0, y: 0 },
        behavior,
        sceneManager,
    }) {
        this.name = name;

        this.actionSeqs = actionTemplate;
        this.actionFrameIdx = 0;
        this.frameSkipCount = 0;
        this.actionCompleted = false;

        this.currAction = ACTIONS.IDLE;
        this.behavior = behavior;
        this.behavior.setCharacter(this);

        this.sceneManager = sceneManager;

        this.position = position || { x: 0, y: 0 };

        this.flipped = this.behavior.defaultFlipped;

        this.collider = new Collider(this);
        this.sceneManager.registerCollider(this.collider);
    }

    getCurrAction() {
        return this.currAction;
    }

    changeAction(action) {
        if (action === this.currAction) {
            return;
        }

        if (isAtomic(this.currAction)) {
            this.nextAction = action;
        } else {
            this.setAction(action);
        }
    }

    setAction(action) {
        this.currAction = action;
        this.actionFrameIdx = 0;
        this.actionCompleted = false;
    }

    update() {
        this.behavior.update();

        const currActionSequence = this.actionSeqs[this.currAction];

        const currActionAtomic = isAtomic(this.currAction);

        if (currActionAtomic && this.actionCompleted) {
            this.setAction(this.nextAction || ACTIONS.IDLE);
        }

        switch (this.currAction) {
            case ACTIONS.WALK:
                this.position.x += this.flipped ? -5 : 5;
                break;
            case ACTIONS.ATTACK:
                if (this.actionFrameIdx === 10 && this.frameSkipCount === 0) {
                    this.sceneManager.checkAttackCollision(this.collider);
                }
                break;
        }

        if (this.actionFrameIdx === currActionSequence.length) {
            if (currActionAtomic) {
                this.actionCompleted = true;
            }

            this.actionFrameIdx = 0;
        }
    }

    render(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);

        if (this.flipped) {
            ctx.scale(-1, 1);
        }

        const currActionSequence = this.actionSeqs[this.currAction];

        ctx.drawImage(
            currActionSequence[this.actionFrameIdx],
            0,
            0,
            this.flipped ? -200 : 200, 200
        );

        ctx.restore();

        this.frameSkipCount++;
        if (this.frameSkipCount === REFRESH_PER_FRAME) {
            this.frameSkipCount = 0;
            this.actionFrameIdx++;
        }
    }
}