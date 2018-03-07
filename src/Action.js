const SPRITE_DIR = '../images/sprites';
const REFRESH_PER_FRAME = 4;

function leftPadZero3(num) {
    const numStr = num + '';
    if (numStr.length === 3) {
        return numStr;
    } else if (numStr.length === 2) {
        return `0${numStr}`;
    } else if (numStr.length === 1) {
        return `00${numStr}`;
    } else {
        return numStr;
    }
}

export default class Action {
    constructor(characterId, actionName, actionSpec) {
        this.characterId = characterId;
        this.actionName = actionName;
        this.actionSpec = actionSpec;
        this.sprites = [];

        this.frameIdx = -1;
        this.actionCompleted = false;
    }

    loadSprite() {
        const baseName = this.actionName.charAt(0).toUpperCase() + this.actionName.slice(1);

        for (let i = 0; i < this.actionSpec.length; i++) {
            this.sprites.push({
                action: this.actionName,
                frameIdx: i,
                filePath: `${SPRITE_DIR}/${this.characterId}/${baseName}/${baseName}_${leftPadZero3(i)}.png`,
            });
        }

        return Promise.all(
            this.sprites.map(sprite => 
                new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = data => {
                        sprite.img = img;
                        resolve();
                    }
                    img.src = sprite.filePath;
                })
            )
        );
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