import BaseBehavior from './BaseBehavior';
import { COMMAND, getCurrentCommand } from './UserCommandManager';

export default class MainCharBehavior extends BaseBehavior {
    update() {
        const cmd = getCurrentCommand();

        switch (cmd) {
            case COMMAND.ATTACK:
                this.character.attack();
                break;
            case COMMAND.WALK:
                this.character.walkForward();
                break;
            case COMMAND.IDLE:
                this.character.idle();
                break;
        }
    }
}