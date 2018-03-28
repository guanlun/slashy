import { ACTIONS } from "./Constants";

export default class HealthManager {
    constructor(character, maxHp) {
        this.character = character;
        this.maxHp = maxHp;
        this.hp = maxHp;
    }

    takeDamage(damage) {
        this.hp -= damage;

        if (this.hp <= 0) {
            this.character.changeAction(ACTIONS.DYING);
        }
    }
}