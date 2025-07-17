<script setup>
import { ref } from 'vue'
import VolumeSlider from './VolumeSlider.vue'

const volume = ref(0);
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
    --header-height: 33px;
    --light-grey: #D7D7D7;
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
    border: 1px solid black;
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
