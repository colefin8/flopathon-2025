import BattleBackground from './assets/BattleBackground.png';
import { CANVAS_HEIGHT, CANVAS_WIDTH, FACING, getMenuTextFromId, getRandomInt, GRASS, HEALTH_BAR_WIDTH, MAX_WALK_ANIMATION_COUNT, MENU_OPTION_HEIGHT, MENU_OPTION_PADDING, MENU_OPTION_START_Y, MENU_OPTION_TEXT_HEIGHT, MENU_OPTION_WIDTH, menuOption, STATS_HEALTH_Y, STATS_HEIGHT, STATS_MARGIN, STATS_NAME_TEXT_HEIGHT, STATS_NAME_X, STATS_NAME_Y, STATS_PADDING, STATS_WIDTH, TEXT_HEIGHT, TEXT_START_X, TEXT_START_Y, TEXTBOX_HEIGHT, TEXTBOX_PADDING, TEXTBOX_Y } from './constants';
const battleBackgroundImage = new Image();
battleBackgroundImage.src = BattleBackground;

import Map from './assets/TinyMap.png';
const mapImage = new Image();
mapImage.src = Map;

import Character from './assets/CharacterSprites.png';
const characterImage = new Image();
characterImage.src = Character;

import BattleCharacter from './assets/BattleCharacterSprite.png';
const battleCharacterImage = new Image();
battleCharacterImage.src = BattleCharacter;

import GrassFront from './assets/GrassFront.png';
const grassFrontImage = new Image();
grassFrontImage.src = GrassFront;

export const drawGame = (canvas, gameState) => {
    if (!canvas || !gameState) {
        console.log({canvas, gameState})
        console.error('Missing canvas or game state');
        return;
    };
    canvas.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    if (gameState.battleOpen) {
        drawBattleBackground(canvas)
        drawBattleCharacter(canvas);
        drawTextBox(canvas);
        drawOpponentStats(canvas, gameState);
        drawOpponent(canvas, gameState);
    }
    else {
        drawMap(canvas, gameState)
        drawCharacter(canvas, gameState)
    }
}

const TILE_WIDTH = 80;
const drawMap = (canvas, gameState) => {
    let offsetX = 0;
    let offsetY = 0;
    if (gameState.walkAnimationCount > 0) {
        const offsetPixelAmount = gameState.walkAnimationCount / MAX_WALK_ANIMATION_COUNT * TILE_WIDTH;
        if (gameState.facing === FACING.LEFT) {
            offsetX += offsetPixelAmount;
        }
        if (gameState.facing === FACING.RIGHT) {
            offsetX -= offsetPixelAmount;
        }
        if (gameState.facing === FACING.UP) {
            offsetY += offsetPixelAmount;
        }
        if (gameState.facing === FACING.DOWN) {
            offsetY -= offsetPixelAmount;
        }
    }
    drawClippedImageOnCanvas({
        canvas,
        image: mapImage,
        clipStartX: (gameState.position[1] - 5) * TILE_WIDTH + offsetX,
        clipStartY: (gameState.position[0] - 5) * TILE_WIDTH + offsetY,
        clipWidth: CANVAS_WIDTH * 2, clipHeight: CANVAS_HEIGHT * 2,
        canvasX: 0, canvasY: 0,
        canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT,
    });
}


const BASE_CLIP_CHARACTER_X = 5; 
const BASE_CLIP_CHARACTER_Y = 8;
const CLIP_OFFSET = 17.5;
const getClipOffsetFromState = (gameState) => {
    const isStepSprite = (gameState.walkAnimationCount > MAX_WALK_ANIMATION_COUNT / 2) ? 1 : 0;
    const isLeftStep = isStepSprite && gameState.alternateStep ? 1 : 0;
    const offset = 3 * gameState.facing + isLeftStep + isStepSprite
    return offset;
}
const drawCharacter = (canvas, gameState) => {
    const canvasDim = TILE_WIDTH / 1.8;
    drawClippedImageOnCanvas({
        canvas,
        image: characterImage,
        clipStartX: BASE_CLIP_CHARACTER_X + CLIP_OFFSET * getClipOffsetFromState(gameState),
        clipStartY: 8,
        clipWidth: 20, clipHeight: 30,
        canvasX: CANVAS_WIDTH / 2 - 2, canvasY: CANVAS_HEIGHT / 2 - 10,
        canvasWidth: canvasDim, canvasHeight: canvasDim * 1.5,
    });
    if (gameState.walkAnimationCount === 0 && gameState.getCurrentTileValue() === GRASS) {
        drawGrass(canvas);
    }
}

const drawBattleCharacter = (canvas) => {
    const dim = 120;
    drawFullImageOnCanvas({
        canvas,
        image: battleCharacterImage,
        x: 50, y: TEXTBOX_Y - dim + 2,
        width: dim, height: dim,
    });
}

const drawGrass = (canvas) => {
    drawFullImageOnCanvas({
        canvas,
        image: grassFrontImage,
        x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2,
        width: TILE_WIDTH / 2, height: TILE_WIDTH / 2,
    });
}

const drawOpponent = (canvas, gameState) => {
    const dim = 100;
    drawFullImageOnCanvas({
        canvas,
        image: gameState.opponentPokemon.getImage(),
        x: 310, y: 30,
        width: dim, height: dim,
    })
}

const drawOpponentStats = (canvas, gameState) => {
    canvas.fillStyle = '#990000';
    canvas.fillRect(
        STATS_MARGIN,
        STATS_MARGIN,
        STATS_WIDTH,
        STATS_HEIGHT
    );
    canvas.fillStyle = '#264d63';
    canvas.fillRect(
        STATS_MARGIN + STATS_PADDING,
        STATS_MARGIN + STATS_PADDING,
        STATS_WIDTH - STATS_PADDING * 2,
        STATS_HEIGHT - STATS_PADDING * 2
    );
    canvas.fillStyle = 'white';
    canvas.font = `${STATS_NAME_TEXT_HEIGHT}px monospace`
    canvas.fillText(
        `${gameState.opponentPokemon.getName()}`,
        STATS_NAME_X, STATS_NAME_Y, STATS_WIDTH
    );
    canvas.font = `${STATS_NAME_TEXT_HEIGHT - 5}px monospace`
    const oppHealth = Math.max(0, gameState.opponentHealth)
    canvas.fillText(
        `${oppHealth}/100`,
        STATS_NAME_X, STATS_NAME_Y + 20, STATS_WIDTH
    );
    canvas.fillRect(
        STATS_NAME_X + 50, STATS_NAME_Y + 10,
        HEALTH_BAR_WIDTH, 10
    );
    canvas.fillStyle = getHealthBarColor(gameState.opponentHealth);
    canvas.fillRect(
        STATS_NAME_X + 50, STATS_NAME_Y + 10,
        HEALTH_BAR_WIDTH * oppHealth / 100, 10
    );
    
} 
const getHealthBarColor = (amount) => {
    if (amount > 50) return 'green';
    if (amount > 20) return 'yellow';
    return 'red';
}

const drawBattleBackground = (canvas) => {
    drawFullImageOnCanvas({
        canvas,
        image: battleBackgroundImage,
        x: 0, y: 0,
        width: CANVAS_WIDTH, height: TEXTBOX_Y,
    });
}

export const drawTextInTextBox = (canvas, text) => {
    canvas.font = `${TEXT_HEIGHT}px monospace`;
    canvas.fillStyle = 'white';
    canvas.fillText(
        text,
        TEXT_START_X,
        TEXT_START_Y,
        CANVAS_WIDTH - TEXTBOX_PADDING * 6
    )
}

export const drawFade = (canvas, opacity, shade = 0) => {
    canvas.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${opacity})`;
    canvas.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}

export const drawMenuOptions = (canvas, currentMenuOption) => {
    const menuOffsetX = MENU_OPTION_WIDTH + MENU_OPTION_PADDING;
    canvas.font = `${MENU_OPTION_TEXT_HEIGHT}px monospace`;
    canvas.fillStyle = 'white';
    Object.values(menuOption).forEach((optionId, index) => {
        canvas.fillText(
            getMenuTextFromId(optionId),
            TEXT_START_X + menuOffsetX * index + MENU_OPTION_PADDING,
            MENU_OPTION_START_Y + MENU_OPTION_PADDING + MENU_OPTION_TEXT_HEIGHT - 4,
            CANVAS_WIDTH,
        );
        if (index === currentMenuOption) {
            canvas.strokeWidth = '2px'
            canvas.strokeStyle = 'white'
            canvas.beginPath();
            canvas.rect(
                TEXT_START_X + menuOffsetX * index,
                MENU_OPTION_START_Y,
                MENU_OPTION_WIDTH,
                MENU_OPTION_HEIGHT
            );
            canvas.stroke();
        }
    })
}

const drawTextBox = (canvas) => {
    canvas.fillStyle = '#333';
    canvas.fillRect(0,TEXTBOX_Y,CANVAS_WIDTH,TEXTBOX_HEIGHT);
    canvas.fillStyle = '#baa464';
    canvas.fillRect(
        TEXTBOX_PADDING,
        TEXTBOX_Y + TEXTBOX_PADDING,
        CANVAS_WIDTH - TEXTBOX_PADDING * 2,
        TEXTBOX_HEIGHT - TEXTBOX_PADDING * 2
    );
    canvas.fillStyle = '#264d63';
    canvas.fillRect(
        TEXTBOX_PADDING * 2,
        TEXTBOX_Y + TEXTBOX_PADDING * 2,
        CANVAS_WIDTH - TEXTBOX_PADDING * 4,
        TEXTBOX_HEIGHT - TEXTBOX_PADDING * 4
    );
}

const drawFullImageOnCanvas = ({
    canvas,
    image,
    x,
    y,
    width,
    height,
}) => canvas.drawImage(image,x,y,width,height);   


const drawClippedImageOnCanvas = ({
    canvas,
    image,
    clipStartX,
    clipStartY,
    clipWidth,
    clipHeight,
    canvasX,
    canvasY,
    canvasWidth,
    canvasHeight
}) => canvas.drawImage(image,clipStartX,clipStartY,clipWidth,clipHeight,canvasX,canvasY,canvasWidth,canvasHeight);