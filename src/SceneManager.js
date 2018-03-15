import Character from "./Character";
import Renderer from './Renderer';

import ZombieBehavior from './ZombieBehavior';
import MainCharBehavior from './MainCharBehavior';

export default class SceneManager {
    constructor(loadedResources) {
        this.loadedResources = loadedResources;

        this.sceneContent = {};
        this.colliders = [];

        this.createCharacters();
        this.createBackground();

        this.renderer = new Renderer(this.sceneContent);
    }

    createCharacters() {
        const mainChar = new Character({
            name: 'main',
            actionTemplate: this.loadedResources.characters['main'],
            behavior: new MainCharBehavior(),
            sceneManager: this,
        });

        this.sceneContent.mainChar = mainChar;

        this.sceneContent.characters = [
            mainChar,
            new Character({
                name: 'z1',
                actionTemplate: this.loadedResources.characters['zombie-1'],
                position: { x: 300, y: 0 },
                behavior: new ZombieBehavior(mainChar),
                sceneManager: this,
            }),
            new Character({
                name: 'z2',
                actionTemplate: this.loadedResources.characters['zombie-2'],
                position: { x: 600, y: 0 },
                behavior: new ZombieBehavior(mainChar),
                sceneManager: this,
            }),
            new Character({
                name: 'z3',
                actionTemplate: this.loadedResources.characters['zombie-3'],
                position: { x: 900, y: 0 },
                behavior: new ZombieBehavior(mainChar),
                sceneManager: this,
            }),
        ];
    }

    createBackground() {
        this.sceneContent.background = {
            img: this.loadedResources.background,
        };
    }

    update() {
        for (const char of this.sceneContent.characters) {
            char.update();
        }

        this.renderer.render(this.sceneContent);

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