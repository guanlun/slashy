import Config from './config';
import Renderer from './Renderer';
import Character from './Character';

const mainChar = new Character('main');
mainChar.loadCharacter().then(() => {
    window.requestAnimationFrame(renderScene);
})

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function renderCharacter() {
    ctx.save();
    ctx.scale(0.3, 0.3);

    mainChar.update();
    mainChar.render(ctx);

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
