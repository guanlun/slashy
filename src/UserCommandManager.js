let currCommand = null;

export const COMMAND = {
    IDLE: 0,
    ATTACK: 1,
    WALK: 2,
};

export function setCommand(cmd) {
    currCommand = cmd;
}

export function getCurrentCommand() {
    return currCommand;
}