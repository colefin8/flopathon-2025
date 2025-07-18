<template>
    <div class="card-container" ref="cardContainer">
        <div class="loot-box-card" :class="{ 'is-flipped': isFlipped }">
            <div class="card-face card-face--front" :class="{ 'holographic': isHolographic }" :style="cardStyle">
                <div class="loot-box-card-header">
                    <h2>{{ rarity }}</h2>
                </div>
                <div class="loot-box-card__content">
                    <p>{{ volume }}</p>
                </div>
            </div>
            <div class="card-face card-face--back">
                <h2>?</h2>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useVolumeStore } from './useVolumeStore.js';

const { index, rarity, volume, winningIndex } = defineProps({
    index: {
        type: Number,
        required: true
    },
    rarity: {
        type: String,
        default: 'Common'
    },
    volume: {
        type: Number,
        default: 0
    },
    winningIndex: {
        type: Number,
        default: -1

    }
});

const { isFlipped, selectedCardInfo } = storeToRefs(useVolumeStore());

const RARITIES = Object.freeze({
    COMMON: 'Common',
    UNCOMMON: 'Uncommon',
    RARE: 'Rare',
    LEGENDARY: 'Legendary'
});

const cardContainer = ref(null);
const cardTransform = ref('');

const cardStyle = computed(() => {
    switch (rarity) {
        case RARITIES.LEGENDARY:
            return { backgroundColor: '#facc15' }; // gold
        case RARITIES.RARE:
            return { backgroundColor: '#a78bfa' }; // purple
        case RARITIES.UNCOMMON:
            return { backgroundColor: '#67e8f9' }; // cyan
        default:
            return { backgroundColor: '#e5e7eb' }; // light gray
    }
});

const isCardSelected = computed(() => winningIndex === index);
const isHolographic = computed(() => [RARITIES.RARE, RARITIES.LEGENDARY].includes(rarity));

const handleMouseMove = (e) => {
    const card = cardContainer.value;
    const { width, height, left, top } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = -1 * ((y - height / 2) / (height / 2)) * 10;
    const rotateY = ((x - width / 2) / (width / 2)) * 10;

    cardTransform.value = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};

const handleMouseLeave = () => {
    cardTransform.value = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
};

watch(() => winningIndex, (winning) => {
    if (winning === index) {
        selectedCardInfo.value = { index, rarity, volume };
    }
})

onMounted(() => {
    const card = cardContainer.value;
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
});

onUnmounted(() => {
    const card = cardContainer.value;
    if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
    }
});

</script>

<style scoped>
.card-container {
    min-width: 320px;
    height: 200px;
    perspective: 1000px;
    transform: v-bind('cardTransform');
    transition: transform 0.1s ease;
}

.loot-box-card {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    user-select: none;
}

.loot-box-card.is-flipped {
    transform: rotateY(180deg);
}

.card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border: 1px solid #ccc;
    border-radius: 8px;
    border: v-bind('isCardSelected ? "4px solid #4b5563" : "none"');
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0); /* Add this line */
}

.card-face--front {
    transform: rotateY(180deg);
}

.card-face--back {
    background-color: #4b5563; /* gray-700 */
    color: white;
}

.card-face--back h2 {
    font-size: 4em;
}

.loot-box-card__content {
    font-size: 2.5em;
    color: #333;
}

.holographic::before {
    content: "";
    position: absolute;
    border-radius: 8px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        125deg,
        rgba(255, 0, 0, 0.2) 10%,
        rgba(255, 255, 0, 0.2) 25%,
        rgba(0, 255, 0, 0.2) 40%,
        rgba(0, 255, 255, 0.2) 55%,
        rgba(0, 0, 255, 0.2) 70%,
        rgba(255, 0, 255, 0.2) 85%,
        rgba(255, 0, 0, 0.2) 100%
    );
    background-size: 200% 200%;
    mix-blend-mode: color-dodge;
    pointer-events: none;
    z-index: 1;
    animation: holographicShimmer 3s linear infinite;
}

.holographic::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
        repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px
        );
    pointer-events: none;
    z-index: 2;
}

.holographic h2,
.holographic .loot-box-card__content {
    position: relative;
    z-index: 3;
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
}

@keyframes holographicAnimation {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
}

@keyframes holographicShimmer {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
</style>