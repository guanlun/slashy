export const ACTIONS = {
    IDLE: 'idle',
    WALK: 'walking',
    ATTACK: 'attacking',
    HURT: 'hurt',
    DYING: 'dying',
    JUMP: 'jumping',
    STAB: 'stab',
    PARRY: 'parry',
};

export const ATOMIC_ACTIONS = [
    ACTIONS.ATTACK,
    ACTIONS.HURT,
    ACTIONS.DYING,
    ACTIONS.JUMP,
    ACTIONS.STAB,
    ACTIONS.PARRY,
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

export const TESTING_BOSS = false;

export const BOSS_CUTSCENE_FRAME_LENGTH = 200;

export const BOSS_CUTSCENE_X_POSITION = TESTING_BOSS ? 500 : 8000;
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
    {
        trigger: sceneManager => sceneManager.sceneContent.boss.dead,
        text: 'The frog is dead.'
    }
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
        hp: 120,
        speed: 2,
    },
]