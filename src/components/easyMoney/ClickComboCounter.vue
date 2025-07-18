<template>
    <div class="click-combo-counter">
        <transition name="combo-fade">
            <div v-if="showCounter" class="click-combo-counter__container">
                <span :key="clickCount" class="click-combo-counter__label">{{ shownLabel }}</span>
            </div>
        </transition>
        <slot />
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    KO: {
        type: Number,
        required: true
    },
    clickCount: {
        type: Number,
        required: true
    }
});

const showCounter = ref(false);
let timeoutId = null;

watch(() => props.clickCount, (newCount) => {
    if (newCount > 0) {
        showCounter.value = true;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            showCounter.value = false;
        }, 2000);
    } else {
        showCounter.value = false;
        clearTimeout(timeoutId);
    }
});

const shownLabel = computed(() => {
    if (props.clickCount >= props.KO) {
        return 'KO';
    } else {
        return `x ${props.clickCount}`;
    }
});
</script>

<style scoped>
.click-combo-counter {
    position: relative;
}
.click-combo-counter__container {
    position: absolute;
    top: -50px;
    right: -50px;
    text-align: right;
}

@keyframes bounce-in {
    0% {
        transform: scale(0.5) skew(-15deg);
    }
    80% {
        transform: scale(1.1) skew(-15deg);
    }
    100% {
        transform: scale(1) skew(-15deg);
    }
}

.click-combo-counter__label {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 4rem;
    font-weight: 900;
    color: #ffdd00;
    -webkit-text-stroke: 2px #c00;
    text-shadow: 4px 4px 0 #000;
    display: inline-block;
    animation: bounce-in 0.3s ease-out;
}

/* Transition for fade out */
.combo-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.combo-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
</style>