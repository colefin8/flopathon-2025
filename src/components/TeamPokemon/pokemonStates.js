import { GRASS, tiles, menuOption, WALL, getRandomInt, MAX_WALK_ANIMATION_COUNT, FACING } from "./constants";
import { drawFade, drawMenuOptions, drawTextInTextBox } from "./drawGame";
import { getRandomPokemon } from "./pokemon";

export class DecisionState {
    constructor(gameState) {
        if (!gameState) {
            console.error('Missing Game State')
        }
        this.gameState = gameState;
    }
    getNewStateFromInput(key) {
        // no state change by default
        return this;
    }
    nonStateChangeInput(key) {}
    idleTick() {}
    drawDecisionState(canvas) {}
}

const MAX_FADE_COUNT = 100;
const FADE_HALF = MAX_FADE_COUNT / 2;
export class Fade extends DecisionState {
    constructor(gameState) {
        super(gameState);
        this.fadeCount = MAX_FADE_COUNT;
    }
    idleTick() {
        this.fadeCount -= 1;
        if (this.fadeCount == FADE_HALF) {
            this.onFade();
        }
        else if (this.fadeCount <= 0) {
            return this.onFadeComplete();
        }
    }
    onFade() {}
    onFadeComplete() { return this; }
    drawDecisionState(canvas) {
        const opacity = 1 - Math.abs(this.fadeCount - FADE_HALF) / FADE_HALF;
        drawFade(canvas, opacity);
    }
}



export class OverWorld extends DecisionState {
    constructor(gameState) {
        super(gameState);
        this.grassTilesUntilEncounter = getRandomInt(2,10);
    }
    getNewStateFromInput(key) {
        if (key === 'b') {
            this.gameState.playerMovementIsLocked = true;
            this.gameState.currentMenuOption = menuOption.FIGHT;
            return new TriggerBattle(this.gameState);
        }
    }
    nonStateChangeInput(key) {
        if (this.isMoving()) return;
        if (!['ArrowLeft','ArrowRight','ArrowDown','ArrowUp'].includes(key)) return;
        const newPosition = [...this.gameState.position];
        switch(key) {
            case 'ArrowLeft': {
                newPosition[1] -= 1;
                this.gameState.facing = FACING.LEFT;
                break;
            }
            case 'ArrowRight': {
                newPosition[1] += 1;
                this.gameState.facing = FACING.RIGHT;
                break;
            }
            case 'ArrowDown': {
                newPosition[0] += 1;
                this.gameState.facing = FACING.DOWN;
                break;
            }
            case 'ArrowUp': {
                newPosition[0] -= 1;
                this.gameState.facing = FACING.UP;
                break;
            }
        }
        if (tiles[newPosition[0]][newPosition[1]] === WALL) {
            return;
        } else {
            this.gameState.position = newPosition;
            this.gameState.walkAnimationCount = MAX_WALK_ANIMATION_COUNT;
        }
        this.gameState.alternateStep = !this.gameState.alternateStep; 
        if (this.gameState.getCurrentTileValue() == GRASS) {
            this.grassTilesUntilEncounter -= 1;
        }
    }
    isMoving() {
        return this.gameState.walkAnimationCount > 0;
    }
    idleTick() {
        if (this.isMoving()) {
            this.gameState.walkAnimationCount -= 1;
        }
        if (this.grassTilesUntilEncounter <= 0 && !this.isMoving()) {
            return new TriggerBattle(this.gameState);
        }
    }
}

const MAX_TRIGGER_COUNT = 48;
export class TriggerBattle extends DecisionState {
    constructor(gameState) {
        super(gameState);
        this.animationCount = MAX_TRIGGER_COUNT;
    }
    idleTick() {
        this.animationCount -= 1;
        if (this.animationCount <= 0) {
            return new FadeToBattle(this.gameState);
        }
    }
    drawDecisionState(canvas) {
        const opacity = (1 - Math.cos(this.animationCount / MAX_TRIGGER_COUNT * Math.PI * 4)) / 2;
        drawFade(canvas, opacity, 70);
    }
}

export class FadeToBattle extends Fade {
    onFade() {
        this.gameState.battleOpen = true;
        this.gameState.opponentHealth = 100;
        this.gameState.opponentPokemon = getRandomPokemon();
    }
    onFadeComplete() {
        return new Menu(this.gameState);
    }
}

export class Menu extends DecisionState {
    constructor(gameState) {
        super(gameState);
    }
    nonStateChangeInput(key) {
        const MAX_OPTIONS = Object.keys(menuOption).length;
        if (key === 'ArrowRight') {
            this.gameState.currentMenuOption = (this.gameState.currentMenuOption + 1) % MAX_OPTIONS;
        }
        else if (key === 'ArrowLeft') {
            this.gameState.currentMenuOption = (this.gameState.currentMenuOption - 1);
            if (this.gameState.currentMenuOption < 0) this.gameState.currentMenuOption = MAX_OPTIONS - 1;
        }
    }
    getNewStateFromInput(key) {
        if (key === ' ') {
            if (this.gameState.currentMenuOption == menuOption.CATCH) {
                return new Catching(this.gameState);
            }
            if (this.gameState.currentMenuOption == menuOption.FIGHT) {
                return new Attacking(this.gameState);
            }
            if (this.gameState.currentMenuOption == menuOption.RUN) {
                return new RunMessage(this.gameState);
            }
        }
    }
    drawDecisionState(canvas) {
        drawTextInTextBox(canvas, 'What will you do?');
        drawMenuOptions(canvas, this.gameState.currentMenuOption);
    }
}

export class Catching extends DecisionState {
    constructor(gameState) {
        super(gameState);
        this.animationCount = 30;
    }
    idleTick() {
        this.animationCount -= 1;
        if (this.animationCount <= 0) {
            this.gameState.currentVolume = this.gameState.opponentHealth;
            return new CatchMessage(this.gameState);
        }
    }
}


export class DisplayMessage extends DecisionState {
    constructor(gameState, message) {
        super(gameState);
        this.message = message;
        this.slideIndex = 0;
    }
    idleTick() {
        if (this.slideIndex < this.message.length) {
            this.slideIndex += 1;
        }
    }
    drawDecisionState(canvas) {
        drawTextInTextBox(canvas, this.message.slice(0, this.slideIndex));
    }
}

const moveNames = [
    'Tackle',
    'Thunderbolt',
    'Flamethrower',
    'Water Gun',
    'Vine Whip',
    'Slash',
];
const getRandomMoveName = () => {
    return moveNames[getRandomInt(0,moveNames.length)];
}

export class Attacking extends DisplayMessage {
    constructor(gameState) {
        super(gameState, `You used ${getRandomMoveName()}!`);
    }
    getNewStateFromInput(key) {
        if (key === ' ') {
            const damage = getRandomInt(5,50);
            this.gameState.opponentHealth -= damage;
            return new AttackMessage(this.gameState, damage);
        }
    }
}

export class CatchMessage extends DisplayMessage {
    constructor(gameState) {
        super(gameState, `You caught ${gameState.opponentPokemon.getName()}!`);
    }
    getNewStateFromInput(key) {
        if (key === ' ') {
            return new VolumeMessage(this.gameState);
        }
    }
}
export class VolumeMessage extends DisplayMessage {
    constructor(gameState) {
        super(gameState, `Your volume has been set to ${gameState.opponentHealth}%!`);
    }
    getNewStateFromInput(key) {
        if (key === ' ') {
            return new FadeToOverWorld(this.gameState);
        }
    }
}

export class AttackMessage extends DisplayMessage {
    constructor(gameState, damageAmount) {
        const message = damageAmount > 40 ? `It's super effective!` : damageAmount > 20 ? 'Nice move!' : `It's not very effective...` 
        super(gameState, message);
    }
    getNewStateFromInput(key) {
        if (key === ' ') {
            if (this.gameState.opponentHealth <= 0) {
                return new FaintMessage(this.gameState);
            }
            return new Menu(this.gameState);
        }
    }
}

export class FaintMessage extends DisplayMessage {
    constructor(gameState) {
        super(gameState, `${gameState.opponentPokemon.getName()} Fainted!`);
    }
    getNewStateFromInput(key) {
        if (key === ' ') {
            return new FadeToOverWorld(this.gameState);
        }
    }
}

export class RunMessage extends DisplayMessage {
    constructor(gameState) {
        super(gameState, 'Ran away safely...');
    }
    getNewStateFromInput(key) {
        if (key === ' ') {
            return new FadeToOverWorld(this.gameState);
        }
    }
}

export class FadeToOverWorld extends Fade {
    onFade() {
        this.gameState.battleOpen = false;
    }
    onFadeComplete() {
        this.gameState.playerMovementIsLocked = false;
        return new OverWorld(this.gameState);
    }
}