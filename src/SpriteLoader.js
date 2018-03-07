import Action from './Action';

export default class SpriteLoader {
    constructor(spriteSpec) {
        this.spriteSpec = spriteSpec;
        this.actions = [];
    }

    loadSprites(characterName) {
        // console.log(this.spriteSpec)
        return Promise.all(
            Object.keys(this.spriteSpec).map(actionName => 
                new Promise((resolve, reject) => {
                    const actionSpec = this.spriteSpec[actionName];
                    const action = new Action(characterName, actionName, actionSpec);
                    action.loadSprite().then(() => {
                        this.actions[actionName] = action;
                        resolve();
                    });
                })
            )
        )
    }
}