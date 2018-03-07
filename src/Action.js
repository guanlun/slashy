const REFRESH_PER_FRAME = 4;

export default class Action {
    constructor(characterId, actionName, actionSpec, sprites) {
        this.characterId = characterId;
        this.actionName = actionName;
        this.actionSpec = actionSpec;
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

            if (this.actionName === 'attack') {
                this.actionCompleted = true;
            }
        }
    }

    render(ctx) {
        ctx.drawImage(this.sprites[Math.floor(this.frameIdx / REFRESH_PER_FRAME)].img, 0, 0);
    }

    isActionCompleted() {
        return this.actionCompleted;
    }
}