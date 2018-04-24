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

export const BOSS_CUTSCENE_X_POSITION = 6000;
export const BOSS_X_POSITION = BOSS_CUTSCENE_X_POSITION + 1200;

export const THOUGHT_BUBBLES = [
    {
        position: 0,
        text: 'Where am I?',
    },
    {
        position: 500,
        text: 'The haunted hospital!',
    },
    {
        position: 1000,
        text: 'What is that thing!?',
    },
    {
        position: BOSS_CUTSCENE_X_POSITION - 500,
        text: 'I see it. The frog.',
    },
];

export const ZOMBIE_SPEC = [
    {
        hp: 50,
        speed: 3,
    },
    {
        hp: 50,
        speed: 6,
    },
    {
        hp: 100,
        speed: 2,
    },
]