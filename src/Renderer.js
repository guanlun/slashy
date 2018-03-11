export default class Renderer {
    constructor(el) {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
    }

    render(sceneContent) {
        this.ctx.clearRect(0, 0, 1000, 600);
        this.ctx.save();

        for (const char of sceneContent.characters) {
            char.render(this.ctx);
        }

        this.ctx.restore();
    }
}