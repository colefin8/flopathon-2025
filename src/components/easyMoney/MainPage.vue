<template>
  <main>
    <h1>How to do the Heimlech</h1>
    <volume-control />
    <div v-if="isTimerActive">
      Current Volume Available For: {{ currentTimer }} seconds
    </div>
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

import VolumeControl from './VolumeControl.vue'
import { useVolumeStore } from './useVolumeStore';

const { isTimerActive, currentTimer } = storeToRefs(useVolumeStore());

function setAdTimeout() {
  currentTimer.value = Math.floor(currentTimer.value / 1000); // store seconds
  const interval = setInterval(() => {
    if (currentTimer.value > 0) {
      currentTimer.value -= 1;
    } else {
      clearInterval(interval);
      isTimerActive.value = false;
    }
  }, Math.random() * 3000);
}

watch(() => isTimerActive.value, (active) => {
  if (active) {
    setAdTimeout();
  }
}, { immediate: true });

</script>

<style scoped>
main {
    display: flex;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
}

h1 {
  font-size: 4rem;
}

</style>