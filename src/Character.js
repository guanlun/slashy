import Action from './Action';
import Collider from './Collider';
import { loadCharacterSprites } from './SpriteLoader';

export default class Character {
    constructor({
        name = '',
        actionTemplate = {},
        position = { x: 0, y: 0 },
        behavior,
        sceneManager,
    }) {
        this.name = name;
        this.createActions(actionTemplate);

        this.currAction = undefined;
        this.behavior = behavior;
        this.behavior.setCharacter(this);

        this.sceneManager = sceneManager;

        this.position = position || { x: 0, y: 0 };

        this.flipped = this.behavior.defaultFlipped;

        this.collider = new Collider(this);
        this.sceneManager.registerCollider(this.collider);
    }

    createActions(actionTemplate) {
        this.actions = {};

        for (const actionName of Object.keys(actionTemplate)) {
            this.actions[actionName] = new Action({ actionName, sprites: actionTemplate[actionName] });
        }
    }

    getCurrActionName() {
        if (this.currAction) {
            return this.currAction.actionName;
        } else {
            return null;
        }
    }

    walk() {
        this.currAction = this.actions['walking'];
    }

    idle() {
        // TODO: bug: looks like after attacking the animation would stop
        if (this.currAction && this.currAction.actionName === 'attacking') {
            this.nextAction = this.actions['idle'];
        } else {
            this.currAction = this.actions['idle'];
        }
    }

    attack() {
        this.currAction = this.actions['attacking'];
        this.currAction.actionCompleted = false;
    }

    hurt() {
        this.currAction = this.actions['hurt'];
        this.currAction.actionCompleted = false;
    }

    die() {
        this.currAction = this.actions['dying'];
        this.currAction.actionCompleted = false;
    }

    flip() {
        this.flipped = !this.flipped;
    }

    update() {
        this.behavior.update();

        if (!this.currAction) {
            this.idle();
        }

        // TODO: refactor this
        if (this.currAction.actionName === 'attacking') {
            if (this.currAction.isActionCompleted()) {
                this.idle();
            }

            if (this.currAction.getAnimationFrameIdx() === 10 && this.currAction.frameSkipCount === 0) {
                this.sceneManager.checkAttackCollision(this.collider);
            }
        } else if (this.currAction.actionName === 'hurt') {
            if (this.currAction.isActionCompleted()) {
                this.idle();
            }
        }

        if (this.currAction.actionName === 'walking') {
            this.position.x += this.flipped ? -5 : 5;
        }

        this.currAction.update();
    }

    render(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);

        if (this.flipped) {
            ctx.scale(-1, 1);
        }

        this.currAction.render(ctx, this.flipped);

        ctx.restore();
    }
}