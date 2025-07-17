<script setup>
import { ref } from 'vue'
import VolumeSlider from './VolumeSlider.vue'

const volume = ref(20);
</script>

<template>
  <div id="eggmangame">
    <div class="container">
      <h1 class="title">FEED EGGS</h1>
      <VolumeSlider :volume="volume" class="volume-area" />
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
    grid-template-rows: 129px 1fr 1fr 1fr;
    justify-content: center;
    justify-items: center;
    border-left: var(--line-width) solid black;
    border-right: var(--line-width) solid black;
    border-bottom: var(--line-width) solid black;
    padding-top: var(--fancy-border-height);
  }

  .container::before {
    content: "";
    position: absolute;
    top: 0;
    left: calc(-1 * var(--line-width));
    right: calc(-1 * var(--line-width));
    height: var(--fancy-border-height);
    background: 
      linear-gradient(to right, #D7D7D7 0%, #D7D7D7 5px, transparent 5px, transparent calc(100% - 5px), #D7D7D7 calc(100% - 5px), #D7D7D7 100%),
      linear-gradient(
        to bottom,
        #D7D7D7 0%,
        #D7D7D7 20%,
        black 20%,
        black 32.5%,
        #D7D7D7 32.5%,
        #D7D7D7 43.75%,
        black 43.75%,
        black 56.25%,
        #D7D7D7 56.25%,
        #D7D7D7 67.5%,
        black 67.5%,
        black 80%,
        #D7D7D7 80%,
        #D7D7D7 100%
      );
    border: var(--line-width) solid black;
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
</style>
