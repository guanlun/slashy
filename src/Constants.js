export const ACTIONS = {
    IDLE: 'idle',
    WALK: 'walking',
    ATTACK: 'attacking',
    HURT: 'hurt',
    DYING: 'dying',
    JUMP: 'jumping',
};

export const ATOMIC_ACTIONS = [
    ACTIONS.ATTACK,
    ACTIONS.HURT,
    ACTIONS.DYING,
    ACTIONS.JUMP,
];

export const CONTINUING_ACTIONS = [
    ACTIONS.JUMP,
];

export const TERMINAL_ACTIONS = [
    ACTIONS.DYING,
];