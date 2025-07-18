<template>
    <div class="container">
        <div>Volume: {{ volume }}</div>
        <input type="range" min="0" max="100" v-model="volume" disabled />

        <button @click="showStorage = true">Open Storage Box</button>
        <button @click="showStore = true">Open Store</button>
        <button @click="openEarnProgram">Open Earn Program</button>
        <!-- Hidden YouTube Player -->
        <div style="width:0;height:0;overflow:hidden;position:absolute;">
          <div id="ytplayer"></div>
        </div>
        <div v-if="showStorage" class="modal">
            <div class="modal-content">
                <span class="close" @click="showStorage = false">&times;</span>
                <h3>Storage Box</h3>
                <div class="storage-grid" :style="storageGridStyle">
                  <div v-for="(item, idx) in storageItems" :key="idx" class="slot" :style="slotStyle" @click="handleSlotClick(idx)">
                    <span v-if="item" :style="slotTextStyle">{{ getItemLabel(item) }}</span>
                    <span v-else :style="emptyTextStyle">Empty</span>
                    <div v-if="openLootBoxIdx === idx" class="lootbox-modal">
                      <div>
                        <p>Open this loot box?</p>
                        <button :disabled="findKeyIdx() === -1" @click.stop="openLootBox(idx)">Use Key to Open</button>
                        <button @click.stop="openLootBoxIdx = null">Cancel</button>
                        <p v-if="findKeyIdx() === -1" style="color:red;">No key available!</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <div v-if="showStore" class="modal">
          <div class="modal-content">
            <span class="close" @click="showStore = false">&times;</span>
            <h3>Store</h3>
            <p>Points: {{ points }}</p>
            <button @click="buyLootBox" :disabled="points < 3">Buy Loot Box (3 pts)</button>
            <button @click="buyKey" :disabled="points < 10">Buy Key (10 pts)</button>
            <button @click="increaseStorage" :disabled="points < 8">Increase Storage Size (8 pts)</button>
            <p>Storage Size: {{ storageSize }}</p>
            <p>Loot Boxes: {{ lootBoxCount }}</p>
            <p>Keys: {{ keyCount }}</p>
          </div>
        </div>
        <!-- Earn Program Modal -->
        <div v-if="showEarnModal" class="modal">
          <div class="modal-content">
            <span class="close" @click="showEarnModal = false">&times;</span>
            <h3>Earn Points</h3>
            <p>{{ earnQuestions[earnIdx].q }}</p>
            <input v-model="earnAnswer" :disabled="earnAwarded" placeholder="Your answer..." />
            <button @click="submitEarnAnswer" :disabled="earnAwarded || !earnAnswer.trim()">Submit</button>
            <p v-if="earnAwarded" style="color:green;">You earned {{ earnQuestions[earnIdx].points }} points!</p>
            <button v-if="earnAwarded" @click="nextEarnQuestion">Continue</button>
            <p v-if="earnAwarded && earnIdx === earnQuestions.length - 1" style="color:blue;">All questions complete!</p>
          </div>
        </div>
    </div>
</template>

<script setup>

import { ref, computed, onMounted, watch } from 'vue';


// --- YouTube Player Logic ---
const DEFAULT_YT_VIDEO_ID = 'dQw4w9WgXcQ';
let player = null;
const currentVideoId = ref(DEFAULT_YT_VIDEO_ID);

// List of YouTube video IDs for loot box rewards
const YOUTUBE_VIDEO_IDS = [
  'dQw4w9WgXcQ', // Rick Astley
  '9bZkp7q19f0', // PSY - Gangnam Style
  '3JZ_D3ELwOQ', // Mark Ronson - Uptown Funk
  'L_jWHffIx5E', // Smash Mouth - All Star
  'kJQP7kiw5Fk', // Luis Fonsi - Despacito
  'fJ9rUzIMcZQ', // Queen - Bohemian Rhapsody
  'hTWKbfoikeg', // Nirvana - Smells Like Teen Spirit
  'eVTXPUF4Oz4', // Linkin Park - Numb
  'RgKAFK5djSk', // Wiz Khalifa - See You Again
  'CevxZvSJLk8', // Katy Perry - Roar
];

function loadYouTubeAPI() {

  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    window.onYouTubeIframeAPIReady = () => resolve();
    document.body.appendChild(tag);
  });
}

// --- State ---
const volume = ref(50);
const isPlaying = ref(false);
const showStorage = ref(false);
const showStore = ref(false);
const openLootBoxIdx = ref(null); // index of loot box to open
const storageSize = ref(15);
const points = ref(8); // Start with 8 points
// --- Earn Program State ---
const earnQuestions = [
  { q: 'What is your favorite color?', points: 5 },
  { q: 'What city were you born in?', points: 10 },
  { q: 'What is your biggest dream?', points: 15 },
  { q: 'Describe a challenge you overcame.', points: 20 },
  { q: 'What is something you have never told anyone?', points: 30 }
];
const showEarnModal = ref(false);
const earnAnswer = ref('');
const earnAwarded = ref(false);
const earnIdx = ref(0);

function openEarnProgram() {
  showEarnModal.value = true;
  earnAnswer.value = '';
  earnAwarded.value = false;
  earnIdx.value = 0;
}

function submitEarnAnswer() {
  if (earnAnswer.value.trim() !== '') {
    points.value += earnQuestions[earnIdx.value].points;
    earnAwarded.value = true;
  }
}

function nextEarnQuestion() {
  if (earnIdx.value < earnQuestions.length - 1) {
    earnIdx.value++;
    earnAnswer.value = '';
    earnAwarded.value = false;
  } else {
    showEarnModal.value = false;
  }
}

// --- Item Types and Initial Items ---
const ITEM_TYPES = {
  PLAY: 'play',
  PAUSE: 'pause',
  LOOTBOX: 'lootbox',
  KEY: 'key',
  SORT: 'sort',
  YOUTUBE: 'youtube',
};
const initialItems = [
  ...Array(5).fill({ type: ITEM_TYPES.LOOTBOX }),
  ...Array(3).fill({ type: ITEM_TYPES.KEY }),
  { type: ITEM_TYPES.SORT },
];

// --- Storage Items ---
const storageItems = ref([
  ...initialItems,
  ...Array(storageSize.value - initialItems.length).fill(null)
]);

const scale = computed(() => Math.max(0.5, 15 / storageSize.value));
const columns = computed(() => Math.ceil(Math.sqrt(storageSize.value)));
const storageGridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columns.value}, 1fr)`,
  gap: `${8 * scale.value}px`,
  marginTop: '1.5rem',
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
}));
const slotStyle = computed(() => ({
  background: '#e0e0e0',
  border: '2px dashed #aaa',
  borderRadius: '6px',
  height: (320 / columns.value) * 0.8 + 'px',
  fontSize: 0.8 * scale.value + 'rem',
  color: '#555',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '0',
  minHeight: '0',
  overflow: 'hidden',
  padding: '0',
}));
const slotTextStyle = computed(() => ({ fontSize: 1 * scale.value + 'rem', cursor: 'pointer' }));
const emptyTextStyle = computed(() => ({ opacity: 0.3, fontSize: 1 * scale.value + 'rem' }));

// --- Computed loot box and key counts ---
const lootBoxCount = computed(() => storageItems.value.filter(item => item && item.type === ITEM_TYPES.LOOTBOX).length);
const keyCount = computed(() => storageItems.value.filter(item => item && item.type === ITEM_TYPES.KEY).length);

// --- YouTube Player Mount/Watch ---
onMounted(async () => {
  await loadYouTubeAPI();
  player = new window.YT.Player('ytplayer', {
    height: '0',
    width: '0',
    videoId: currentVideoId.value,
    events: {
      onReady: () => {
        player.setVolume(volume.value);
      },
      onStateChange: (event) => {
        // 0 = ended, 1 = playing
        if (event.data === window.YT.PlayerState.ENDED && isPlaying.value) {
          player.seekTo(0);
          player.playVideo();
        }
      }
    }
  });
});

watch(volume, (val) => {
  try { if (player && player.setVolume) player.setVolume(val); } catch {}
});

watch(isPlaying, (val) => {
  try {
    if (!player) return;
    if (val) player.playVideo();
    else player.pauseVideo();
  } catch {}
});

// Watch for videoId changes to load new video
watch(currentVideoId, (val) => {
  try {
    if (player && player.loadVideoById) {
      player.loadVideoById(val);
      // If not playing, pause immediately after switching video
      if (!isPlaying.value && player.pauseVideo) {
        setTimeout(() => {
          try { player.pauseVideo(); } catch {}
        }, 100);
      }
    }
  } catch {}
});

// --- Storage Logic Functions ---
function findKeyIdx() {
  return storageItems.value.findIndex(item => item && item.type === ITEM_TYPES.KEY);
}

function getRandomItem() {
  // Add YOUTUBE as a possible type
  const types = [ITEM_TYPES.PLAY, ITEM_TYPES.PAUSE, ITEM_TYPES.SORT, 'volume', ITEM_TYPES.YOUTUBE];
  const type = types[Math.floor(Math.random() * types.length)];
  if (type === 'volume') {
    return { type: 'volume', value: Math.floor(Math.random() * 100) + 1 };
  }
  if (type === ITEM_TYPES.YOUTUBE) {
    // Pick a random video ID
    const videoId = YOUTUBE_VIDEO_IDS[Math.floor(Math.random() * YOUTUBE_VIDEO_IDS.length)];
    return { type: ITEM_TYPES.YOUTUBE, videoId };
  }
  return { type };
}

function openLootBox(idx) {
  const keyIdx = findKeyIdx();
  if (keyIdx === -1) return;
  // Remove loot box and key
  storageItems.value[idx] = null;
  storageItems.value[keyIdx] = null;
  // Add 3 random items to empty slots
  let added = 0;
  for (let i = 0; i < storageItems.value.length && added < 3; i++) {
    if (!storageItems.value[i]) {
      storageItems.value[i] = getRandomItem();
      added++;
    }
  }
  openLootBoxIdx.value = null;
}

function buyLootBox() {
  if (points.value < 3) return;
  for (let i = 0; i < storageItems.value.length; i++) {
    if (!storageItems.value[i]) {
      storageItems.value[i] = { type: ITEM_TYPES.LOOTBOX };
      points.value -= 3;
      break;
    }
  }
}

function buyKey() {
  if (points.value < 10) return;
  for (let i = 0; i < storageItems.value.length; i++) {
    if (!storageItems.value[i]) {
      storageItems.value[i] = { type: ITEM_TYPES.KEY };
      points.value -= 10;
      break;
    }
  }
}

function increaseStorage() {
  if (points.value < 8) return;
  storageSize.value++;
  storageItems.value.push(null);
  points.value -= 8;
}

function getItemLabel(item) {
  if (!item) return '';
  switch (item.type) {
    case ITEM_TYPES.PLAY: return '▶️';
    case ITEM_TYPES.PAUSE: return '⏸️';
    case ITEM_TYPES.LOOTBOX: return '🎁 Loot Box';
    case ITEM_TYPES.KEY: return '🔑 Key';
    case ITEM_TYPES.SORT: return '🔀 Sort';
    case ITEM_TYPES.YOUTUBE: return '📺 YouTube';
    case 'volume': return `🔊 ${item.value}%`;
    default: return '';
  }
}

function sortStorage() {
  // Only shuffle non-null items
  const items = storageItems.value.filter(Boolean);
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  // Fill up to storageSize slots
  storageItems.value = [...items, ...Array(storageSize.value - items.length).fill(null)];
}


function handleSlotClick(idx) {
  const item = storageItems.value[idx];
  if (!item) return;
  if (item.type === ITEM_TYPES.SORT) {
    sortStorage();
  } else if (item.type === ITEM_TYPES.LOOTBOX) {
    openLootBoxIdx.value = idx;
  } else if (item.type === 'volume') {
    volume.value = item.value;
  } else if (item.type === ITEM_TYPES.PLAY) {
    isPlaying.value = true;
  } else if (item.type === ITEM_TYPES.PAUSE) {
    isPlaying.value = false;
  } else if (item.type === ITEM_TYPES.YOUTUBE) {
    currentVideoId.value = item.videoId;
    // Only play if already playing
    // (do not set isPlaying to true here)
  }
}


</script>

<style>
.container {
    margin-top: 50px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 500px;
  height: 400px;
  min-width: unset;
  min-height: unset;
  max-width: 500px;
  max-height: 400px;
  text-align: center;
  position: relative;
}
.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 2rem;
  cursor: pointer;
}

.storage-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-top: 1.5rem;
}
.slot {
  background: #e0e0e0;
  border: 2px dashed #aaa;
  border-radius: 6px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #555;
}
</style>