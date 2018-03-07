import Action from './Action';
import { loadCharacterSprites } from './SpriteLoader';

export default class Character {
    constructor(name) {
        this.name = name;
        this.actions = {};
        this.currAction = undefined;

        this.position = {
            x: 0,
            y: 0,
        };

        this.movingDir = undefined;
    }

    loadCharacter(characterSpec) {
        return loadCharacterSprites(this.name, characterSpec).then(actions => {
            this.actions = actions;
        });
    }

    walkForward() {
        this.currAction = this.actions['walk'];
        this.movingDir = 'forward';
    }

    walkBackward() {
        this.currAction = this.actions['walk'];
        this.movingDir = 'backward';
    }

    idle() {
        this.currAction = this.actions['idle'];
        this.movingDir = undefined;
    }

    attack() {
        this.currAction = this.actions['attack'];
        this.currAction.actionCompleted = false;
    }

    update() {
        if (!this.currAction || this.currAction.isActionCompleted()) {
            this.idle();
        }

        if (this.movingDir === 'forward') {
            this.position.x += 10;
        } else if (this.movingDir === 'backward') {
            this.position.x -= 6;
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