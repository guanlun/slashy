let gameStarted = true//false;
let heroMaxHP = 0;
let heroHP = 0;

export function startGame() {
    gameStarted = true;
}

export function isGameStarted() {
    return gameStarted;
}

export function setHeroMaxHP(maxHP) {
    heroMaxHP = maxHP;
}

export function getHeroMaxHP() {
    return heroMaxHP;
}

export function setHeroHP(hp) {
    heroHP = hp;
}

export function getHeroHP() {
    return heroHP;
}

