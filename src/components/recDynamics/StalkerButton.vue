<template>
    <button
        v-if="isVisible"
        class="stalker-button"
        :style="buttonStyle"
        @click="handlePublishClick"
    >
        📢 PUBLISH MY SEARCH HISTORY
    </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    luckyButtonPosition: {
        type: Object,
        default: () => ({ x: 300, y: 200 })
    },
    isVisible: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['publish-click'])

const position = ref({ x: 350, y: 250 })
let followTimer = null

const buttonStyle = computed(() => ({
    left: position.value.x + 'px',
    top: position.value.y + 'px',
    position: 'fixed',
    zIndex: 46,
    background: 'linear-gradient(145deg, #450a0a, #1a0000)',
    color: '#ff6b6b',
    border: '2px solid #8b0000',
    padding: '8px 16px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: '1px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
    boxShadow: '0 0 20px rgba(139, 0, 0, 0.8), inset 0 0 5px rgba(139, 0, 0, 0.5)',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    animation: 'pulse 0.8s ease-in-out infinite'
}))

const followLuckyButton = () => {
    if (!props.isVisible) return

    const offsetX = 50 + Math.random() * 30;
    const offsetY = 20 + Math.random() * 20;

    position.value = {
        x: Math.max(0, Math.min(window.innerWidth - 300, props.luckyButtonPosition.x + offsetX)),
        y: Math.max(0, Math.min(window.innerHeight - 60, props.luckyButtonPosition.y + offsetY))
    }
}

const startFollowing = () => {
    followTimer = setInterval(followLuckyButton, 150);
}

const stopFollowing = () => {
    if (followTimer) {
        clearInterval(followTimer);
        followTimer = null;
    }
}

const handlePublishClick = () => {
    emit('publish-click');
}

watch(() => props.isVisible, (newVal) => {
    if (newVal) {
        startFollowing();
    } else {
        stopFollowing();
    }
})

watch(() => props.luckyButtonPosition, followLuckyButton, { deep: true });

onMounted(() => {
    if (props.isVisible) {
        startFollowing();
    }
})

onUnmounted(() => {
    stopFollowing();
})
</script>

<style scoped>
.stalker-button:hover {
    background: linear-gradient(145deg, #7f1d1d, #450a0a) !important;
    color: #fca5a5 !important;
    transform: scale(1.02);
}
</style>