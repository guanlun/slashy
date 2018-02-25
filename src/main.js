import Config from './config';

// const wsAddr = `ws://${Config.WS_SERVER_IP}:${Config.WS_SERVER_PORT}`;

// const wsConn = new WebSocket(wsAddr);
// wsConn.onopen = _ => {
//     console.log('connected to ws server');
// }

// const indicator = document.querySelector('#main')

// wsConn.onmessage = msg => {
//     if (msg.data === 'hack') {
//         indicator.style.background = 'red';

//         setTimeout(_ => {
//             indicator.style.background = 'white';
//         }, 500);
//     }
// }

// wsConn.onerror = () => {
//     console.log('error')
// }

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// const sprites = {
//     head: {
//         path: '../images/sprites/PNG/all_body_parts/silver_helmet.png',
//     },
//     torso: {
//         path: '../images/sprites/PNG/all_body_parts/silver_body.png',
//     },
//     foot: {
//         path: '../images/sprites/PNG/all_body_parts/foot.png',
//     },
// };

const spriteDir = '../images/sprites/whole';

const sprites = {
    // attack: {
    //     baseName: 'Attack',
    //     sequence: [],
    // },
    idle: [],
    attack: [],
    walk: [],
};

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

// let isWalking = false;
// let walkingCycle = 0;
let animCycle = 0;

// function renderCharacter() {
//     ctx.save();
//     ctx.scale(0.5, 0.5);

//     ctx.translate(200, 200);
//     ctx.drawImage(sprites.torso.img, 0, 0);

//     ctx.save();
//     ctx.translate(-20, -160);
//     ctx.drawImage(sprites.head.img, 0, 0);
//     ctx.restore();

//     ctx.save();
//     const rightFootOffset = Math.sin(walkingCycle / 25 * Math.PI) * 3;
//     ctx.translate(160, 180 + rightFootOffset);
//     ctx.drawImage(sprites.foot.img, 0, 0);
//     ctx.restore();

//     ctx.save();
//     const leftFootOffset = Math.sin((25 + walkingCycle / 25) * Math.PI) * 3;
//     ctx.translate(40, 180 + leftFootOffset);
//     ctx.drawImage(sprites.foot.img, 0, 0);
//     ctx.restore();

//     ctx.restore();

//     if (isWalking || walkingCycle > 0) {
//         walkingCycle++;
//         if (walkingCycle > 50) {
//             walkingCycle = 0;
//         }
//     }
// }

function renderSprite() {
    ctx.save();
    ctx.scale(0.3, 0.3);

    ctx.drawImage(sprites.idle[Math.floor(animCycle / 3)].img, 0, 0);

    ctx.restore();

    animCycle++;
    if (animCycle >= 30) {
        animCycle = 0;
    }
}

function renderScene() {
    ctx.clearRect(0, 0, 1000, 600);

    // renderCharacter();
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
        isWalking = true;
    }
});

document.addEventListener('keyup', evt => {
    if (evt.keyCode === 39) {
        isWalking = false;
    }
});
