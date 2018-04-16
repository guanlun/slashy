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

export const ITEM_TYPES = {
    PROJECTILE: 'projectile',
    HEALTH_POTION: 'health-potion',
};

export const BOSS_CUTSCENE_FRAME_LENGTH = 20;

export const BOSS_CUTSCENE_X_POSITION = 1000;
export const BOSS_X_POSITION = BOSS_CUTSCENE_X_POSITION + 1200;