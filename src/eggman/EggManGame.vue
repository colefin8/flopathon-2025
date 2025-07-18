<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import VolumeSlider from './VolumeSlider.vue';
import Note from './Note.vue';
import { Rive } from "@rive-app/canvas";

const volume = ref(50);
const eggCount = ref(20);
const canvasRef = ref(null);

// data binding for eggman state machine input
const isEating = ref(false);

// dragging state
const isDragging = ref(false);
const draggedEgg = ref({
  x: 0,
  y: 0,
  visible: false
});

const grabEgg = (event) => {
  isDragging.value = true;
  draggedEgg.value = {
    x: event.clientX,
    y: event.clientY,
    visible: true
  };
};

const onMouseMove = (event) => {
  if (isDragging.value) {
    draggedEgg.value.x = event.clientX;
    draggedEgg.value.y = event.clientY;
  }
};

const onMouseUp = () => {
  if (isDragging.value) {
    // check if the egg was dropped over the eggman canvas
    const canvas = canvasRef.value;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const eggX = draggedEgg.value.x;
      const eggY = draggedEgg.value.y;
      if (
        eggX >= rect.left &&
        eggX <= rect.right &&
        eggY >= rect.top &&
        eggY <= rect.bottom
      ) {
        isEating.value = true;
        setTimeout(() => {
          isEating.value = false;
        }, 800);
      }
    }
  }
  isDragging.value = false;
  draggedEgg.value.visible = false;
};

let riveInstance = null;
let isEatingInput = null;

onMounted(() => {
  riveInstance = new Rive({
    src: "public/eggman.riv",
    canvas: canvasRef.value,
    autoplay: true,
    stateMachines: "State Machine 1",
    onLoad: () => {
      riveInstance.resizeDrawingSurfaceToCanvas();
      // Data binding: find the isEating input and bind it to the ref
      const inputs = riveInstance.stateMachineInputs("State Machine 1");
      isEatingInput = inputs.find(input => input.name === "isEating");
      if (isEatingInput) {
        isEatingInput.value = isEating.value;
      }
    },
  });

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

// Watch for changes to isEating and update the Rive input
watch(isEating, (newVal) => {
  if (isEatingInput) {
    isEatingInput.value = newVal;
  }
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
});


</script>

<template>
  <div id="eggmangame">
    <div class="container fancy-border">
      <h1 class="title">FEED EGGS</h1>
      <VolumeSlider :volume="volume" class="volume-area" />
      <Note :volume="volume" class="note-area" />
      <div class="interactive-area">
        <!-- eggman -->
        <canvas id="eggman" ref="canvasRef" width="175" height="175"></canvas>

        <div class="basket-area">
          <svg class="eggs" width="87" height="53" viewBox="0 0 87 53" fill="none" xmlns="http://www.w3.org/2000/svg" @mousedown="grabEgg">
            <path d="M30.8869 7.85281C36.6947 10.1342 39.1816 18.1904 36.1065 26.0189C33.0313 33.8474 25.7261 38.0571 19.9184 35.7757C14.1106 33.4944 11.6237 25.4382 14.6989 17.6097C17.774 9.78114 25.0792 5.57142 30.8869 7.85281Z" fill="#EDEDED" stroke="black"/>
            <path d="M46.8869 4.85281C52.6947 7.13419 55.1816 15.1904 52.1065 23.0189C49.0313 30.8474 41.7261 35.0571 35.9184 32.7757C30.1106 30.4944 27.6237 22.4382 30.6989 14.6097C33.774 6.78114 41.0792 2.57142 46.8869 4.85281Z" fill="#EDEDED" stroke="black"/>
            <path d="M11.117 20.4806C16.5329 17.3818 24.371 20.4886 28.548 27.7889C32.725 35.0892 31.4317 43.4207 26.0158 46.5196C20.5998 49.6184 12.7618 46.5116 8.58478 39.2113C4.40775 31.9109 5.70111 23.5794 11.117 20.4806Z" fill="#EDEDED" stroke="black"/>
            <path d="M31.5732 18.2921C37.7993 17.8796 43.4836 24.1066 44.0396 32.4991C44.5956 40.8915 39.7825 47.814 33.5563 48.2265C27.3302 48.6389 21.6459 42.4119 21.0899 34.0195C20.5339 25.627 25.3471 18.7046 31.5732 18.2921Z" fill="#EDEDED" stroke="black"/>
            <path d="M55.0774 6.37326C60.9783 4.34514 68.0946 8.86679 70.8284 16.821C73.5622 24.7751 70.7293 32.7162 64.8283 34.7444C58.9273 36.7725 51.811 32.2508 49.0772 24.2967C46.3434 16.3425 49.1764 8.40139 55.0774 6.37326Z" fill="#EDEDED" stroke="black"/>
            <path d="M58.8869 18.8528C64.6947 21.1342 67.1816 29.1904 64.1065 37.0189C61.0313 44.8474 53.7261 49.0571 47.9184 46.7757C42.1106 44.4944 39.6237 36.4382 42.6989 28.6097C45.774 20.7811 53.0792 16.5714 58.8869 18.8528Z" fill="#EDEDED" stroke="black"/>
            <path d="M74.8869 19.8528C80.6947 22.1342 83.1816 30.1904 80.1065 38.0189C77.0313 45.8474 69.7261 50.0571 63.9184 47.7757C58.1106 45.4944 55.6237 37.4382 58.6989 29.6097C61.774 21.7811 69.0792 17.5714 74.8869 19.8528Z" fill="#EDEDED" stroke="black"/>
          </svg>
          <svg class="basket" width="84" height="50" viewBox="0 0 84 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="7.95312" y="15.5" width="68" height="6" rx="3" fill="#D9D9D9" stroke="black"/>
            <rect x="15.9531" y="45.5" width="51" height="4" rx="2" fill="#D9D9D9" stroke="black"/>
            <path d="M68.6111 39.5706L73.4531 21.5H9.02234L13.8643 39.5706C14.8015 43.068 17.9709 45.5 21.5917 45.5H60.8837C64.5046 45.5 67.674 43.068 68.6111 39.5706Z" fill="#7F7F7F" stroke="black"/>
            <rect x="0.953125" y="0.5" width="82" height="17" rx="8.5" fill="#B1B1B1" stroke="black"/>
          </svg>
          <div class="egg-count">
            <div class="egg-count-text">
              <span class="egg-count-label">EGGS:</span>
              <span class="egg-count-number">{{ eggCount }}</span>
            </div>
          </div>
        </div>
        
        <!-- draggable egg -->
        <svg 
          v-if="draggedEgg.visible" 
          class="draggable-egg" 
          width="25" 
          height="31" 
          viewBox="0 0 25 31" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          :style="{ left: draggedEgg.x + 'px', top: draggedEgg.y + 'px' }"
        >
          <path d="M12.4531 0.5C18.6929 0.5 23.9531 7.08915 23.9531 15.5C23.9531 23.9108 18.6929 30.5 12.4531 30.5C6.21334 30.5 0.953125 23.9108 0.953125 15.5C0.953125 7.08915 6.21334 0.5 12.4531 0.5Z" fill="#EDEDED" stroke="black"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<style>
  @font-face {
    font-family: 'Press Start 2P';
    src: url('../assets/PressStart2P-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    margin: 0;
    padding: 0;
    --light-grey: #D7D7D7;
    --off-white: #EDEDED;
    --header-height: 33px;
    --line-width: 3px;
  }

  .fancy-border {
    --fancy-border-height: 24px;
    --fancy-border-bg: var(--light-grey);
    position: relative;
    padding-top: var(--fancy-border-height);
  }

  .fancy-border::before {
    content: "";
    position: absolute;
    top: 0;
    left: calc(-1 * var(--line-width));
    right: calc(-1 * var(--line-width));
    height: var(--fancy-border-height);
    background: 
      linear-gradient(to right, var(--fancy-border-bg) 0%, var(--fancy-border-bg) 5px, transparent 5px, transparent calc(100% - 5px), var(--fancy-border-bg) calc(100% - 5px), var(--fancy-border-bg) 100%),
      linear-gradient(
        to bottom,
        var(--fancy-border-bg) 0%,
        var(--fancy-border-bg) 20%,
        black 20%,
        black 32.5%,
        var(--fancy-border-bg) 32.5%,
        var(--fancy-border-bg) 43.75%,
        black 43.75%,
        black 56.25%,
        var(--fancy-border-bg) 56.25%,
        var(--fancy-border-bg) 67.5%,
        black 67.5%,
        black 80%,
        var(--fancy-border-bg) 80%,
        var(--fancy-border-bg) 100%
      );
    border: var(--line-width) solid black;
  }

  header {
    position: relative;
  }

  body {
    margin: 0;
    padding: 0;
    height: 100dvh;
    width: 100dvw;
    background: black;
  }

  #app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: absolute;
  }

  #__vue-devtools-container__ {
    display: none;
  }
</style>

<style scoped>
  #eggmangame {
    --fancy-border-height: 24px;
    height: calc(100% - var(--header-height));
    width: 100%;
    margin-top: 33px;
    background-color: #fff;
    position: relative;
  }
  #eggmangame:active {
    cursor: grabbing;
  }

  .container {
    --container-margin: 21px;
    position: absolute;
    top: var(--container-margin);
    bottom: var(--container-margin);
    left: var(--container-margin);
    right: var(--container-margin);
    background: var(--light-grey);
    display: grid;
    grid-template-areas: "title"
                         "volume"
                         "note"
                         "interactive";
    grid-template-rows: 134px auto auto 1fr;
    grid-template-columns: 1fr;
    justify-content: center;
    justify-items: center;
    border-left: var(--line-width) solid black;
    border-right: var(--line-width) solid black;
    border-bottom: var(--line-width) solid black;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .title {
    font-family: 'Press Start 2P', monospace;
    font-size: 20px;
    grid-area: title;
    margin: 0;
    padding: 0;
    align-self: center;
  }

  .volume-area {
    grid-area: volume;
    align-self: start;
  }

  .note-area {
    grid-area: note;
    margin-top: 17px;
    align-self: start;
  }

  .interactive-area {
    --interactive-margin: 20px;
    grid-area: interactive;
    align-self: start;
    justify-self: center;
    margin-top: var(--interactive-margin);
    margin-bottom: var(--interactive-margin);
    width: 100%;
    height: calc(100% - var(--interactive-margin));
    position: relative;
  }

  #eggman {
    position: absolute;
    bottom: 119px;
    left: 30px;
  }

  .basket-area {
    position: absolute;
    right: 85px;
    bottom: 101px;
  }

  .eggs {
    position: absolute;
    bottom: 58px;
    right: 1px;
  }

  .basket {
    position: absolute;
    bottom: 22px;
    right: 3px;
  }

  .egg-count {
    font-size: 12px;
    font-family: 'Press Start 2P', monospace;
    letter-spacing: 0.5px;
  }

  .draggable-egg {
    position: fixed;
    pointer-events: none;
    z-index: 1000;
    transform: translate(-50%, -50%);
  }

  .eggs {
    cursor: grab;
  }
</style>
