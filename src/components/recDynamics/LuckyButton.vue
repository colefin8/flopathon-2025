<template>
    <button
        class="lucky-button"
        :style="buttonStyle"
        @click="handleLuckyClick"
    >
        ⚠️ I'm feeling lucky
    </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, defineEmits } from 'vue';

const emit = defineEmits(['lucky-click', 'position-change']);

const position = ref({ x: 300, y: 200 });
const rotation = ref(0);
let moveTimer = null;
let rotationTimer = null;

const buttonStyle = computed(() => ({
    left: position.value.x + 'px',
    top: position.value.y + 'px',
    transform: `rotate(${rotation.value + Math.sin(Date.now() * 0.003) * 3}deg)`,
    position: 'fixed',
    zIndex: 45,
    background: 'linear-gradient(145deg, #7f1d1d, #450a0a)',
    color: '#fecaca',
    border: '2px solid #7f1d1d',
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: '1px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    boxShadow: '0 0 25px rgba(139, 0, 0, 0.6), 0 0 15px rgba(0,0,0,0.8), inset 0 0 10px rgba(139, 0, 0, 0.3)',
    cursor: 'crosshair',
    filter: 'brightness(0.9) contrast(1.2)',
    animation: 'pulse 1s ease-in-out infinite',
    borderRadius: '4px',
    transition: 'all 0.5s ease-out'
}))

// Notify parent of position changes
const notifyPositionChange = () => {
    emit('position-change', position.value);
}

// Move button sporadically around the screen
const scheduleNextMove = () => {
    const randomDelay = Math.random() * 900 + 300

    moveTimer = setTimeout(() => {
        const maxX = window.innerWidth - 220
        const maxY = window.innerHeight - 80

        const isDramaticMove = Math.random() > 0.7

        if (isDramaticMove) {
            position.value = {
                x: Math.random() * maxX,
                y: Math.random() * maxY
            }
        } else {
            position.value = {
                x: Math.max(0, Math.min(maxX, position.value.x + (Math.random() - 0.5) * 200)),
                y: Math.max(0, Math.min(maxY, position.value.y + (Math.random() - 0.5) * 150))
            }
        }

        notifyPositionChange();
        scheduleNextMove();
    }, randomDelay)
}

const moveLabels = () => {

};


// Add faster continuous rotation for extra unease
const startRotation = () => {
    rotationTimer = setInterval(() => {
        rotation.value += (Math.random() - 0.5) * 15
    }, 100);
}

const handleLuckyClick = () => {


    emit('lucky-click');
}

onMounted(() => {
    scheduleNextMove();
    startRotation();
    notifyPositionChange();
})

onUnmounted(() => {
    if (moveTimer) clearTimeout(moveTimer);
    if (rotationTimer) clearInterval(rotationTimer);
})
</script>

<style scoped>
.lucky-button:hover {
    background: linear-gradient(145deg, #991b1b, #7f1d1d) !important;
    color: white !important;
    transform: scale(1.05);
}
</style>