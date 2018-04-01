import Character from "./Character";
import Renderer from './Renderer';
import HUD from './HUD';
import MainCharManager from './MainCharManager';
import ZombieBehavior from './ZombieBehavior';
import MainCharBehavior from './MainCharBehavior';
import { isGameStarted } from './GameStats';

export default class SceneManager {
    constructor(loadedResources) {
        this.loadedResources = loadedResources;

        this.sceneContent = {};
        this.colliders = [];

        this.createCharacters();
        this.createBackground();

        this.sceneContent.hud = this.hud = new HUD(this);

        this.renderer = new Renderer(this.sceneContent);
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
                position: { x: 1200, y: 0 },
                behavior: new ZombieBehavior(mainChar),
                sceneManager: this,
            }),
        ];

        this.spawnZombie(300);
        this.spawnZombie(600);
        this.spawnZombie(900);
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

    createBackground() {
        this.sceneContent.background = {
            img: this.loadedResources.background,
        };
    }

    update() {
        if (isGameStarted()) {
            for (const char of this.sceneContent.characters) {
                char.update();
            }

            this.renderer.render(this.sceneContent);
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
}