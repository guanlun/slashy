let currCommand = null;

export const COMMAND = {
    IDLE: 0,
    ATTACK: 1,
    WALK_FORWARD: 2,
    WALK_BACKWARD: 3,
};

export function setCommand(cmd) {
    currCommand = cmd;
}

export function getCurrentCommand() {
    return currCommand;
}