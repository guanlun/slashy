export const ACTIONS = {
    IDLE: 'idle',
    WALK: 'walking',
    ATTACK: 'attacking',
    HURT: 'hurt',
    DYING: 'dying',
};

export const ATOMIC_ACTIONS = [
    ACTIONS.ATTACK,
    ACTIONS.HURT,
    ACTIONS.DYING,
];

export const TERMINAL_ACTIONS = [
    ACTIONS.DYING,
];