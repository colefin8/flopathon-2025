<template>
    <div class="video-container">
        <div class="video-box">
            <!-- Replace this with canvas or background image if needed -->
            <video ref="videoRef" class="video" :src="heimlechVideo" :volume="calculatedVolume" />
            <i v-if="showPlayButton"  class="ph ph-play play-button" @click="playVideo" />
        </div>

        <div class="controls" @mousedown="openModal">
            <label for="volume">Volume</label>
            <input
                type="range"
                min="0"
                max="100"
                step="1"
                :value="volume"
                @click="(e) => handleVolumeInput(e.target.value)"
            />
            <span>{{ Math.round(volume) }}%</span>
        </div>
        <ad-modal
            v-if="showModal"
            :user-is-premium="userIsPremium"
            @redirect="missedCloseButton"
            @confirm="confirmVolumeChange"
            @premium="onClickPremium"
            @close="showModal = false"
        />
        <premium-modal v-if="showPremiumModal" @close="showPremiumModal = false" @redirect="missedCloseButton" />
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia';
import AdModal from './AdModal.vue';
import PremiumModal from './PremiumModal.vue';
import { useVolumeStore } from './useVolumeStore.js';
import heimlechVideo from './assets/heimlech.mp4'

const showModal = ref(false)
const showPremiumModal = ref(false);
const videoRef = ref(null);

const { userIsPremium, isViewingAd, volume } = storeToRefs(useVolumeStore());

const openModal = () => {
    // volume.value = 0;
    showModal.value = true;
}

function confirmVolumeChange() {
    showModal.value = false
    isViewingAd.value = true;
}

const calculatedVolume = computed(() => +volume.value / 100)

function getRandomNumber(bottomValue, topValue) {
  if (bottomValue > topValue) {
    [bottomValue, topValue] = [topValue, bottomValue]; // Swap them
  }
  const range = topValue - bottomValue + 1;
  return Math.floor(Math.random() * range) + bottomValue;
}

function onClickPremium() {
    window.open('https://buy.stripe.com/test_3cIdRa7uh1ew5yWc046AM00', '_blank')
    showModal.value = false;
    userIsPremium.value = true;
    showPremiumModal.value = true;
}

const showPlayButton = ref(true);

const missedCloseButton = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1', '_blank')
}

function handleVolumeInput(newVolume) {
  console.log('clickee')
  if(userIsPremium.value) {
    const min = Math.floor(newVolume - (newVolume *.3))
    const max = Math.ceil(Math.min(newVolume + (newVolume *.3), 100))
    volume.value = getRandomNumber(min, max);
  }
}

function playVideo() {
  videoRef.value.play()
  showPlayButton.value = false;
}


</script>

<style scoped>
.video-container {
    height: min-content;
    width: 960px;
    max-width: 100%;
    background: #000;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.video-box {
    background-color: #222;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #aaa;
    font-size: 1.5rem;
}

.video {
  width: 100%;
}

.controls {
    padding: 10px;
    background: #111;
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
}

input[type="range"] {
    flex-grow: 1;
}

.play-button {
  z-index: 9;
  font-size: 120px;
  position: absolute;
  cursor: pointer;
}
</style>