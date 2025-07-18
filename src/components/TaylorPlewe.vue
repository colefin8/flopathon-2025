<template>
    <main>
        <div class="canvases">
            <div class="canvas-with-label">
                <label for="target">Target version</label>
                <canvas
                    id="target"
                    ref="target"
                    width="128"
                    height="128"
                    tabindex="-1"
                    @contextmenu="e => e.preventDefault()"
                ></canvas>
            </div>
        
            <div class="canvas-with-label">
                <label for="drawable">Your version</label>
                <canvas
                    id="drawable"
                    ref="drawable"
                    width="128"
                    height="128"
                    tabindex="-1"
                    @contextmenu="e => e.preventDefault()"
                ></canvas>
                <dl id="controls">
                    <dt>Left click</dt>
                    <dd>Draw</dd>
                    <dt>Right click</dt>
                    <dd>Erase</dd>
                    <dt>Mouse wheel</dt>
                    <dd>Change pencil size</dd>
                </dl>
            </div>
        </div>

        <div id="slider-and-label">
            <label for="slider">Volume: <strong>{{ Math.round(volume) }}%</strong></label>
            <div id="slider">
                <div id="fill" :style="`width: ${volume}%`"></div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue';

import Draw from './TaylorPlewe/draw.js';

const POSSIBLE_IMAGES = Object.freeze([
    'einstein.bmp',
    'aco.bmp',
    'falcon.bmp',
]);
const IMAGE_INDEX_STORAGE_KEY = 'TaylorPlewe_ImageIndex';
const targetRef = useTemplateRef('target');
const drawableRef = useTemplateRef('drawable');
const volume = ref<number>(0);
let targetPixels: Uint8ClampedArray;

let getMatchPercentage: Function;
let animationRequestHandle: number;
const updateVolumeFromMatchPercentage = () => {
    volume.value = getMatchPercentage() * 100;
    animationRequestHandle = requestAnimationFrame(updateVolumeFromMatchPercentage);
}

onMounted(() => {
    document.documentElement.style.overflow = 'hidden';

    loadTargetImage();
    loadWasmModule();
});
onUnmounted(() => {
    document.documentElement.style.overflow = 'revert';
    cancelAnimationFrame(animationRequestHandle);
});


const loadTargetImage = () => {
    // prepare to save pixels when image loads
    const img = new Image();
    img.onload = () => {
        const targetCtx = targetRef.value.getContext('2d');
        targetCtx.drawImage(img, 0, 0);
        targetPixels = targetCtx.getImageData(0, 0, targetRef.value.width, targetRef.value.height).data;
        console.info('TargetPixels set ✅');
    }

    // get index of image & draw to canvas
    const imageIndexFromStorage = sessionStorage.getItem(IMAGE_INDEX_STORAGE_KEY);
    let imageIndex: number = imageIndexFromStorage
        ? parseInt(imageIndexFromStorage)
        : Math.floor(Math.random() * POSSIBLE_IMAGES.length);
    const imageName = POSSIBLE_IMAGES[imageIndex];
    img.src = `@/assets/${imageName}`;

    // rotate through images when user refreshes
    imageIndex = (imageIndex + 1) % POSSIBLE_IMAGES.length;
    sessionStorage.setItem(IMAGE_INDEX_STORAGE_KEY, imageIndex.toString());
}

const loadWasmModule = async () => {
    const mod = await Draw({
        canvas: drawableRef.value,
    });
    getMatchPercentage = mod._get_match_percentage;
    animationRequestHandle = requestAnimationFrame(updateVolumeFromMatchPercentage);

    // allocate memory in wasm land, blit Einstein's pixels to it
    // but only if target pixels are ready
    if (targetPixels) sendTargetPixelDataToWasm(mod);
    else {
        const waitForPixelsInterval = setInterval(() => {
            console.info('Target pixels still not set, running interval...');
            if (targetPixels) {
                sendTargetPixelDataToWasm(mod);
                clearInterval(waitForPixelsInterval);
            }
        }, 300);
    }
}

const sendTargetPixelDataToWasm = (mod: any) => {
    const pointer = mod._malloc(targetPixels.byteLength);
    if (pointer === null) {
        throw new Error('Could not allocate memory from JavaScript!');
    }
    mod.HEAPU8.set(targetPixels, pointer / Uint8Array.BYTES_PER_ELEMENT);
    mod._read_target_pixel_data(pointer, targetPixels.byteLength);
    console.info('TargetPixels sent to wasm ✅')
}
</script>

<style scoped>
p, label {
    font-size: 16pt;
    font-family: sans-serif;
    color: #444;
    margin: 0;
}
main {
    position: fixed;
    top: 50%;
    left: 50%;
    translate: -50% -50%;

    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;
}
canvas {
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #ccc;

    width: calc(128px * 3);
    image-rendering: pixelated;

    &#drawable {
        cursor: none !important; /* fighting with emscripten's generated draw.js */
    }
}

.canvases {
    display: flex;
    align-items: center;
    gap: 64px;
}
.canvas-with-label {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;    
    gap: 8px;
}

#slider-and-label {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
#slider {
    width: 400px;
    height: 16px;
    background-color: #eee;
    border-radius: 4px;
    position: relative;
    overflow: hidden;

    #fill {
        position: absolute;
        height: 100%;
        background-color: #4b4;
    }
}

dl#controls {
    position: absolute;
    right: 0;
    bottom: 0;
    translate: 110% 0;
    margin: 0;
    pointer-events: none;
    font-family: sans-serif;

    display: grid;
    grid-template-columns: auto auto;
    column-gap: 8px;

    & > dt {
        font-style: italic;
    }
    & > dd {
        margin: 0;
    }
}
dd {
    margin: 0;
}
</style>