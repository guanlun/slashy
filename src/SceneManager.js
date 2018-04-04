import Character from "./Character";
import Renderer from './Renderer';
import Ground from './Ground';
import HUD from './HUD';
import MainCharManager from './MainCharManager';
import ZombieBehavior from './ZombieBehavior';
import FrogBehavior from './FrogBehavior';
import MainCharBehavior from './MainCharBehavior';
import Projectile from './Projectile';
import { isGameStarted, setPaused } from './GameStats';
import { ITEM_TYPES, BOSS_CUTSCENE_FRAME_LENGTH, BOSS_CUTSCENE_X_POSITION, BOSS_CUTSCENE_X_POSITION, BOSS_X_POSITION } from './Constants';

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

        this.bossEncountered = false;
        this.cutsceneFrameIdx = 0;
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

        this.sceneContent.characters = [
            mainChar,
            new Character({
                name: 'frog',
                actionTemplate: this.loadedResources.characters['frog'],
                position: { x: BOSS_X_POSITION, y: 0 },
                behavior: new FrogBehavior(mainChar),
                sceneManager: this,
            }),
        ];

        this.sceneContent.items = [];

        this.sceneContent.baseGround = new Ground({ x: -10000, y: 0 }, 20000);

        this.sceneContent.grounds = [
            this.sceneContent.baseGround,
            new Ground({ x: 2, y: 1 }, 10),
        ];

        // this.spawnZombie(500);
        // this.spawnZombie(900);
        // this.spawnZombie(1300);
    }

    spawnZombie(xPosition) {
        const resIdx = Math.ceil(Math.random() * 3);

        this.sceneContent.characters.push(
            new Character({
                name: `z${this.sceneContent.characters.length}`,
                actionTemplate: this.loadedResources.characters[`zombie-${resIdx}`],
                position: { x: xPosition, y: 0 },
                behavior: new ZombieBehavior(this.sceneContent.mainChar),
                sceneManager: this,
            }),
        );
    }

    spawnItem(fromCharacter, itemSpec) {
        switch (itemSpec.type) {
            case ITEM_TYPES.PROJECTILE:
                this.sceneContent.items.push(new Projectile(itemSpec.position, itemSpec.velocity, this.loadedResources.item.FIRE_SHOOT, fromCharacter));
                break;
        }
    }

    createBackground() {
        this.sceneContent.background = {
            img: this.loadedResources.background,
        };
    }

    update() {
        if (isGameStarted()) {
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

    checkAttackCollision(weaponCollider) {
        for (const collider of this.colliders) {
            collider.checkWeaponAttackCollision(weaponCollider);
        }
    }

    getGroundForCharacter(character) {
        let highestGroundYPos = -Number.MAX_VALUE;
        let highestGround;

        for (const ground of this.sceneContent.grounds) {
            const charXPos = character.getCenterXPos();
            const charYPos = character.position.y;
            const groundRange = ground.getRange();
            const groundYPos = ground.position.y;

            if (charXPos < groundRange.from || charXPos > groundRange.to) {
                continue;
            }

            if (charYPos - groundYPos > -EPSILON) {
                if (groundYPos > highestGroundYPos) {
                    highestGroundYPos = groundYPos;
                    highestGround = ground;
                }
            }
        }

        return highestGround ? highestGround : this.sceneContent.baseGround;
    }
}