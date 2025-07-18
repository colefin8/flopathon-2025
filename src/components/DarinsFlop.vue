<template>
    <div class="darins-flop" @click="playSound">

        <div class="marquee">
            <div class="marquee-text">The Best Volume Control in the World!!!</div>
        </div>

        <div class="hampsters">
            <template v-for="k in 99" :key="k">
                <template v-for="i in 4" :key="i">
                    <template v-for="j in 4" :key="j">
                        <img :src="`https://www.webhamster.com/${i}.gif`">
                    </template>
                </template>
            </template>
            <audio ref="audio" src="https://www.webhamster.com/webhamster.wav" autoplay="yes" loop controls />
        </div>

        <div class="input-container">
            <h1>Hamster Dance Volume Control</h1>
            <label>Enter the volume in {{ units[selectedUnit] }}:</label>
            <div class="input-wrapper">
                <input type="text" v-model="volumeInput" readonly placeholder="Volume" />
                <b class="clear-button" @click="clearInput">&times;</b>
            </div>

            <div class="rotary-dial-container">
                <canvas id="digits" v-show="showDigits"></canvas>
                <canvas id="octal" v-show="showOctal"></canvas>
                <canvas id="roman" v-show="showRoman"></canvas>
                <canvas id="letters" v-show="showLetters"></canvas>
            </div>

            <div class="button-container">
                <button @click="calculate">Submit</button>
            </div>
        </div>

        <div class="ad-container">
            <img src="https://matduggan.com/content/images/2024/05/image-1.png" alt="Mat Duggan's Blog" />
        </div>

        <div class="counter">
            <img src="https://arngren.net/guarantee_02.gif" />
            <img src="http://srv14.jnetstation.com/jcount/Count.cgi?dd=A&md=8&df=seiryu-kan.com" />
        </div>

        <dialog v-show="volumeOutput" ref="dialog" open>
            <p>{{ volumeOutput }}</p>
            <div class="button-container">
                <button ref="trick-button" @mouseover="moveToRandomPosition" @click="volumeOutput = ''">Close</button>
            </div>
        </dialog>
    </div>
</template>

<script setup>

import { computed, onMounted, ref, useTemplateRef } from 'vue';

class RotaryDial {

	constructor({ callback, canvas, digits } = {}) {
        this.canvas = canvas;
		this.canvasSize = 300;
        this.bigSize = 375;
		this.size = this.canvasSize-2;
		this.discFillColor = 'black';
		this.discStrokeColor = 'white';
		this.circlesFillColor = 'white';
		this.circlesStrokeColor = 'black';
		this.circlesHighlightColor = 'red';
		this.textFillColor = 'white';
		this.textStrokeColor = 'silver';
		this.arrowFillColor = 'silver';
		this.arrowStrokeColor = 'black';
		this.canvas.width = this.w = this.bigSize;
		this.canvas.height = this.h = this.bigSize;
		this.w2 = this.bigSize / 2;
		this.h2 = this.bigSize / 2;
        this.arrowH = this.bigSize * .65
		this.TAU = Math.PI * 2;
		this.offset = this.size * 0.25;
        this.borderCircle = (this.bigSize - 2)/2;
        this.outerCircle = this.size/2;
		this.innerCircle = this.outerCircle-this.offset;
		this.c = this.canvas.getContext('2d');
		this.c.font = `${this.size * 0.08}px monospace`;
		this.c.textAlign = "center";
		this.a = 1;
		this.clicking = false;
		this.number = null;
		this.callback = callback || console.log;
        this.digits = (digits || '0123456789').split('');
		this.draw();
		this.addEvent();
	}
	draw() {
		this.c.clearRect(0,0,this.w,this.h);
        this.c.lineWidth = this.size * 0.01;
		this.c.beginPath();
		this.c.arc(this.w2, this.h2, this.borderCircle, 0, this.TAU, true);
		this.c.arc(this.w2, this.h2, this.outerCircle, 0, this.TAU, false);
		this.c.moveTo(this.w2+this.innerCircle, this.h2 );
		this.c.arc(this.w2, this.h2, this.innerCircle, this.TAU, 0, true);
		this.c.strokeStyle = this.discStrokeColor;
		this.c.stroke();
		this.c.fillStyle = this.discFillColor;
		this.c.fill();
		this.c.save();
		this.c.translate(this.w2, this.h2);
        this.c.lineWidth = 1;
		for (let i = 0; i < 10; i++) {
			const a = this.a+i/2+.5;
            const a2 = 1+i/2+.5;
            const center = this.innerCircle + (this.outerCircle-this.innerCircle)/2;
            const center2 = this.outerCircle + (this.borderCircle-this.outerCircle)/3;
            const x = Math.cos(a)*center;
            const y = Math.sin(a)*center;
            const x2 = Math.cos(a2)*center2;
            const y2 = Math.sin(a2)*center2;
            const n = (10-i)%10;
            const digit = this.digits[n]
            if (digit) {
                this.c.beginPath();
                this.c.arc(x, y, this.size * 0.08, 0, this.TAU);
                this.c.fillStyle = this.circlesFillColor;
                this.c.strokeStyle = this.circlesStrokeColor;
                this.c.fill();
                this.c.stroke();

                this.c.arc(x, y, this.size * 0.02, 0, this.TAU, true);
                this.c.fillStyle = this.circlesStrokeColor;
                this.c.fill();

                this.c.fillStyle = this.textFillColor;
                this.c.strokeStyle = this.textStrokeColor;
                this.c.strokeText(digit, x2, y2+this.size * 0.02);
                this.c.fillText(digit, x2, y2+this.size * 0.02);
            }
        }
		this.c.restore();
		this.c.beginPath()
		this.c.moveTo(this.w - this.size * 0.315 - this.offset/2, this.arrowH);
        this.c.quadraticCurveTo(this.w - this.offset/2, this.arrowH - this.size * 0.001, this.w - this.offset/2, this.arrowH - this.size * 0.04);
		this.c.lineTo(this.w - this.offset/2, this.arrowH + this.size * 0.04);
		this.c.closePath();
		this.c.fillStyle = this.arrowFillColor;
		this.c.strokeStyle = this.arrowStrokeColor;
		this.c.fill();
		this.c.stroke();
	}
	addEvent() {
		this.canvas.addEventListener('mousedown', e => { this.isClicking(e) });
		this.canvas.addEventListener('mouseup', _ => { this.result() });
		this.canvas.addEventListener('mouseout', _ => { this.clear() });
		this.canvas.addEventListener('mousemove', e => { this.rotate(e) });
		this.canvas.addEventListener('touchstart', e =>{ this.isClicking(e) });
		this.canvas.addEventListener('touchmove', e =>{ this.rotate(e) });
		this.canvas.addEventListener('touchend', _ => { this.result() });
	}
	result() {
		if (this.number) {
			this.callback(this.digits[this.number%10]);
        }
		this.clear()
	}
	isClicking(e) {
		e.preventDefault()
		const pos = this.getPos(e);
		const dist = this.getDist(pos.x, pos.y, this.w2, this.h2)
        if (dist > this.size/2 || dist < this.size/2-this.offset) {
		    return;
        }
		this.lastAngle = Math.atan2(pos.y - this.h2, pos.x - this.w2);
		this.number = null;
		this.clicking = true;
	}
	getDist(x1, y1, x2, y2) {
		return Math.sqrt((x2-x1) ** 2 + (y2-y1) ** 2);
	}
	getPos(e){
		e.preventDefault();
		let x, y;
		const rect = this.canvas.getBoundingClientRect();
		const _x = this.canvas.width/rect.width;
		const _y = this.canvas.height/rect.height;
		if (e.touches) {
			x = (e.targetTouches[0].pageX - rect.left) * _x;
			y = (e.targetTouches[0].pageY - rect.top) *_y;
		} else {
			x = e.offsetX * _x;
			y = e.offsetY * _y;
		}
		return {x, y};
	}
	clear() {
		this.number = null;
		this.clicking = false;
		this.goBack();
	}
	rotate(e) {
		if (!this.clicking || this.a >= this.TAU) {
            return;
        }
		if (this.a < 1) {
			this.a = 1;
			return;
		}
		const pos = this.getPos(e);
		const dist = this.getDist(pos.x, pos.y, this.w2, this.h2)
		if (dist > this.size/2 || dist < this.size/2-this.offset) {
			this.clear()
			return
		}
        const n = Math.floor((this.a-1.1) / (this.TAU-0.8) * 11);
		this.number = n > 0 ? n : null;
		this.newAngle = Math.atan2( pos.y - this.h2, pos.x - this.w2 );
	    const delta = (this.a - (this.lastAngle - this.newAngle));
		this.a = delta > 0 ? delta : this.TAU+delta;
		this.lastAngle = this.newAngle;
		this.draw();
	}
	goBack() {
		if (this.a > 1) {
			this.a -= 0.1
			this.draw();
			requestAnimationFrame( _=>{ this.goBack() } );
			if (this.a - 1 < 0.05) {
				this.a = 1;
            }
		}
	}
}

const input = ref('');

onMounted(() => {
	const func = function(value) {
		volumeInput.value = `${volumeInput.value}${value}`;
	}
	new RotaryDial({ callback: func, canvas: document.querySelector('#digits') });
    new RotaryDial({ callback: func, canvas: document.querySelector('#octal'), digits: '012345678o' });
    new RotaryDial({ callback: func, canvas: document.querySelector('#roman'), digits: '_CDILMVX' });
    new RotaryDial({ callback: func, canvas: document.querySelector('#letters'), digits: '#FEDCBA' });

    audio.value = document.querySelector('audio');
    setControls();
});

const trickButton = useTemplateRef('trick-button');
let audio;

const moveToRandomPosition = () => {
    if (trickButton.value) {
        trickButton.value.style.position = 'absolute';
        trickButton.value.style.left = `${Math.random() * 50}vw`;
        trickButton.value.style.top = `${Math.random() * 50}vh`;
        trickButton.value.style.transition = 'left 0.5s, top 0.5s';
    }
};

const playSound = () => {
    audio.play();
};

const showDigits = ref(false);
const showOctal = ref(true);
const showRoman = ref(false);
const showLetters = ref(false);

const volumeInput = ref('');
const volumeOutput = ref('');
const units = {
    octal: 'Octal',
    romanNumerals: 'Roman Numerals',
    hexadecimal: 'Hexadecimal',
    binary: 'Binary',
    tallyMarks: 'Tally Marks',
    //scientificNotation: 'Scientific Notation',
};

const selectedUnitIndex = ref(0);

const selectedUnit = computed(() => {
    return Object.keys(units)[selectedUnitIndex.value];
});

const calculate = () => {
    if (volumeInput.value) {
        let volume;
        const input = volumeInput.value.trim();
        switch (selectedUnit.value) {
            case 'octal':
                if (input.length >= 3 && input.startsWith('0o')) {
                    volume = parseInt(volumeInput.value.slice(2), 8);
                }
            break;
            case 'scientificNotation':
                if (input.length >= 4) {
                    volume = Number(volumeInput.value);
                }
            break;
            case 'binary':
                if (input.length >= 3 && input.startsWith('0b')) {
                    volume = parseInt(volumeInput.value.slice(2), 2);
                }
                break;
            case 'romanNumerals':
                volume = romanToInt(input);
            break;
            case 'hexadecimal':
                if (input.length >= 2 && input.startsWith('#')) {
                    volume = parseInt(volumeInput.value.slice(1), 16);
                }
                break;
            case 'tallyMarks':
                volume = input.length - 1;
                break;
            default:
                volumeOutput = 'Unknown unit selected.';
            break;
        }
        selectedUnitIndex.value = (selectedUnitIndex.value + 1) % Object.keys(units).length;
        setControls();
        if (volume === parseInt(volume) && volume >= 0 && volume <= 100) {
            trickButton.value.style.position = 'static';
            volumeOutput.value = `Volume set to: ${volume}.`;
            audio.value.volume = volume / 100; // Set volume as a fraction of 1
        } else {
            volumeOutput.value = 'Invalid volume input. Please ensure it is within the range of 0 to 100 and formatted correctly.';
        }
    } else {
        volumeOutput.value = 'Volume cannot be empty.';
    }
    trickButton.value.style.position = 'static';
};

const setControls = () => {
    switch(selectedUnit.value) {
        case 'octal':
            showOctal.value = true;
            showDigits.value = false;
            showRoman.value = false;
            showLetters.value = false;
        break;
        case 'scientificNotation':
            showOctal.value = false;
            showDigits.value = true;
            showRoman.value = false;
            showLetters.value = false;
        break;
        case 'binary':
            showOctal.value = false;
            showDigits.value = true;
            showRoman.value = false;
            showLetters.value = false;
        break;
        case 'romanNumerals':
            showOctal.value = false;
            showDigits.value = false;
            showRoman.value = true;
            showLetters.value = false;
        break;
        case 'hexadecimal':
            showOctal.value = false;
            showDigits.value = true;
            showRoman.value = false;
            showLetters.value = true;
        break;
        case 'tallyMarks':
            showOctal.value = false;
            showDigits.value = true;
            showRoman.value = false;
            showLetters.value = false;
        break;
    }
}

function romanToInt(s) {
    const romanMap = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000};
    let total = 0;
    for (let i = 0; i < s.length; i++) {
        const currentValue = romanMap[s[i]];
        const nextValue = romanMap[s[i + 1]];
        if (nextValue > currentValue) {
            total += (nextValue - currentValue);
            i++; // Skip the next character as it's already processed
        } else {
            total += currentValue;
        }
    }
    return total;
 }

 const clearInput = () => {
    volumeInput.value = '';
    volumeOutput.value = '';
    if (trickButton.value) {
        trickButton.value.style.position = 'static';
    }
 }

</script>

<style scoped>

.darins-flop {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    height: calc(100vh - 32px);
    color: lime;
    font-weight: bold;
    text-shadow: 2px 2px 4px black;
    font-family: Comic Sans MS, Comic Sans, cursive;
    font-variant: small-caps;
    font-optical-sizing: auto;
    font-style: normal;

    button {
        background: linear-gradient(45deg, orange, yellow);
        border-radius: 4px;
        padding: 10px 20px;
        margin: 10px;
        border: none;
        cursor: pointer;
        font: inherit;
        font-size: 16px;
        transition: all 0.3s ease;
        animation: pulse 1.5s infinite;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        overflow: visible;
        position: relative;

        &:active {
            animation: wobble 0.8s;
        }
    }

    input {
        font: inherit;
        margin: 10px 0;
        padding: 8px;
        width: 200px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    dialog {
        background-color: red;
        color: blue;
        text-shadow: none;
        padding: 50px;
        box-shadow: 4px 4px 8px black;
        z-index: 30;
        max-width: calc(100vw - 96px);
        box-sizing: border-box;
    }

    .button-container {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .rotary-dial-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 48px;
    }

    .hampsters {
        background: white;
        margin: 0;
        position: fixed;
        top: 0;
        z-index: 10;
        overflow: hidden;
    }

    .input-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 24px;
        padding: 24px;
        background: magenta;
        color: lime;
        font-size: 1em;
        font-style: italic;
        font-weight: bold;
        position: relative;
        z-index: 20;
        text-shadow: 2px 2px 4px black;
    }

    .ad-container {
        position: fixed;
        width: 120px;
        overflow: hidden;
        bottom: 0px;
        left: 0;
        z-index: 10;
        background: url(https://matduggan.com/content/images/2024/05/image-1.png) no-repeat fixed;
    }

    .counter {
        position: fixed;
        bottom: 0px;
        right: 0;
        z-index: 10;
        background: url(http://srv14.jnetstation.com/jcount/Count.cgi?dd=A&md=8&df=seiryu-kan.com) no-repeat fixed;
    }

    audio {
        opacity: 0;
    }

    canvas {
        cursor: pointer;
    }

    .input-wrapper {
        position: relative;

        .clear-button {
            font-size: 32px;
            font-weight: bold;
            color: black;
            text-shadow: none;
            text-align: center;
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-55%);
            background-color: transparent;
            border: none;
            cursor: pointer;
        }
    }
}

.marquee {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(255, 165, 0, 0.5), rgba(255, 255, 0, 0.5), rgba(0, 255, 0, 0.5), rgba(0, 0, 255, 0.5), rgba(75, 0, 130, 0.5), rgba(238, 130, 238, 0.5));
    color: white;
    font-size: 24px;
    text-align: center;
    padding: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    z-index: 1000;
    font-family: 'Comic Sans MS', 'Comic Sans', cursive;
    font-variant: small-caps;
    font-optical-sizing: auto;
    font-style: italic;
    text-shadow: 2px 2px 4px black;

    .marquee-text {
        display: inline-block;
        animation: marquee-content 10s linear infinite;
        padding-left: 100%;
    }
}

    @keyframes marquee-content {
    	from { transform: translateX( 0% ); }
    	to { transform: translateX( -100% ); }
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    @keyframes wobble {
        0%,
        100% { transform: translateX(0%); }
        15% { transform: translateX(-25%) rotate(-5deg); }
        30% { transform: translateX(20%) rotate(3deg); }
        45% { transform: translateX(-15%) rotate(-3deg); }
        60% { transform: translateX(10%) rotate(2deg); }
        75% { transform: translateX(-5%) rotate(-1deg); }
    }

</style>