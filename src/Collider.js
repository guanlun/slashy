const DAMAGE_DISTANCE = 120;
import { ACTIONS } from './Constants';

export default class Collider {
    constructor(char) {
        this.character = char;
    }

    checkWeaponAttackCollision(weaponCollider, attackType) {
        if (weaponCollider.character.isMainChar() === this.character.isMainChar()) {
            return;
        }

        const attackDistance = (attackType === 'stab') ? 80 : 40;

        const hitBox = this.character.getHitBox();
        const hitPosition = weaponCollider.character.getAttackPosition();

        if (hitPosition.x >= hitBox.left &&
            hitPosition.x <= hitBox.right &&
            hitPosition.y >= hitBox.bottom &&
            hitPosition.y <= hitBox.top) {
            this.character.takeDamage(attackType === 'stab' ? 75 : 50);
        }

        // console.log(weaponCollider.character.position.x, this.character.position.x)
        // const xDist = weaponCollider.character.position.x - this.character.position.x;
        // const yDistAbs = Math.abs(weaponCollider.character.position.y - this.character.position.y);
        // if (weaponCollider.character.flipped) {
        //     if (xDist > 0 && xDist < DAMAGE_DISTANCE && yDistAbs < attackDistance) {
        //         this.character.takeDamage(50);
        //     }
        // } else {
        //     if (xDist < 0 && xDist > -DAMAGE_DISTANCE && yDistAbs < attackDistance) {
        //         this.character.takeDamage(50);
        //     }
        // }
    }
}