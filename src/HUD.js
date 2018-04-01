import { getHeroHP, getHeroMaxHP, startGame, isGameStarted } from './GameStats';

const HEALTH_BAR_LENGTH = 400;
const HEALTH_BAR_LINE_WIDTH = 2;

export default class HUD {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.menuEl = document.getElementById('hud-menus');
        this.startButton = document.getElementById('start-game-button');

        this.startButton.onclick = () => {
            console.log('should start')
            startGame();
        }
    }

    render(ctx) {
        if (isGameStarted()) {
            this.menuEl.style.display = 'none';
        }

        this.renderHealthBar(ctx);
    }

    renderHealthBar(ctx) {
        ctx.save();

        ctx.translate(20, 20);

        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, HEALTH_BAR_LENGTH * getHeroHP() / getHeroMaxHP(), 30);

        ctx.lineWidth = HEALTH_BAR_LINE_WIDTH;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(-HEALTH_BAR_LINE_WIDTH / 2, 0, HEALTH_BAR_LENGTH + HEALTH_BAR_LINE_WIDTH, 30);

        ctx.restore();
    }
}