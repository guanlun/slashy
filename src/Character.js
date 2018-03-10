import Action from './Action';
import { loadCharacterSprites } from './SpriteLoader';

export default class Character {
    constructor({ name = '', actionTemplate = {}, position = { x: 0, y: 0 } }) {
        this.name = name;
        this.createActions(actionTemplate);

        this.currAction = undefined;

        this.position = position || { x: 0, y: 0 };

        this.movingDir = undefined;
    }

    createActions(actionTemplate) {
        this.actions = {};

        for (const actionName of Object.keys(actionTemplate)) {
            this.actions[actionName] = new Action({ sprites: actionTemplate[actionName] });
        }
    }

    walkForward() {
        this.currAction = this.actions['walking'];
        this.movingDir = 'forward';
    }

    walkBackward() {
        this.currAction = this.actions['walking'];
        this.movingDir = 'backward';
    }

    idle() {
        this.currAction = this.actions['idle'];
        this.movingDir = undefined;
    }

    attack() {
        this.currAction = this.actions['attacking'];
        this.currAction.actionCompleted = false;
    }

    update() {
        if (!this.currAction || this.currAction.isActionCompleted()) {
            this.idle();
        }

        if (this.movingDir === 'forward') {
            this.position.x += 3;
        } else if (this.movingDir === 'backward') {
            this.position.x -= 3;
        }

        this.currAction.update();
    }

    render(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);

        this.currAction.render(ctx);

        ctx.restore();
    }
}