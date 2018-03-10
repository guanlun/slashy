import Character from "./Character";
import Renderer from './Renderer';

import ZombieBehavior from './ZombieBehavior';
import MainCharBehavior from './MainCharBehavior';

export default class SceneManager {
    constructor(spriteTemplates) {
        this.spriteTemplates = spriteTemplates;
        this.renderer = new Renderer();

        this.sceneContent = {};
    }

    createCharacters() {
        this.mainChar = new Character({
            name: 'main',
            actionTemplate: this.spriteTemplates['main'].sprites,
            behavior: new MainCharBehavior(),
        });

        this.sceneContent.characters = [
            this.mainChar,
            new Character({
                actionTemplate: this.spriteTemplates['zombie-1'].sprites,
                position: { x: 300, y: 0 },
                behavior: new ZombieBehavior(),
            }),
            new Character({
                actionTemplate: this.spriteTemplates['zombie-2'].sprites,
                position: { x: 600, y: 0 },
                behavior: new ZombieBehavior(),
            }),
            new Character({
                actionTemplate: this.spriteTemplates['zombie-3'].sprites,
                position: { x: 900, y: 0 },
                behavior: new ZombieBehavior(),
            }),
        ];
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
}