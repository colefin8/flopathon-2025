<template>
    <div class="modal-backdrop" @click.self="$emit('redirect')">
        <div class="modal" @mousemove="handleMouseMove" @click.self="$emit('redirect')">
            <button tabindex="-1" class="close-button" :style="{ top: buttonTop + 'px', left: buttonLeft + 'px', position: 'fixed' }" @click="$emit('close')">×</button>

            <h2>Changing volume is Premium!</h2>
            <p>Watch a 30s ad to change your volume, or purchase Premium for more volume control benefits!</p>
            <div class="modal-buttons">
                <button class="ad-button" @click="onClick('confirm')">Watch ad <span class="button-text-right">(30 seconds)</span></button>
                <button class="premium-button" v-if="!userIsPremium" @click="onClick('premium')"> I want Premium! <span class="button-text-right"><i class="ph-fill ph-coins"></i>10 points</span></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia';

import {useVolumeStore} from './useVolumeStore.js';

const buttonTop = ref(50)
const buttonLeft = ref(window.innerWidth - 100) // Start near top-right

const threshold = 100 // px distance from cursor before it moves
let delay = 600 // ms delay between movements
let lastMoveTime = 0

const emit = defineEmits(['confirm', 'premium', 'close', 'redirect'])

const store = useVolumeStore();
const { clickThreshold } = storeToRefs(store);

defineProps({
    userIsPremium: {
        type: Boolean,
        default: false,
    }
})

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

const clickCount = ref(0);
const onClick = (event) => {
    clickCount.value += 1;
    if (clickCount.value === clickThreshold.value) {
        clickCount.value = 0;
        clickThreshold.value += 2;
        emit(event);
    }
}

</script>

<style scoped>
.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-buttons {
    margin-top: 15px;
    display: flex;
    justify-content: space-around;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-buttons button {
    padding: 8px 16px;
    font-size: 1rem;
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
.ad-button {
  border-radius: 8px;
  border: 2px solid gray;
  background: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.premium-button {
  border-radius: 8px;
  border: 2px solid orange;
  background: transparent;
  color: orange;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.button-text-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
