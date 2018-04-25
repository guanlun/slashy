import Character from "./Character";
import Renderer from './Renderer';
import Ground from './Ground';
import HUD from './HUD';
import MainCharManager from './MainCharManager';
import ZombieBehavior from './ZombieBehavior';
import FrogBehavior from './FrogBehavior';
import MainCharBehavior from './MainCharBehavior';
import Projectile from './Projectile';
import Potion from './Potion';
import RoadSign from './RoadSign';
import ThoughtBubble from './ThoughtBubble';
import { ACTIONS, THOUGHT_BUBBLES, ZOMBIE_SPEC } from './Constants';
import { isGameStarted, setPaused } from './GameStats';
import { TESTING_BOSS, ITEM_TYPES, BOSS_CUTSCENE_FRAME_LENGTH, BOSS_CUTSCENE_X_POSITION, BOSS_CUTSCENE_X_POSITION, BOSS_X_POSITION } from './Constants';
import Item from "./Item";

const EPSILON = 0.001;

export default class SceneManager {
    constructor(loadedResources) {
        this.loadedResources = loadedResources;

        this.sceneContent = {};
        this.colliders = [];

        this.createCharacters();
        this.createBackground();

        this.sceneContent.hud = this.hud = new HUD(this);

        this.renderer = new Renderer(this.sceneContent);

        this.gameStarted = false;
        this.bossEncountered = false;
        this.cutsceneFrameIdx = 0;
        this.mainCharDead = false;

        this.thoughtBubbles = THOUGHT_BUBBLES.map(tb => Object.assign(tb, { displayed: false }));
    }

    createCharacters() {
        const mainChar = new Character({
            name: 'main',
            actionTemplate: this.loadedResources.characters['main'],
            behavior: new MainCharBehavior(),
            sceneManager: this,
            mainCharManager: new MainCharManager(),
        });
        this.sceneContent.mainChar = mainChar;

        const boss = new Character({
            name: 'frog',
            actionTemplate: this.loadedResources.characters['frog'],
            position: { x: BOSS_X_POSITION, y: 0 },
            behavior: new FrogBehavior(mainChar),
            sceneManager: this,
        });
        this.sceneContent.boss = boss;

        this.sceneContent.characters = [ boss, mainChar ];

        this.sceneContent.items = [];

        this.sceneContent.grounds = [];

        this.sceneContent.baseGround = new Ground({ x: -10000, y: 0 }, 20000, this.loadedResources.ground);

        this.sceneContent.grounds.push(this.sceneContent.baseGround);

        this.sceneContent.roadSigns = [];

        if (!TESTING_BOSS) {
            for (let i = 0; i < 20; i++) {
                this.sceneContent.grounds.push(new Ground(
                    { x: Math.floor(Math.random() * 500) + 50, y: Math.floor(Math.random() * 2) + 1 },
                    10 + Math.floor(Math.random() * 10),
                    this.loadedResources.ground,
                ));
            }

            this.sceneContent.roadSigns.push(new RoadSign({ x: 900, y: 0 }, '301 Hospital', this.loadedResources.item.ROAD_SIGN));

            for (let i = 0; i < 10; i++) {
                this.spawnZombie(Math.floor(Math.random() * 300) + 500 * i + 1600, Math.floor(Math.random() * 300));
            }
        }
    }

    getMainCharHpRatio() {
        const mainChar = this.sceneContent.mainChar;
        return mainChar.hp / mainChar.behavior.hp;
    }

    respawn() {
        this.sceneContent.mainChar.respawn();
    }

    spawnZombie(xPosition, yPosition) {
        const zombieIdx = Math.ceil(Math.random() * 3);

        this.sceneContent.characters.push(
            new Character({
                name: `z${this.sceneContent.characters.length}`,
                actionTemplate: this.loadedResources.characters[`zombie-${zombieIdx}`],
                position: { x: xPosition, y: yPosition },
                behavior: new ZombieBehavior(this.sceneContent.mainChar, ZOMBIE_SPEC[zombieIdx - 1], Math.random() < 0.5),
                sceneManager: this,
            }),
        );
    }

    spawnItem(fromCharacter, itemSpec) {
        switch (itemSpec.type) {
            case ITEM_TYPES.PROJECTILE:
                this.sceneContent.items.push(new Projectile(this, itemSpec.position, itemSpec.velocity, this.loadedResources.item.FIRE_SHOOT, fromCharacter));
                break;
            case ITEM_TYPES.HEALTH_POTION:
                this.sceneContent.items.push(new Potion(this, itemSpec.position, itemSpec.velocity, this.loadedResources.item.HEALTH_POTION));
                break;
        }
    }

    createBackground() {
        this.sceneContent.background = {
            img: this.loadedResources.background,
        };
    }

    setMainCharDead(dead) {
        this.mainCharDead = dead;
        if (dead) {
            this.sceneContent.hud.showDeadMenu();
        }
    }

    startGame() {
        this.gameStarted = true;
    }

    update() {
        if (this.gameStarted) {
            if (this.bossEncountered) {
                if (this.cutsceneFrameIdx < BOSS_CUTSCENE_FRAME_LENGTH) {
                    this.cutsceneFrameIdx++;
                } else {
                    setPaused(false);
                }
            } else {
                if (this.sceneContent.mainChar.position.x > BOSS_CUTSCENE_X_POSITION) {
                    this.bossEncountered = true;

                    setPaused(true);

                    this.cutsceneFrameIdx = 0;
                }
            }

            const mainChar = this.sceneContent.mainChar;
            for (const tb of this.thoughtBubbles) {
                if (tb.displayed) {
                    continue;
                }

                if (tb.position !== undefined) {
                    const targetCharacter = tb.character ? tb.character(this.sceneContent) : mainChar;
                    if (!targetCharacter) {
                        continue;
                    }

                    if (mainChar.position.x >= tb.position) {
                        tb.displayed = true;
                        targetCharacter.addThoughtBubble(new ThoughtBubble(this.loadedResources.item.THOUGHT_BUBBLE, tb.text));
                    }
                } else if (tb.trigger !== undefined) {
                    if (tb.trigger(this.sceneContent)) {
                        tb.displayed = true;
                        targetCharacter.addThoughtBubble(new ThoughtBubble(this.loadedResources.item.THOUGHT_BUBBLE, tb.text));
                    }
                }
            }

            for (const char of this.sceneContent.characters) {
                char.update();
            }

            for (const item of this.sceneContent.items) {
                item.update(this.sceneContent.characters);
            }

            this.renderer.render(this.sceneContent, this.bossEncountered, this.cutsceneFrameIdx / BOSS_CUTSCENE_FRAME_LENGTH);
        }

        window.requestAnimationFrame(this.update.bind(this));
    }

    start() {
        window.requestAnimationFrame(this.update.bind(this));
    }

    registerCollider(collider) {
        this.colliders.push(collider);
    }

    checkAttackCollision(weaponCollider, attackType) {
        for (const collider of this.colliders) {
            collider.checkWeaponAttackCollision(weaponCollider, attackType);
        }
    }

    getGroundForPosition(position) {
        let highestGroundYPos = -Number.MAX_VALUE;
        let highestGround;

        for (const ground of this.sceneContent.grounds) {
            const groundRange = ground.getRange();
            const groundYPos = ground.position.y;

            if (position.x < groundRange.from || position.x > groundRange.to) {
                continue;
            }

            if (position.y - groundYPos > -EPSILON) {
                if (groundYPos > highestGroundYPos) {
                    highestGroundYPos = groundYPos;
                    highestGround = ground;
                }
            }
        }

        return highestGround ? highestGround : this.sceneContent.baseGround;
    }
}