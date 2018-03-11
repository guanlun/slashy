import Action from './Action';
import { loadCharacterSprites } from './SpriteLoader';

export default class Character {
    constructor({
        name = '',
        actionTemplate = {},
        position = { x: 0, y: 0 },
        behavior,
    }) {
        this.name = name;
        this.createActions(actionTemplate);

        this.currAction = undefined;
        this.behavior = behavior;
        this.behavior.setCharacter(this);

        this.position = position || { x: 0, y: 0 };

        this.flipped = this.behavior.defaultFlipped;
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

    flip() {
        this.flipped = !this.flipped;
    }

    update() {
        this.behavior.update();

        if (!this.currAction) {
            this.idle();
        }

        if (this.currAction.actionName === 'attacking' && this.currAction.isActionCompleted()) {
            this.idle();
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