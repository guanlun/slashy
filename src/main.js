import Config from './config';
import Renderer from './Renderer';
import Character from './Character';

const ZOMBIE_ACTIONS = {
    attacking: { length: 12 },
    walking: { length: 18 },
    idle: { length: 12 },
};

// const mainChar = new Character('main');
// mainChar._loadCharacter().then(() => {
//     window.requestAnimationFrame(renderScene);
// });

const zombie1 = new Character('zombie-1');
zombie1.loadCharacter(ZOMBIE_ACTIONS).then(() => {
    window.requestAnimationFrame(renderScene);
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function renderCharacter() {
    ctx.save();
    ctx.scale(0.5, 0.5);

    // mainChar.update();
    // mainChar.render(ctx);
    zombie1.update();
    zombie1.render(ctx);

    ctx.restore();
}

function renderScene() {
    ctx.clearRect(0, 0, 1000, 600);

    renderCharacter();

    window.requestAnimationFrame(renderScene);
}

document.addEventListener('keydown', evt => {
    switch (evt.keyCode) {
        case 37:
            mainChar.walkBackward();
            break;
        case 39:
            mainChar.walkForward();
            break;
        case 65:
            mainChar.attack();
            break;
        case 68:
            mainChar.die();
            break;
    }
});

document.addEventListener('keyup', evt => {
    switch (evt.keyCode) {
        case 37:
        case 39:
            mainChar.idle();
            break;
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
        // currAction = 'attack';
        mainChar.attack();
    }
}

wsConn.onerror = () => {
    console.log('error')
}