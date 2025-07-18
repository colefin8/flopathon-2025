<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { OverWorld } from './TeamPokemon/pokemonStates';
import { FACING, getMenuTextFromId, menuOption, tiles } from './TeamPokemon/constants';
import { drawGame } from './TeamPokemon/drawGame';

class GameState {
    constructor() {
        this.currentVolume = 100;
        this.opponentPokemon;
        this.opponentHealth = 100;
        this.position = [9,12];
        this.opponent = 1;
        this.battleOpen = false;
        this.playerMovementIsLocked = false;
        this.currentMenuOption = menuOption.FIGHT
        this.walkAnimationCount = 0;
        this.facing = FACING.DOWN;
        this.alternateStep = false;
    }
    getCurrentTileValue() {
        const rowIndex = this.position[0];
        const colIndex = this.position[1];
        return tiles[rowIndex][colIndex];
    }
}

const gameState = ref(new GameState());
const currentState = ref(new OverWorld(gameState.value));

const handleInput = (event) => {
    if ([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
    }
    const state = currentState.value;
    state.nonStateChangeInput(event.key);
    const newState = state.getNewStateFromInput(event.key);
    if (newState) {
        currentState.value = newState;
    }
}

const tick = () => {
    const newStateFromIdleTick = currentState.value.idleTick();
    if (newStateFromIdleTick) {
        currentState.value = newStateFromIdleTick;
    }
    requestAnimationFrame(tick);
    drawGame(canvasContext.value, gameState.value);
    currentState.value.drawDecisionState(canvasContext.value);
}

const canvasContext = ref(null);
const initialize = () => {
    const _canvas = document.getElementById('canvas');
    canvasContext.value = _canvas.getContext('2d');
}

onMounted(() => {
    addEventListener('keydown', handleInput)
    initialize();
    tick();
});
onUnmounted(() => {
    removeEventListener('keydown', handleInput);
})

const onButtonPress = (key) => {
    handleInput({ key, preventDefault: () => {} });
}

const currentStateObject = computed(() => {
    return currentState.value.constructor.name;
})

const getMenuOptionText = computed(() => getMenuTextFromId(gameState.value.currentMenuOption));

const isCurrentTile = (row, col) =>{
    return (row === gameState.value.position[0]) && (col === gameState.value.position[1]);
}

</script>

<template>
    <div class="wrapper">
        <div>{{ `Current Volume: ${gameState.currentVolume}%` }}</div>
        <canvas id="canvas" height="320" width="480"></canvas>
        <div class="buttons">
            <button id="left" @click="onButtonPress('ArrowLeft')">Left</button>
            <button id="up" @click="onButtonPress('ArrowUp')">Up</button>
            <button id="down" @click="onButtonPress('ArrowDown')">Down</button>
            <button id="right" @click="onButtonPress('ArrowRight')">Right</button>
            <button id="space" @click="onButtonPress(' ')">Space</button>
        </div>
    </div>
</template>

<style scoped>

@media (max-width: 700px) {
    
    canvas {
        transform: scale(.8);
    }
}

#canvas {
    border: solid 1px black;
}

.tiles {
    display: flex;
    flex-direction: column;
}
.tile-row {
    display: flex;
}
.tile {
    height: 10px;
    width: 10px;
    background-color: gray;
    margin: 1px;
}
.tile-current {
    background-color: red;
}
.tile-grass {
    background-color: green;
}
.tile-wall {
    background-color: black;
}

.buttons {
    margin: 4px;
    display: flex;
    gap: 8px;
}

.buttons button {
    padding: 4px;
}

.wrapper {
    padding: 40px 20px;
}
</style>
