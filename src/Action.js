const REFRESH_PER_FRAME = 3;

export default class Action {
    constructor({ actionName = '', sprites }) {
        this.actionName = actionName;
        this.sprites = sprites;

        this.frameIdx = -1;
        this.frameSkipCount = 0;
        this.actionCompleted = false;
    }

    update() {
        if (this.actionCompleted) {
            return;
        }

        if (this.frameSkipCount === 0) {
            this.frameIdx++;
        }

        if (this.frameIdx === this.sprites.length) {
            if (this.actionName === 'dying') {
                this.frameIdx--;
            } else {
                this.frameIdx = 0;
            }

            if (this.actionName === 'attacking') {
                this.actionCompleted = true;
            }
        }

        this.frameSkipCount++;

        if (this.frameSkipCount === REFRESH_PER_FRAME) {
            this.frameSkipCount = 0;
        }
    }

    render(ctx, flipped) {
        ctx.drawImage(
            this.sprites[this.frameIdx],
            0,
            0,
            flipped ? -200 : 200, 200
        );
    }

    getAnimationFrameIdx() {
        return this.frameIdx;
    }

    isActionCompleted() {
        return this.actionCompleted;
    }
}