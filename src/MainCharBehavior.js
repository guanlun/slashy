import BaseBehavior from './BaseBehavior';
import { COMMAND, getCurrentCommand, isJumping } from './UserCommandManager';
import { ACTIONS } from './Constants';

export default class MainCharBehavior extends BaseBehavior {
    constructor(sounds = {}) {
        super();

        this.isMainChar = true;
        this.walkingSpeed = 8;
        this.hp = 500;
        this.stabFrameInSequence = 13;
        this.sounds = sounds;
    }

    update() {
        const cmd = getCurrentCommand();
        const currActionName = this.character.getCurrAction().id;

        switch (cmd) {
            case COMMAND.ATTACK:
                this.character.changeAction(ACTIONS.ATTACK);
                break;
            case COMMAND.STAB:
                this.character.changeAction(ACTIONS.STAB);
                break;
            case COMMAND.PARRY:
                this.character.changeAction(ACTIONS.PARRY);
                break;
            case COMMAND.WALK_FORWARD:
                this.character.flipped = false;
                this.character.changeAction(ACTIONS.WALK);
                break;
            case COMMAND.WALK_BACKWARD:
                this.character.flipped = true;
                this.character.changeAction(ACTIONS.WALK);
                break;
            case COMMAND.IDLE:
                this.character.changeAction(ACTIONS.IDLE);
                break;
        }

        if (isJumping()) {
            this.character.startJumping();
        }
    }

    die() {
        this.character.sceneManager.setMainCharDead(true);
    }
}