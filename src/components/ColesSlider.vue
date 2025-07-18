<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const volume = ref(0)
let intervalId = null

const decrementVolume = () => {
  volume.value = 0
}

const incrementVolume = () => {
  volume.value += 1
}

const setupVolumeDecrease = () => {
  intervalId = setInterval(() => {
    if (volume.value > 0) {
      volume.value -= 0.1
    }
  }, 50)
}

onMounted(() => {
  setupVolumeDecrease()
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="wrapper">
    <div class="slider-container">
      <div class="volume-display">Volume: {{ Math.round(volume) }}</div>
      <div class="slider">
        <div class="slider-track">
          <div class="slider-fill" :style="{ width: `${Math.min(volume * 1, 100)}%` }"></div>
        </div>
      </div>
      <div class="buttons-wrapper">
        <button @click="decrementVolume" class="volume-button">Decrease Volume</button>
        <button @click="incrementVolume" class="volume-button">Increase Volume</button>
      </div>
      <div class="pipe"></div>
      <div v-if="volume > 0" class="water-container">
        <div class="water-leak leak1"></div>
        <div class="water-leak leak2"></div>
        <div class="water-leak leak3"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.buttons-wrapper {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.wrapper {
  width: 100vw;
  height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
  padding: 40px;
  border: 2px solid #777;
  border-radius: 16px;
  background-color: #f5f5f5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: visible;
}

.volume-display {
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: bold;
}

.slider {
  width: 100%;
  margin: 30px 0;
}

.slider-track {
  height: 16px;
  width: 100%;
  background-color: #ddd;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #20c4f4;
  transition: width 0.3s ease;
}

.volume-button {
  padding: 20px 30px;
  background-color: #20c4f4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 28px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.volume-button:hover {
  background-color: #256cfa;
}

.volume-button:active {
  transform: scale(0.98);
}

.pipe {
  position: absolute;
  bottom: -64px;
  right: 80px;
  width: 30px;
  height: 60px;
  background-color: #999;
  border: 2px solid #777;
  border-top-style: none;
  border-radius: 0 0 6px 6px;
  overflow: visible;
}

/* Water leaking animation */
.water-container {
  position: absolute;
  right: 80px;
  bottom: -84px;
  height: 40px;
  width: 30px;
  z-index: 2;
}

.water-leak {
  position: absolute;
  width: 16px;
  height: 24px;
  background-color: #20c4f4;
  border-radius: 40% 40% 50% 50%;
  opacity: 0;
  animation: dripping 2s infinite linear;
}

.leak1 {
  left: 6px;
  top: 0;
  animation-delay: 0s;
  animation-duration: 2s;
}

.leak2 {
  left: 6px;
  top: 0;
  animation-delay: 0.7s;
  animation-duration: 2.2s;
}

.leak3 {
  left: 6px;
  top: 0;
  animation-delay: 1.4s;
  animation-duration: 1.8s;
}

@keyframes dripping {
  0% {
    top: 0;
    opacity: 0;
    transform: scale(0.5) translateY(0);
  }
  10% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  20% {
    transform: scale(1.1, 0.9) translateY(10px);
  }
  30% {
    transform: scale(0.9, 1.1) translateY(20px);
  }
  80% {
    opacity: 1;
    transform: scale(1) translateY(120px);
  }
  100% {
    top: 120px;
    opacity: 0;
    transform: scale(0.5) translateY(200px);
  }
}
</style>
