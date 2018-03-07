import Action from './Action';

const SPRITE_DIR = '../images/sprites';

export function loadCharacterSprites(characterName, characterSpec) {
    return Promise.all(
        Object.keys(characterSpec).map(actionName => 
            new Promise((resolve, reject) => {
                const actionSpec = characterSpec[actionName];
                
                loadActionSprites(characterName, actionName, actionSpec).then(sprites => {
                    resolve(new Action(characterName, actionName, actionSpec, sprites));
                });
            })
        )
    ).then(loadedActions => {
        // convert loaded action array to object with action name as keys
        const actionMap = {};
        for (const action of loadedActions) {
            actionMap[action.actionName] = action;
        }

        return actionMap;
    });
}

function loadActionSprites(characterName, actionName, actionSpec) {
    const action = new Action(characterName, actionName, actionSpec);
    const baseName = actionName.charAt(0).toUpperCase() + actionName.slice(1);
    const sprites = [];

    for (let i = 0; i < actionSpec.length; i++) {
        sprites.push({
            action: actionName,
            frameIdx: i,
            filePath: `${SPRITE_DIR}/${characterName}/${baseName}/${baseName}_${leftPadZero3(i)}.png`,
        });
    }

    return Promise.all(
        sprites.map(sprite => 
            new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = data => {
                    sprite.img = img;
                    resolve(sprite);
                }
                img.src = sprite.filePath;
            })
        )
    );
}

function leftPadZero3(num) {
    const numStr = num + '';
    if (numStr.length === 3) {
        return numStr;
    } else if (numStr.length === 2) {
        return `0${numStr}`;
    } else if (numStr.length === 1) {
        return `00${numStr}`;
    } else {
        return numStr;
    }
}
