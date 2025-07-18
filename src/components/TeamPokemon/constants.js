export const menuOption = {
    FIGHT: 0,
    CATCH: 1,
    RUN: 2,
}
export const FACING = {
    DOWN: 0,
    UP: 1,
    RIGHT: 2,
    LEFT: 3,
}
export const getMenuTextFromId = (id) => {
    return {
        [menuOption.FIGHT]: 'FIGHT',
        [menuOption.CATCH]: 'CATCH',
        [menuOption.RUN]: 'RUN',
    }[id];
}

export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

export const GRASS = 2;
export const OPEN = 0;
export const WALL = 1;

export const MAX_WALK_ANIMATION_COUNT = 16;

export const tiles = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,2,2,2,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,2,2,2,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,2,2,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,2,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,2,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,2,2,0,2,2,2,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 320;

export const TEXTBOX_HEIGHT = 100;
export const TEXTBOX_Y = CANVAS_HEIGHT - TEXTBOX_HEIGHT;
export const TEXT_HEIGHT = 16;
export const TEXTBOX_PADDING = 4;
export const TEXT_START_X = TEXTBOX_PADDING * 4;
export const TEXT_START_Y = TEXTBOX_Y + TEXTBOX_PADDING * 3 + TEXT_HEIGHT;

export const MENU_OPTION_TEXT_HEIGHT = 24;
export const MENU_OPTION_PADDING = 4;
export const MENU_OPTION_WIDTH = (CANVAS_WIDTH - TEXTBOX_PADDING * 8 - MENU_OPTION_PADDING * 2) / 3;
export const MENU_OPTION_START_Y = TEXT_START_Y + TEXT_HEIGHT;
export const MENU_OPTION_HEIGHT = MENU_OPTION_TEXT_HEIGHT + MENU_OPTION_PADDING * 2;

export const STATS_MARGIN = 10;
export const STATS_PADDING = 5;
export const STATS_WIDTH = 200;
export const STATS_HEIGHT = 50;
export const STATS_HEALTH_Y = STATS_MARGIN + STATS_PADDING * 2
export const STATS_NAME_TEXT_HEIGHT = 16;
export const STATS_NAME_X = STATS_MARGIN + STATS_PADDING * 2 
export const STATS_NAME_Y = STATS_HEALTH_Y + STATS_NAME_TEXT_HEIGHT - 5; 
export const HEALTH_BAR_WIDTH = 125;
