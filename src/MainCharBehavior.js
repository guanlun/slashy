import BaseBehavior from './BaseBehavior';
import { COMMAND, getCurrentCommand } from './UserCommandManager';

export default class MainCharBehavior extends BaseBehavior {
    update() {
        const cmd = getCurrentCommand();
        const currActionName = this.character.getCurrActionName();

        switch (cmd) {
            case COMMAND.ATTACK:
                this.character.attack();
                break;
            case COMMAND.WALK_FORWARD:
                if (currActionName === 'walking') {
                    if (this.character.flipped) {
                        this.character.flip();
                    }
                } else {
                    this.character.walk();
                }
                break;
            case COMMAND.WALK_BACKWARD:
                if (currActionName === 'walking') {
                    if (!this.character.flipped) {
                        this.character.flip();
                    }
                } else {
                    this.character.walk();
                }
                break;
            case COMMAND.IDLE:
                this.character.idle();
                break;
        }
    }
}