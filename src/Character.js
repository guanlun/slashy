import Collider from './Collider';
import { setHeroHP, setHeroMaxHP, getPaused } from './GameStats';
import { loadCharacterSprites } from './SpriteLoader';
import { ACTIONS, ATOMIC_ACTIONS, TERMINAL_ACTIONS, CONTINUING_ACTIONS, BOSS_CUTSCENE_X_POSITION, BOSS_X_POSITION } from './Constants';
import { ENGINE_METHOD_CIPHERS } from 'constants';

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
        this.frameIndexAfterDying = 0;
        this.alpha = 1;
        this.yVel = 0;

        this.invicibleFrameCount = this.behavior.isMainChar ? 100 : 0;

        this.thoughtBubble = null;

        this.collider = new Collider(this);
        this.hp = behavior.hp;
        this.sceneManager.registerCollider(this.collider);
    }

    isMainChar() {
        return this.behavior.isMainChar;
    }

    isBoss() {
        return this.behavior.isBoss;
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
            this.frameIndexAfterDying++;
            return;
        }

        this.behavior.update();

        const currActionSequence = this.actionSeqs[this.currAction];

        const currActionAtomic = isAtomic(this.currAction);

        if (this.dying) {
            this.frameIndexAfterDying++;

            if (this.behavior.riseWhenDead) {
                this.position.y += 3;
                this.alpha -= 0.01;
                if (this.alpha < 0) {
                    this.alpha = 0;
                }
            }
        } else {
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
        }

        if (currActionAtomic && this.actionCompleted) {
            this.setAction(this.nextAction || ACTIONS.IDLE);
        }

        if (!getPaused()) {
            switch (this.currAction) {
                case ACTIONS.WALK:
                    this.position.x += this.flipped ? -this.behavior.walkingSpeed : this.behavior.walkingSpeed;

                    if (this.sceneManager.bossEncountered) {
                        if (this.position.x < BOSS_CUTSCENE_X_POSITION) {
                            this.position.x = BOSS_CUTSCENE_X_POSITION;
                            this.behavior.onReachedBoundary();
                        } else if (this.position.x > BOSS_X_POSITION) {
                            this.position.x = BOSS_X_POSITION;
                            this.behavior.onReachedBoundary();
                        }
                    }
                    break;
                case ACTIONS.ATTACK:
                    if (this.frameSkipCount === 0 && this.actionFrameIdx === this.behavior.attackFrameInSequence) {
                        this.behavior.performAttack(this.sceneManager, 'normal');
                    }
                    break;
                case ACTIONS.STAB:
                    if (this.frameSkipCount === 0 && this.actionFrameIdx === this.behavior.stabFrameInSequence) {
                        this.behavior.performAttack(this.sceneManager, 'stab');
                    }
                    break;
            }
        }

        this.frameSkipCount++;
        if (this.frameSkipCount === REFRESH_PER_FRAME * this.behavior.animationFrameLength) {
            this.frameSkipCount = 0;

            this.actionFrameIdx++;
        }

        if (this.invicibleFrameCount > 0) {
            this.invicibleFrameCount--;
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

        if (this.thoughtBubble) {
            if (this.thoughtBubble.timeout > 0) {
                this.thoughtBubble.timeout--;
            }

            if (this.thoughtBubble.timeout === 0) {
                this.thoughtBubble = null;
            }
        }
    }

    findGround() {
        return this.sceneManager.getGroundForPosition({
            x: this.getCenterXPos(),
            y: this.position.y,
        });
    }

    startJumping() {
        if (this.jumping) {
            return;
        }

        this.jumping = true;
        this.yVel = 2.0;
    }

    heal(amount) {
        this.hp = Math.min(this.behavior.hp, this.hp + amount);

        if (this.mainCharManager) {
            this.mainCharManager.setHP(this.hp);
        }
    }

    takeDamage(damage) {
        if (this.dead) {
            return;
        }

        if (this.invicibleFrameCount > 0) {
            return;
        }

        if (this.currAction === ACTIONS.PARRY) {
            return;
        }

        this.changeAction(ACTIONS.HURT);

        this.hp -= damage;

        if (this.hp <= 0) {
            this.hp = 0;
            this.changeAction(ACTIONS.DYING);
            this.behavior.die();
        }

        if (this.mainCharManager) {
            this.mainCharManager.setHP(this.hp);
        }
    }

    render(ctx) {
        if (!this.isMainChar() && !this.isBoss()) {
            if (this.frameIndexAfterDying > 400) {
                return;
            } else if (this.frameIndexAfterDying > 200) {
                this.alpha = 1 - (this.frameIndexAfterDying - 200) / (400 - 200);
            }
        }

        ctx.save();

        ctx.globalAlpha = this.alpha;

        ctx.translate(this.position.x, -this.position.y + this.behavior.yRenderOffset);

        if (this.thoughtBubble) {
            this.thoughtBubble.render(ctx);
        }

        if (this.flipped) {
            ctx.scale(-1, 1);
        }

        // We made our own "stab" animation, it was not perfect, so we need some visual tweaks here
        if (this.currAction === ACTIONS.STAB) {
            ctx.translate(32, -6);
            ctx.scale(1.03, 1);
        }

        const currActionSequence = this.actionSeqs[this.currAction];

        if (this.invicibleFrameCount > 0) {
            ctx.globalAlpha = 0.2;
        }

        ctx.drawImage(
            currActionSequence[this.actionFrameIdx],
            0,
            0,
            this.flipped ? -200 : 200,
            200
        );

        ctx.restore();
    }

    spawnItem(itemSpec) {
        this.sceneManager.spawnItem(this, itemSpec);
    }

    getCenterXPos() {
        return this.position.x + this.behavior.centerXOffset;
    }

    getHitBox() {
        const baseOffset = 100;
        const halfHitBoxWidth = this.behavior.hitBoxWidth / 2;

        return {
            left: this.position.x + baseOffset - halfHitBoxWidth,
            right: this.position.x + baseOffset + halfHitBoxWidth,
            top: this.position.y + this.behavior.characterHeight,
            bottom: this.position.y,
        };
    }

    getAttackPosition() {
        const baseOffset = 100;
        let attackDistance = 0;
        if (this.currAction === ACTIONS.STAB) {
            attackDistance = 100;
        } else if (this.currAction === ACTIONS.ATTACK) {
            attackDistance = 60;
        }

        return {
            x: this.position.x + baseOffset + (this.flipped ? -attackDistance : attackDistance),
            y: this.position.y + 30,
        };
    }

    respawn() {
        this.changeAction(ACTIONS.IDLE);
        this.dying = false;
        this.dead = false;
        this.position.y = 500;
        this.hp = this.behavior.hp;
        this.invicibleFrameCount = 100;
    }

    addThoughtBubble(tb) {
        this.thoughtBubble = tb;
    }
}