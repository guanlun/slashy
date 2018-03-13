const CHAR_POS_OFFSET_Y = 250;

export default class Renderer {
    constructor(sceneContent) {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');

        this.backgroundPattern = this.ctx.createPattern(sceneContent.background.img, 'repeat-x');

        this.canvas.width = window.innerWidth;
        this.canvas.height = 600;
    }

    render(sceneContent) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        this.ctx.fillStyle = this.backgroundPattern;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderCharacters(sceneContent.characters);

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
}