<script setup>
</script>

<template>
  <div id="eggmangame">
    <div class="container">
      <h1>FEED EGGS</h1>

    </div>
  </div>
</template>

<style>
  :root {
    margin: 0;
    padding: 0;
    --header-height: 33px;
    --light-grey: #D7D7D7;
  }

  * {
    box-sizing: border-box;
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
    border: 1px solid black;
  }
</style>
