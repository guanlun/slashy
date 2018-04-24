const DAMAGE_DISTANCE = 120;
import { ACTIONS } from './Constants';

export default class Collider {
    constructor(char) {
        this.character = char;
    }

    checkWeaponAttackCollision(weaponCollider) {
        if (weaponCollider.character.isMainChar() === this.character.isMainChar()) {
            return;
        }

        console.log(weaponCollider.character.position.x, this.character.position.x)
        const xDist = weaponCollider.character.position.x - this.character.position.x;
        const yDistAbs = Math.abs(weaponCollider.character.position.y - this.character.position.y);
        if (weaponCollider.character.flipped) {
            if (xDist > 0 && xDist < DAMAGE_DISTANCE && yDistAbs < 60) {
                this.character.takeDamage(50);
            }
        } else {
            if (xDist < 0 && xDist > -DAMAGE_DISTANCE && yDistAbs < 60) {
                this.character.takeDamage(50);
            }
        }
    }
}