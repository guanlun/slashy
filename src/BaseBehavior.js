export default class BaseBehavior {
    constructor() {
        this.defaultFlipped = false;
        this.centerXOffset = 100;
        this.animationFrameLength = 1;
        this.attackFrameInSequence = 10;
    }

    setCharacter(char) {
        this.character = char;
    }

    update() {

    }

    performAttack(sceneManager) {
        sceneManager.checkAttackCollision(this.character.collider);
    }
}