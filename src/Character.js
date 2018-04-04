import Collider from './Collider';
import { setHeroHP, setHeroMaxHP, getPaused } from './GameStats';
import { loadCharacterSprites } from './SpriteLoader';
import { ACTIONS, ATOMIC_ACTIONS, TERMINAL_ACTIONS, CONTINUING_ACTIONS, BOSS_CUTSCENE_X_POSITION, BOSS_X_POSITION } from './Constants';

function isAtomic(action) {
    return ATOMIC_ACTIONS.indexOf(action) !== -1;
}

function isTerminal(action) {
    return TERMINAL_ACTIONS.indexOf(action) !== -1;
}

const REFRESH_PER_FRAME = 3;

export default class Character {
    constructor({
        name = '',
        actionTemplate = {},
        position = { x: 0, y: 0 },
        behavior,
        sceneManager,
        mainCharManager,
    }) {
        this.name = name;

        this.actionSeqs = actionTemplate;
        this.actionFrameIdx = 0;
        this.frameSkipCount = 0;
        this.actionCompleted = false;

        this.jumpFrameIdx = 0;

        this.currAction = ACTIONS.IDLE;
        this.behavior = behavior;
        this.behavior.setCharacter(this);

        this.sceneManager = sceneManager;

        this.mainCharManager = mainCharManager;
        if (mainCharManager) {
            setHeroMaxHP(this.behavior.hp);
            setHeroHP(this.behavior.hp);
        }

        this.position = position || { x: 0, y: 0 };

        this.flipped = this.behavior.defaultFlipped;

        this.dying = false;
        this.dead = false;
        this.yVel = 0;

        this.collider = new Collider(this);
        this.hp = behavior.hp;
        this.sceneManager.registerCollider(this.collider);
    }

    isMainChar() {
        return this.behavior.isMainChar;
    }

    getCurrAction() {
        return this.currAction;
    }

    changeAction(action) {
        if (this.dying || this.dead) {
            return;
        }

        if (action === this.currAction) {
            return;
        }

        if (action === ACTIONS.DYING) {
            this.dying = true;
        }

        if (isAtomic(this.currAction)) {
            if (this.currAction === ACTIONS.HURT && action === ACTIONS.DYING) {
                this.setAction(action);
            } else {
                this.nextAction = action;
            }
        } else {
            this.setAction(action);
        }
    }

    setAction(action) {
        this.currAction = action;
        this.actionFrameIdx = 0;
        this.actionCompleted = false;
    }

    update() {
        if (this.dead) {
            return;
        }

        this.behavior.update();

        const currActionSequence = this.actionSeqs[this.currAction];

        const currActionAtomic = isAtomic(this.currAction);

        const standingGround = this.findGround();
        this.yVel -= 0.1;
        this.position.y += this.yVel * 12;

        if (this.position.y < standingGround.position.y) {
            // character became lower than the standing ground => landed
            this.yVel = 0;
            this.position.y = standingGround.position.y;

            this.jumping = false;
        } else {
            this.jumping = true;
        }

        if (currActionAtomic && this.actionCompleted) {
            // console.log(this.nextAction)
            this.setAction(this.nextAction || ACTIONS.IDLE);
        }

        if (!getPaused()) {
            // TODO: move to behavior classes?
            switch (this.currAction) {
                case ACTIONS.WALK:
                    this.position.x += this.flipped ? -this.behavior.walkingSpeed : this.behavior.walkingSpeed;

                    if (this.sceneManager.bossEncountered) {
                        if (this.position.x < BOSS_CUTSCENE_X_POSITION) {
                            this.position.x = BOSS_CUTSCENE_X_POSITION;
                        } else if (this.position.x > BOSS_X_POSITION) {
                            this.position.x = BOSS_X_POSITION;
                        }
                    }
                    break;
                case ACTIONS.ATTACK:
                    if (this.frameSkipCount === 0 && this.actionFrameIdx === this.behavior.attackFrameInSequence) {
                        this.behavior.performAttack(this.sceneManager);
                    }
                    break;
            }
        }

        this.frameSkipCount++;
        if (this.frameSkipCount === REFRESH_PER_FRAME * this.behavior.animationFrameLength) {
            this.frameSkipCount = 0;

            this.actionFrameIdx++;
        }

        if (this.actionFrameIdx === currActionSequence.length) {
            if (currActionAtomic) {
                this.actionCompleted = true;
            }

            if (this.currAction === ACTIONS.DYING) {
                this.actionFrameIdx--;
                this.dead = true;
            } else {
                this.actionFrameIdx = 0;
            }
        }
    }

    findGround() {
        return this.sceneManager.getGroundForCharacter(this);
    }

    startJumping() {
        if (this.jumping) {
            return;
        }

        this.jumping = true;
        this.yVel = 2.0;
    }

    takeDamage(damage) {
        this.changeAction(ACTIONS.HURT);

        this.hp -= damage;

        if (this.hp <= 0) {
            this.changeAction(ACTIONS.DYING);
        }

        if (this.mainCharManager) {
            this.mainCharManager.setHP(this.hp);
        }
    }

    render(ctx) {
        ctx.save();

        ctx.translate(this.position.x, -this.position.y);

        if (this.flipped) {
            ctx.scale(-1, 1);
        }

        const currActionSequence = this.actionSeqs[this.currAction];

        ctx.drawImage(
            currActionSequence[this.actionFrameIdx],
            0,
            0,
            this.flipped ? -200 : 200, 200
        );

        ctx.restore();
    }

    spawnItem(item) {
        this.sceneManager.spawnItem(item);
    }

    getCenterXPos() {
        return this.position.x + this.behavior.centerXOffset;
    }
}