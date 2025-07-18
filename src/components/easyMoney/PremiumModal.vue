<template>
    <div class="modal-backdrop" @click.self="$emit('redirect')">
        <div class="modal" @mousemove="handleMouseMove" @click.self="$emit('redirect')">
            <button tabindex="-1" class="close-button" :style="{ top: buttonTop + 'px', left: buttonLeft + 'px', position: 'fixed' }" @click="$emit('close')">×</button>

            <h2>🎉 Congrats on getting Premium</h2>
            <ul class="benefits-list">
                <li>🔊 Boosted control time 10s => 15s</li>
                <li>✅ Ads</li>
                <li>💾 No custom settings</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

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

defineEmits(['close', 'redirect'])
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    text-align: center;
}

.benefits-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;
    text-align: left;
}

.benefits-list li {
    padding: 8px 0;
    font-size: 1rem;
    border-bottom: 1px solid #eee;
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
</style>

