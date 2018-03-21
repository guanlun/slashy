import Config from './config';
import SceneManager from './SceneManager';
import { loadResources } from './SpriteLoader';
import { COMMAND, setCommand, setJumping } from './UserCommandManager';

const BASIC_CHAR_ACTIONS = {
    attacking: { length: 12 },
    walking: { length: 18 },
    idle: { length: 12 },
    dying: { length: 15 },
    hurt: { length: 12 },
    jumping: { length: 6 },
};

const CHARACTERS = {
    'main': {
        actionSpec: BASIC_CHAR_ACTIONS,
    },
    'zombie-1': {
        actionSpec: BASIC_CHAR_ACTIONS,
    },
    'zombie-2': {
        actionSpec: BASIC_CHAR_ACTIONS,
    },
    'zombie-3': {
        actionSpec: BASIC_CHAR_ACTIONS,
    },
};

let background = null;

loadResources({
    characters: CHARACTERS,
    background: 'seamless-bg',
}).then(loadedResources => {
    const sceneManager = new SceneManager(loadedResources);
    sceneManager.start();
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

document.addEventListener('keydown', evt => {
    switch (evt.keyCode) {
        case 37:
            setCommand(COMMAND.WALK_BACKWARD);
            break;
        case 39:
            setCommand(COMMAND.WALK_FORWARD);
            break;
        case 65:
            setCommand(COMMAND.ATTACK);
            break;
        case 32:
            evt.preventDefault();
            setJumping(true);
            break;
    }
});

document.addEventListener('keyup', evt => {
    if (evt.keyCode === 32) {
        setJumping(false);
    } else {
        setCommand(COMMAND.IDLE);
    }
});

const wsAddr = `ws://${Config.WS_SERVER_IP}:${Config.WS_SERVER_PORT}`;

const wsConn = new WebSocket(wsAddr);
wsConn.onopen = _ => {
    console.log('connected to ws server');
}

const indicator = document.querySelector('#main')

wsConn.onmessage = msg => {
    console.log(msg)
    if (msg.data === 'hack') {
        mainChar.attack();
    }
}

wsConn.onerror = () => {
    console.log('error')
}