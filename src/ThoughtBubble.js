const TIMEOUT = 300;
const FADE_DURATION = 30;

export default class ThoughBubble {
    constructor(sceneManager, img, text, invokeAfter) {
        this.sceneManager = sceneManager;
        this.img = img;
        this.text = text;
        this.timeout = TIMEOUT;
        this.invoked = false;
        this.invokeAfter = invokeAfter;
    }

    render(ctx) {
        ctx.save();
        let alpha = 1;

        if (this.timeout > TIMEOUT - FADE_DURATION) {
            alpha = (TIMEOUT - this.timeout) * (1 / FADE_DURATION);
        } else if (this.timeout < FADE_DURATION) {
            alpha = this.timeout * (1 / FADE_DURATION);
        }

        ctx.translate(-250, -180);

        ctx.globalAlpha = alpha;
        ctx.drawImage(this.img, 0, 0, 300, 200);

        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(this.text, 60, 100);

        ctx.restore();
    }
}