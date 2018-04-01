import { getHeroHP, getHeroMaxHP } from './GameStats';

export default class HUD {
    constructor() {

    }

    render(ctx) {
        ctx.font = "30px Arial";
        ctx.fillText(`HP: ${getHeroHP()} / ${getHeroMaxHP()}`, 100, 100);
    }
}