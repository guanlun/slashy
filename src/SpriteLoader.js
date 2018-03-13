const SPRITE_DIR = '../images/sprites';
const BG_DIR = '../images/bg';

export function loadResources({ characters, background }) {
    const loadedResources = {};

    return Promise.all([
        loadAllCharacterSprites(characters),
        loadBackground(background),
    ]).then(resources => {
        for (const res of resources) {
            loadedResources[res.type] = res.data;
        }

        return loadedResources;
    });
}

function loadAllCharacterSprites(characters) {
    return Promise.all(
        Object.keys(characters).map(
            name => loadCharacterSprites(name, characters[name].actionSpec)
        )
    ).then(characterSprites => {
        const characterSpriteMap = {};

        for (const char of characterSprites) {
            characterSpriteMap[char.characterName] = char.sprites;
        }

        return characterSpriteMap;
    }).then(data => ({ type: 'characters', data }));
}

function loadCharacterSprites(characterName, characterSpec) {
    return Promise.all(
        Object.keys(characterSpec).map(actionName =>
            new Promise((resolve, reject) => {
                const actionSpec = characterSpec[actionName];

                loadActionSprites(characterName, actionName, actionSpec).then(sprites => {
                    resolve({ actionName, sprites });
                });
            })
        )
    ).then(loadedActions => {
        // convert loaded action array to object with action name as keys
        const actionMap = {};
        for (const action of loadedActions) {
            actionMap[action.actionName] = action.sprites;
        }

        return {
            characterName,
            sprites: actionMap,
        };
    });
}

function loadBackground(imgSrc) {
    return loadImage(`${BG_DIR}/${imgSrc}.png`)
        .then(data => ({ type: 'background', data }));
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = data => {
            resolve(img);
        }
        img.src = src;
    })
}

function loadActionSprites(characterName, actionName, actionSpec) {
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
        sprites.map(sprite => loadImage(sprite.filePath)
            .then(img => sprite.img = img)
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
