import BaseBehavior from './BaseBehavior';
import { COMMAND, getCurrentCommand } from './UserCommandManager';
import { ACTIONS } from './Constants';

export default class MainCharBehavior extends BaseBehavior {
    update() {
        const cmd = getCurrentCommand();
        const currActionName = this.character.getCurrAction().id;

        switch (cmd) {
            case COMMAND.ATTACK:
                this.character.changeAction(ACTIONS.ATTACK);
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
    }
}