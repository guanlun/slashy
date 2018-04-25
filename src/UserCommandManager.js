let currCommand = null;
let jumping = false;

export const COMMAND = {
    IDLE: 0,
    ATTACK: 1,
    WALK_FORWARD: 2,
    WALK_BACKWARD: 3,
    JUMP: 4,
    STAB: 5,
    PARRY: 6,
};

export function setCommand(cmd) {
    currCommand = cmd;
}

export function setJumping(j) {
    jumping = j;
}

export function getCurrentCommand() {
    const cmd = currCommand;

    if (cmd === COMMAND.ATTACK || cmd === COMMAND.STAB || cmd === COMMAND.PARRY) {
        currCommand = COMMAND.IDLE;
    }

    return cmd;
}

export function isJumping() {
    const j = jumping;
    jumping = false;
    return j;
}