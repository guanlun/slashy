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

const sprites = {
    head: {
        path: '../images/sprites/PNG/all_body_parts/silver_helmet.png',
    },
    torso: {
        path: '../images/sprites/PNG/all_body_parts/silver_body.png',
    },
    foot: {
        path: '../images/sprites/PNG/all_body_parts/foot.png',
    },
};

let walkingCycle = 0;

function renderCharacter() {
    ctx.save();
    ctx.scale(0.5, 0.5);

    ctx.translate(200, 200);
    ctx.drawImage(sprites.torso.img, 0, 0);

    ctx.save();
    ctx.translate(-20, -160);
    ctx.drawImage(sprites.head.img, 0, 0);
    ctx.restore();

    ctx.save();
    const rightFootOffset = Math.sin(walkingCycle / 25 * Math.PI) * 3;
    ctx.translate(160, 180 + rightFootOffset);
    ctx.drawImage(sprites.foot.img, 0, 0);
    ctx.restore();

    ctx.save();
    const leftFootOffset = Math.sin((25 + walkingCycle / 25) * Math.PI) * 3;
    ctx.translate(40, 180 + leftFootOffset);
    ctx.drawImage(sprites.foot.img, 0, 0);
    ctx.restore();

    ctx.restore();

    walkingCycle++;
    if (walkingCycle > 100) {
        walkingCycle = 0;
    }
}

function renderScene() {
    ctx.clearRect(0, 0, 1000, 600);

    renderCharacter();

    window.requestAnimationFrame(renderScene);
}

Promise.all(Object.keys(sprites).map(sprite => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = data => {
        sprites[sprite].img = img;
        resolve();
    }
    img.src = sprites[sprite].path;
})))
.then(() => {
    window.requestAnimationFrame(renderScene);
});






// ctx.save();

// ctx.translate(200, 200);

// // torso
// ctx.beginPath();
// ctx.moveTo(0, 0);
// ctx.lineTo(0, -100);
// ctx.closePath();
// ctx.stroke();

// ctx.save();

// // leg
// // ctx.translate(100, 100);
// ctx.beginPath();
// ctx.moveTo(0, 0);
// ctx.lineTo(50, 50);
// ctx.closePath();
// ctx.stroke();

// ctx.restore();

// ctx.restore();