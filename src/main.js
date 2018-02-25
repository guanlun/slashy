import Config from './config';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const spriteDir = '../images/sprites/whole';

const sprites = {
    idle: [],
    attack: [],
    walk: [],
};

function isAtomicAction(actionKey) {
    return actionKey === 'attack';
}

for (const spriteKey of Object.keys(sprites)) {
    const fileBaseName = spriteKey.charAt(0).toUpperCase() + spriteKey.slice(1);

    for (let i = 0; i < 10; i++) {
        sprites[spriteKey].push({
            action: spriteKey,
            frameIdx: i,
            filePath: `${spriteDir}/${fileBaseName} (${i + 1}).png`,
        });
    }
}

let currAction = 'idle';
let animCycle = 0;

function renderSprite() {
    ctx.save();
    ctx.scale(0.3, 0.3);

    ctx.drawImage(sprites[currAction][Math.floor(animCycle / 3)].img, 0, 0);

    ctx.restore();

    animCycle++;

    if (animCycle >= 30) {
        animCycle = 0;
        if (isAtomicAction(currAction)) {
            currAction = 'idle';
        }
    }
}

function renderScene() {
    ctx.clearRect(0, 0, 1000, 600);

    renderSprite();

    window.requestAnimationFrame(renderScene);
}

const allSpriteFiles = Object.values(sprites)
    .reduce((s1, s2) => s1.concat(s2));

Promise.all(allSpriteFiles.map(spriteItem => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = data => {
        spriteItem.img = img;
        resolve();
    }
    img.src = spriteItem.filePath;
})))
.then(() => {
    window.requestAnimationFrame(renderScene);
});

document.addEventListener('keydown', evt => {
    if (evt.keyCode === 39) {
        currAction = 'walk';
    } else if (event.keyCode === 65) {
        animCycle = 0;
        currAction = 'attack';
    }
});

document.addEventListener('keyup', evt => {
    if (evt.keyCode === 39) {
        currAction = 'idle';
    }
});


// network stuff
const wsAddr = `ws://${Config.WS_SERVER_IP}:${Config.WS_SERVER_PORT}`;

const wsConn = new WebSocket(wsAddr);
wsConn.onopen = _ => {
    console.log('connected to ws server');
}

const indicator = document.querySelector('#main')

wsConn.onmessage = msg => {
    console.log(msg)
    if (msg.data === 'hack') {
        currAction = 'attack';
    }
}

wsConn.onerror = () => {
    console.log('error')
}