import Config from './config';
import SceneManager from './SceneManager';
import { loadCharacterSprites } from './SpriteLoader';
import { COMMAND, setCommand } from './UserCommandManager';

const BASIC_CHAR_ACTIONS = {
    attacking: { length: 12 },
    walking: { length: 18 },
    idle: { length: 12 },
};

const CHARACTERS = {
    'main': {
        actionSpec: BASIC_CHAR_ACTIONS,
    },
    'zombie-1': {
        actionSpec: BASIC_CHAR_ACTIONS
    },
    'zombie-2': {
        actionSpec: BASIC_CHAR_ACTIONS
    },
    'zombie-3': {
        actionSpec: BASIC_CHAR_ACTIONS
    },
};

Promise.all(
    Object.keys(CHARACTERS).map(
        name => loadCharacterSprites(name, CHARACTERS[name].actionSpec)
    )
).then(characterSprites => {
    for (const char of characterSprites) {
        CHARACTERS[char.characterName].sprites = char.sprites;
    }
}).then(() => {
    const sceneManager = new SceneManager(CHARACTERS);
    sceneManager.createCharacters();

    sceneManager.start();
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

document.addEventListener('keydown', evt => {
    switch (evt.keyCode) {
        case 37:
            // mainChar.walkBackward();
            break;
        case 39:
            // mainChar.walkForward();
            setCommand(COMMAND.WALK);
            break;
        case 65:
            setCommand(COMMAND.ATTACK);
            // mainChar.attack();
            break;
        case 68:
            // mainChar.die();
            break;
    }
});

document.addEventListener('keyup', evt => {
    setCommand(COMMAND.IDLE);
    // switch (evt.keyCode) {
    //     case 37:
    //     case 39:
    //         // mainChar.idle();
    //         break;
    // }
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
        // currAction = 'attack';
        mainChar.attack();
    }
}

wsConn.onerror = () => {
    console.log('error')
}