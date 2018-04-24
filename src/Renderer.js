import { BOSS_CUTSCENE_X_POSITION } from './Constants';

const CHAR_POS_OFFSET_Y = 350;
const ITEM_POS_OFFSET_Y = 420;
const GROUND_ZERO_Y = 510;

export default class Renderer {
    constructor(sceneContent) {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');

        this.backgroundPattern = this.ctx.createPattern(sceneContent.background.img, 'repeat-x');

        this.canvas.width = window.innerWidth;
        this.canvas.height = 600;
    }

    render(sceneContent, bossEncountered = false, cutsceneTransitionFraction = 0) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();

        const baseXPosition =
            (1 - cutsceneTransitionFraction) * (sceneContent.mainChar.position.x - this.canvas.width / 2 + 160)
            + cutsceneTransitionFraction * BOSS_CUTSCENE_X_POSITION;
        this.ctx.translate(-baseXPosition, 0);

        this.renderBackground(this.backgroundPattern, baseXPosition);
        this.renderGrounds(sceneContent.grounds);
        this.renderItems(sceneContent.items);
        for (const roadSign of sceneContent.roadSigns) {
            roadSign.render(this.ctx);
        }

        this.renderCharacters(sceneContent.characters);

        this.ctx.restore();

        if (sceneContent.hud) {
            sceneContent.hud.render(this.ctx);
        }
    }

    renderBackground(background, baseXPosition) {
        this.ctx.save();
        this.ctx.fillStyle = this.backgroundPattern;
        this.ctx.fillRect(baseXPosition, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    renderCharacters(characters) {
        this.ctx.save();

        this.ctx.translate(0, CHAR_POS_OFFSET_Y);

        for (const char of characters) {
            char.render(this.ctx);
        }

        this.ctx.restore();
    }

    renderGrounds(grounds) {
        this.ctx.save();

        this.ctx.translate(0, GROUND_ZERO_Y);

        for (const ground of grounds) {
            ground.render(this.ctx);
        }

        this.ctx.restore();
    }

    renderItems(items) {
        this.ctx.save();

        this.ctx.translate(0, ITEM_POS_OFFSET_Y);

        for (const item of items) {
            item.render(this.ctx);
        }

        this.ctx.restore();
    }
}