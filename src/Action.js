const REFRESH_PER_FRAME = 3;

export default class Action {
    constructor({ actionName = '', sprites }) {
        this.actionName = actionName;
        this.sprites = sprites;

        this.frameIdx = -1;
        this.actionCompleted = false;
    }

    update() {
        if (this.actionCompleted) {
            return;
        }

        this.frameIdx++;
        if (this.frameIdx >= this.sprites.length * REFRESH_PER_FRAME) {
            this.frameIdx = 0;

            if (this.actionName === 'attacking') {
                this.actionCompleted = true;
            }
        }
    }

    render(ctx, flipped) {
        ctx.drawImage(
            this.sprites[Math.floor(this.frameIdx / REFRESH_PER_FRAME)],
            0,
            0,
            flipped ? -200 : 200, 200
        );
    }

    isActionCompleted() {
        return this.actionCompleted;
    }
}