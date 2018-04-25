export default class BaseBehavior {
    constructor() {
        this.defaultFlipped = false;
        this.centerXOffset = 100;
        this.animationFrameLength = 1;
        this.attackFrameInSequence = 10;
        this.riseWhenDead = false;
        this.yRenderOffset = 0;
        this.hitBoxWidth = 100;
        this.characterHeight = 110;
    }

    setCharacter(char) {
        this.character = char;
    }

    update() {

    }

    performAttack(sceneManager, attackType = 'normal') {
        sceneManager.checkAttackCollision(this.character.collider, attackType);
    }

    onReachedBoundary() {

    }

    die() {

    }

    dead() {

    }
}