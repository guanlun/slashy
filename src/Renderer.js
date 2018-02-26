export default class Renderer {
    constructor(el) {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
    }

    startRender() {
        window.requestAnimationFrame(this.render);
    }

    render() {
        this.ctx.save();

        this.ctx.restore();

        window.requestAnimationFrame(this.render);
    }
}