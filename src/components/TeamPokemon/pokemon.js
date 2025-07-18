class Pokemon {
    constructor() {
        this.image = new Image();
        this.setImageSrc();
    }
    setImageSrc() {}
    getName() {}
    getImage() {
        return this.image;
    }
}

import PikachuSrc from './assets/pikachu.png';
export class Pikachu extends Pokemon {
    constructor() {
        super();
    }
    setImageSrc() {
        this.image.src = PikachuSrc;
    }
    getName() { return 'Pikachu'; }
}

import BulbasaurSrc from './assets/Bulbasaur.png';
export class Bulbasaur extends Pokemon {
    constructor() {
        super();
    }
    setImageSrc() {
        this.image.src = BulbasaurSrc;
    }
    getName() { return 'Bulbasaur'; }
}

import CharmanderSrc from './assets/Charmander.png';
export class Charmander extends Pokemon {
    constructor() {
        super();
    }
    setImageSrc() {
        this.image.src = CharmanderSrc;
    }
    getName() { return 'Charmander'; }
}

import SquirtleSrc from './assets/Squirtle.png';
import { getRandomInt } from './constants';
export class Squirtle extends Pokemon {
    constructor() {
        super();
    }
    setImageSrc() {
        this.image.src = SquirtleSrc;
    }
    getName() { return 'Squirtle'; }
}

export const getRandomPokemon = () => {
    const randomIndex = getRandomInt(0,4);
    return [
        new Pikachu(),
        new Bulbasaur(),
        new Charmander(),
        new Squirtle(),
    ][randomIndex];
}