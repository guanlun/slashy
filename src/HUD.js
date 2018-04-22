const HEALTH_BAR_LENGTH = 400;
const HEALTH_BAR_LINE_WIDTH = 2;

export default class HUD {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.menuEl = document.getElementById('hud-menus');

        this.mainMenu = document.getElementById('menu-main');
        this.startButton = document.getElementById('start-game-button');

        this.startButton.onclick = () => {
            this.sceneManager.startGame();
            this.showMenu(false, this.mainMenu);
        }

        this.deadMenu = document.getElementById('menu-dead');
        this.respawnButton = document.getElementById('respawn-button');

        this.respawnButton.onclick = () => {
            this.showMenu(false, this.deadMenu);
            this.sceneManager.respawn();
        }
    }

    showMenu(shouldShow, menu) {
        this.menuEl.style.display = shouldShow ? 'flex' : 'none';
        menu.style.display = shouldShow ? 'block' : 'none';
    }

    showDeadMenu() {
        this.showMenu(true, this.deadMenu);
    }

    render(ctx) {
        this.renderHealthBar(ctx);
    }

    renderHealthBar(ctx) {
        ctx.save();

        ctx.translate(20, 20);

        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, HEALTH_BAR_LENGTH * this.sceneManager.getMainCharHpRatio(), 30);

        ctx.lineWidth = HEALTH_BAR_LINE_WIDTH;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(-HEALTH_BAR_LINE_WIDTH / 2, 0, HEALTH_BAR_LENGTH + HEALTH_BAR_LINE_WIDTH, 30);

        ctx.restore();
    }
}