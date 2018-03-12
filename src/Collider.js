const DAMAGE_DISTANCE = 100;

export default class Collider {
    constructor(char) {
        this.character = char;
    }

    checkWeaponAttackCollision(weaponCollider) {
        if (weaponCollider === this) {
            return;
        }

        const dist = weaponCollider.character.position.x - this.character.position.x;
        if (weaponCollider.character.flipped) {
            if (dist > 0 && dist < DAMAGE_DISTANCE) {
                this.character.die();
            }
        } else {
            if (dist < 0 && dist > -DAMAGE_DISTANCE) {
                this.character.die();
            }
        }
    }
}