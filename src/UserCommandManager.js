let currCommand = null;
let jumping = false;

export const COMMAND = {
    IDLE: 0,
    ATTACK: 1,
    WALK_FORWARD: 2,
    WALK_BACKWARD: 3,
    JUMP: 4,
};

export function setCommand(cmd) {
    currCommand = cmd;
}

export function setJumping(j) {
    jumping = j;
}

export function getCurrentCommand() {
    return currCommand;
}

export function isJumping() {
    return jumping;
}