<script setup>
import { ref, computed, useTemplateRef, watch, nextTick } from 'vue';
import { onClickOutside } from '@vueuse/core';

import { bggTop100 } from '@/BoardGameWeight/boardgames.js';

// --- Data and State ---
const boardGames = bggTop100;
const target = useTemplateRef('target');
const showDropdown = ref(false);
const searchQuery = ref('');
const selectedGame = ref(null);
const highlightedIndex = ref(-1);
const itemRefs = ref([]);

// --- Filtering and Selection ---
const filteredGames = computed(() => {
    if (!searchQuery.value) {
        return boardGames;
    }
    const query = searchQuery.value.toLowerCase();
    return boardGames.filter((game) => game.name.toLowerCase().includes(query));
});

const onFocusInput = (event) => {
    nextTick(() => {
        if (
            event &&
            event.target &&
            typeof event.target.select === 'function'
        ) {
            event.target.select();
        }
    });
};

const inputRef = useTemplateRef('inputRef');

const onSelectGame = (game) => {
    selectedGame.value = game;
    searchQuery.value = game.name;
    showDropdown.value = false;

    if (audio.paused) {
        playAudio();
    }

    nextTick(() => {
        if (inputRef.value && typeof inputRef.value.blur === 'function') {
            inputRef.value.select();
        }
    });
};

// --- Volume Calculation ---
const volume = computed(() => {
    if (!selectedGame.value) return 0;
    const vol = Math.round(selectedGame.value.weight * 20);
    return Math.min(Math.max(vol, 1), 100);
});

// --- Audio Logic ---
const audio = new Audio('/bruh.mp3');

const playAudio = () => {
    audio.currentTime = 0;
    audio.play().catch((error) => {
        console.error('Error playing audio:', error);
    });
};

watch(volume, (newVolume) => {
    audio.volume = newVolume / 100; // Normalize volume to 0-1 range
});

// --- Dropdown and Keyboard Navigation ---
onClickOutside(target, () => {
    showDropdown.value = false;
});

const onKeydown = async (e) => {
    if (!showDropdown.value) {
        await nextTick(() => (showDropdown.value = true));
    }

    if (filteredGames.value.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (highlightedIndex.value < filteredGames.value.length - 1) {
            highlightedIndex.value++;
        } else {
            highlightedIndex.value = 0;
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (highlightedIndex.value > 0) {
            highlightedIndex.value--;
        } else {
            highlightedIndex.value = filteredGames.value.length - 1;
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (
            highlightedIndex.value >= 0 &&
            highlightedIndex.value < filteredGames.value.length
        ) {
            onSelectGame(filteredGames.value[highlightedIndex.value]);
        }
    } else if (e.key === 'Escape') {
        showDropdown.value = false;
        highlightedIndex.value = -1;
    }
};

watch(highlightedIndex, async (newIdx) => {
    await nextTick();
    if (
        newIdx >= 0 &&
        itemRefs.value[newIdx] &&
        typeof itemRefs.value[newIdx].scrollIntoView === 'function'
    ) {
        itemRefs.value[newIdx].scrollIntoView({ block: 'nearest' });
    }
});

watch(searchQuery, (val) => {
    if (val && filteredGames.value.length > 0) {
        highlightedIndex.value = 0;
    } else {
        highlightedIndex.value = -1;
    }
});
</script>

<template>
    <div class="floppy">
        <div>
            <span style="font-weight: 600">Volume</span> = board game
            <span style="color: #4f6df5">weight</span> * 20
        </div>
        <div>
            <span style="color: #4f6df5">Weight</span>: how difficult it is to
            learn and play
        </div>
        <div v-if="selectedGame">
            {{ volume }}
        </div>
        <div class="floppy__volume-bar">
            <div
                class="floppy__volume-fill"
                :style="{ height: Math.min(volume, 100) + '%' }"
            ></div>
        </div>
        <div class="floppy__input-container" ref="target">
            <input
                ref="inputRef"
                class="floppy__input"
                v-model="searchQuery"
                type="text"
                placeholder="Search for a board game"
                autocomplete="off"
                @click="onFocusInput"
                @focus="onFocusInput"
                @keydown="onKeydown"
            />
            <ul v-if="showDropdown" class="floppy__dropdown-content">
                <template v-if="filteredGames.length === 0">
                    <li class="floppy__list-item">No games found</li>
                </template>
                <template v-else>
                    <li
                        v-for="(game, idx) in filteredGames"
                        :key="game.name"
                        class="floppy__list-item"
                        :class="{
                            'floppy__list-item--highlighted':
                                idx === highlightedIndex,
                        }"
                        :ref="(el) => (itemRefs[idx] = el)"
                        @click="onSelectGame(game)"
                    >
                        <span>{{ game.name }}</span>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
.floppy {
    display: flex;
    flex-direction: column;
    gap: 32px;
    justify-content: center;
    align-items: center;
    height: 50vh;

    font-family: 'Arial', sans-serif;
    font-size: 16px;

    &__volume-bar {
        height: 100px;
        width: 20px;
        border: 2px solid #4f6df5;
        display: flex;
        align-items: flex-end;
    }
    &__volume-fill {
        width: 100%;
        background: #4f6df5;
        transition: height 0.3s;
    }

    &__input-container {
        position: relative;
        width: 300px;
    }

    &__input {
        width: 100%;
        padding: 8px;
        border: 2px solid black;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 16px;

        &:focus {
            outline: none;
            border-color: #2e4bb8;
            box-shadow: 0 2px 8px rgba(79, 109, 245, 0.15);
        }
    }

    &__dropdown-content {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: #9cb0f9;
        z-index: 1;
        list-style: none;
        margin: 4px 0 0 0;
        padding: 8px;
        box-sizing: border-box;
        border-radius: 8px;

        display: flex;
        flex-direction: column;
        gap: 2px;

        max-height: 448px;
        overflow-y: auto;
    }

    &__list-item {
        padding: 12px;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
            background-color: #7a8cd9;
        }
        &.floppy__list-item--highlighted {
            background-color: #7a8cd9;
        }
    }
}
</style>
