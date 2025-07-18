<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import {useVolumeStore} from './useVolumeStore.js'
import sizzler from './assets/sizzler.mp4'
import constipation from './assets/constipation.mp4'
import {storeToRefs} from "pinia";

const {isViewingAd} = storeToRefs(useVolumeStore())

const selectedVideo = ref(null)
const videoRef = ref(null)
const showExitIcon = ref(false);
const duration = ref(0);
let countdownInterval = null;

const randomVideo = () => {
  const allVideos = [sizzler, constipation]
  return allVideos[Math.floor(Math.random() * allVideos.length)]
}

const videoHasEnded = () => {
  showExitIcon.value = true
}

onMounted(() => {
  selectedVideo.value = randomVideo()
})

const startCountdown = () => {
  // Clear any existing interval to prevent multiple intervals running
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    if (duration.value > 0) {
      duration.value--;
    } else {
      clearInterval(countdownInterval); // Stop the countdown when it reaches zero
      showExitIcon.value = true; // Optionally show the exit icon when countdown finishes
    }
  }, 1000); // Update every 1000ms (1 second)
};


watch(selectedVideo, (newVideo) => {
  if (videoRef.value) {
    setTimeout(() => {
      videoRef.value.play()
      duration.value = Math.ceil(videoRef.value.duration);
      startCountdown()
    }, 200)
  }
})

const exitIconStyles = computed(() => showExitIcon.value ? 'block' : 'none')

const missedCloseButton = () => {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1', '_blank')
}

const buttonTop = ref(50)
const buttonLeft = ref(window.innerWidth - 100) // Start near top-right

const threshold = 100 // px distance from cursor before it moves
let delay = 600 // ms delay between movements
let lastMoveTime = 0

function handleMouseMove(e) {
  const now = Date.now()
  if (now - lastMoveTime < delay) return

  const cursorX = e.clientX
  const cursorY = e.clientY

  const btnX = buttonLeft.value + 16
  const btnY = buttonTop.value + 16

  const dx = cursorX - btnX
  const dy = cursorY - btnY
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance < threshold) {
    let newLeft = buttonLeft.value - dx * 0.7 + (Math.random() - 0.5) * 800
    let newTop = buttonTop.value - dy * 0.7 + (Math.random() - 0.5) * 800

    // Clamp to screen bounds (window.innerWidth / innerHeight)
    const buttonSize = 40
    const padding = 10

    const maxLeft = window.innerWidth - buttonSize - padding
    const maxTop = window.innerHeight - buttonSize - padding

    buttonLeft.value = Math.max(padding, Math.min(maxLeft, newLeft))
    buttonTop.value = Math.max(padding, Math.min(maxTop, newTop))

    delay += 20
    lastMoveTime = now
  }
}
</script>

<template>
  <div class="ad-page" @mousemove="handleMouseMove" @click.self="missedCloseButton">
    <button v-if="showExitIcon" tabindex="-1" class="close-button" :style="{ top: buttonTop + 'px', left: buttonLeft + 'px', position: 'fixed' }" @click="isViewingAd = false">×</button>
    <span v-else class="duration-text">{{duration}}</span>
    <video ref="videoRef" :key="selectedVideo" :src="selectedVideo" @ended="videoHasEnded" />
  </div>
</template>

<style scoped>
.ad-page {
  height: calc(100vh - 33px);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  background-color: #111111;
}
video {
  pointer-events: none;
}

.close-icon {
  display: v-bind(exitIconStyles);
  color: red;
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 30px;
  cursor: pointer;
}

.close-button {
  width: 32px;
  height: 32px;
  font-size: 20px;
  border: none;
  background: #eee;
  color: #333;
  border-radius: 50%;
  cursor: pointer;
  z-index: 9999;
  transition: top 0.5s ease, left 0.5s ease;
}

.duration-text {
  z-index: 9999;
  position: absolute;
  top: 40px;
  right: 20px;
  color: white;
}
</style>