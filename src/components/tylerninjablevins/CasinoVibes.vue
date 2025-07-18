<template>
  <div class="container">
    <!-- Casino background overlay -->
    <div class="casino-bg"></div>
    <div class="casino-header">
      <img src="https://cdn-icons-png.flaticon.com/512/616/616554.png" class="casino-icon" alt="casino chip" />
      <span class="casino-title">FLOPATHON CASINO</span>
      <img src="https://cdn-icons-png.flaticon.com/512/616/616554.png" class="casino-icon" alt="casino chip" />
    </div>
    <div class="points-bar">
      <img src="https://cdn-icons-png.flaticon.com/512/138/138292.png" class="coin-icon" alt="coin" />
      <span class="points-label">Points: <b>{{ points }}</b></span>
      <img src="https://cdn-icons-png.flaticon.com/512/138/138292.png" class="coin-icon" alt="coin" />
    </div>
    <div class="volume-bar">
      <div class="volume-slider-wrap" @click="showDisappointment = true">
        <img src="https://cdn-icons-png.flaticon.com/512/727/727269.png" class="vol-icon" alt="volume" />
        <span>Volume: {{ volume }}</span>
        <input type="range" min="0" max="100" v-model="volume" disabled :class="{ 'disappointed': showDisappointment }" @animationend="showDisappointment = false" />
        <transition name="disappoint-fade">
          <div v-if="showDisappointment" class="disappoint-overlay">
            <img src="https://cdn-icons-png.flaticon.com/512/742/742751.png" class="disappoint-face" alt=":(" />
            <span class="disappoint-text">Nope! Use the storage box.</span>
          </div>
        </transition>
      </div>
    </div>
    <div class="casino-buttons">
      <button @click="showStorage = true"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046870.png" class="btn-icon" alt="box" /> Open Storage Box</button>
      <button @click="showStore = true"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png" class="btn-icon" alt="store" /> Open Store</button>
      <button @click="openEarnProgram"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046861.png" class="btn-icon" alt="earn" /> Open Earn Program</button>
    </div>
    <!-- Sparkle effect -->
    <div class="sparkle sparkle1"></div>
    <div class="sparkle sparkle2"></div>
    <div class="sparkle sparkle3"></div>
    <!-- Hidden YouTube Player -->
    <div style="width:0;height:0;overflow:hidden;position:absolute;">
      <div id="ytplayer"></div>
    </div>
    <div v-if="showStorage" class="modal">
      <div class="modal-content">
        <span class="close" @click="showStorage = false">&times;</span>
        <h3><img src="https://cdn-icons-png.flaticon.com/512/1046/1046870.png" class="modal-title-icon" alt="box" /> Storage Box</h3>
        <div class="storage-grid" :style="storageGridStyle">
          <div v-for="(item, idx) in storageItems" :key="idx" class="slot" :style="slotStyle" @click="handleSlotClick(idx)">
            <span v-if="item" :style="slotTextStyle">
              <img v-if="item.type === ITEM_TYPES.LOOTBOX" src="https://cdn-icons-png.flaticon.com/512/1046/1046870.png" class="slot-icon" alt="lootbox" />
              <img v-else-if="item.type === ITEM_TYPES.KEY" src="https://cdn-icons-png.flaticon.com/512/1046/1046872.png" class="slot-icon" alt="key" />
              <img v-else-if="item.type === ITEM_TYPES.PLAY" src="https://cdn-icons-png.flaticon.com/512/727/727245.png" class="slot-icon" alt="play" />
              <img v-else-if="item.type === ITEM_TYPES.PAUSE" src="https://cdn-icons-png.flaticon.com/512/727/727245.png" class="slot-icon" alt="pause" style="filter: grayscale(1);" />
              <img v-else-if="item.type === ITEM_TYPES.SORT" src="https://cdn-icons-png.flaticon.com/512/1046/1046867.png" class="slot-icon" alt="sort" />
              <img v-else-if="item.type === ITEM_TYPES.YOUTUBE" src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" class="slot-icon" alt="youtube" />
              <img v-else-if="item.type === 'volume'" src="https://cdn-icons-png.flaticon.com/512/727/727269.png" class="slot-icon" alt="volume" />
              {{ getItemLabel(item) }}
            </span>
            <span v-else :style="emptyTextStyle"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046870.png" class="slot-icon empty" alt="empty" /> Empty</span>
            <div v-if="openLootBoxIdx === idx" class="lootbox-modal">
              <div>
                <img src="https://cdn-icons-png.flaticon.com/512/1046/1046870.png" class="lootbox-big" alt="lootbox" />
                <p class="lootbox-flash">Open this loot box?</p>
                <button :disabled="findKeyIdx() === -1" @click.stop="openLootBox(idx)"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046872.png" class="btn-icon" alt="key" /> Use Key to Open</button>
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
        <h3><img src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png" class="modal-title-icon" alt="store" /> Store</h3>
        <p><img src="https://cdn-icons-png.flaticon.com/512/138/138292.png" class="coin-icon" alt="coin" /> Points: <b>{{ points }}</b></p>
        <button @click="buyLootBox" :disabled="points < 3"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046870.png" class="btn-icon" alt="lootbox" /> Buy Loot Box (3 pts)</button>
        <button @click="buyKey" :disabled="points < 10"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046872.png" class="btn-icon" alt="key" /> Buy Key (10 pts)</button>
        <button @click="increaseStorage" :disabled="points < 8"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046871.png" class="btn-icon" alt="expand" /> Increase Storage Size (8 pts)</button>
        <p>Storage Size: <b>{{ storageSize }}</b></p>
        <p>Loot Boxes: <img src="https://cdn-icons-png.flaticon.com/512/1046/1046870.png" class="coin-icon" alt="lootbox" /> <b>{{ lootBoxCount }}</b></p>
        <p>Keys: <img src="https://cdn-icons-png.flaticon.com/512/1046/1046872.png" class="coin-icon" alt="key" /> <b>{{ keyCount }}</b></p>
      </div>
    </div>
    <!-- Earn Program Modal -->
    <div v-if="showEarnModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showEarnModal = false">&times;</span>
        <h3><img src="https://cdn-icons-png.flaticon.com/512/1046/1046861.png" class="modal-title-icon" alt="earn" /> Earn Points</h3>
        <p class="earn-q"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046861.png" class="earn-icon" alt="earn" /> {{ earnQuestions[earnIdx].q }}</p>
        <input v-model="earnAnswer" :disabled="earnAwarded" placeholder="Your answer..." />
        <button @click="submitEarnAnswer" :disabled="earnAwarded || !earnAnswer.trim()"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046861.png" class="btn-icon" alt="earn" /> Submit</button>
        <p v-if="earnAwarded" class="earn-award"><img src="https://cdn-icons-png.flaticon.com/512/138/138292.png" class="coin-icon" alt="coin" /> You earned <b>{{ earnQuestions[earnIdx].points }}</b> points!</p>
        <button v-if="earnAwarded" @click="nextEarnQuestion"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046867.png" class="btn-icon" alt="next" /> Continue</button>
        <p v-if="earnAwarded && earnIdx === earnQuestions.length - 1" style="color:blue; font-weight:bold; font-size:1.2rem;"><img src="https://cdn-icons-png.flaticon.com/512/1046/1046861.png" class="earn-icon" alt="earn" /> All questions complete!</p>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, computed, onMounted, watch } from 'vue';

// --- Disappointment Animation State ---
const showDisappointment = ref(false);

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
  // Do not reset state here; preserve progress
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
    // All questions complete, just close modal, do not reset progress
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
  background: linear-gradient(135deg, #2d001f 0%, #ff003c 100%);
  min-height: 100vh;
  padding-bottom: 60px;
  position: relative;
  overflow-x: hidden;
}
.casino-bg {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 0;
  background: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat;
  opacity: 0.18;
  pointer-events: none;
}
.casino-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  font-size: 2.7rem;
  color: #ffd700;
  text-shadow: 0 0 16px #ff003c, 0 0 32px #fffbe6;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
  z-index: 2;
}
.casino-title {
  margin: 0 1.2rem;
}
.casino-icon {
  width: 48px;
  height: 48px;
  margin: 0 0.2rem;
  filter: drop-shadow(0 0 8px #ffd700);
}
.points-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #ffd700;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  margin-bottom: 0.5rem;
  z-index: 2;
}
.points-label {
  margin: 0 0.7rem;
}
.coin-icon {
  width: 32px;
  height: 32px;
  margin: 0 0.2rem;
  vertical-align: middle;
  filter: drop-shadow(0 0 8px #ffd700);
}
.volume-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  z-index: 2;
}
.vol-icon {
  width: 28px;
  height: 28px;
  margin-right: 0.5rem;
  filter: drop-shadow(0 0 6px #ffd700);
}
.casino-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
  z-index: 2;
}
.btn-icon {
  width: 24px;
  height: 24px;
  margin-right: 0.4rem;
  vertical-align: middle;
  filter: drop-shadow(0 0 6px #ffd700);
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: casino-fadein 0.7s;
}
@keyframes casino-fadein {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-content {
  background: linear-gradient(135deg, #fffbe6 0%, #ffd700 100%);
  box-shadow: 0 0 40px 10px #ff003c, 0 0 0 8px #ffd700 inset;
  border-radius: 18px;
  border: 4px solid #d40000;
  width: 520px;
  height: 420px;
  min-width: unset;
  min-height: unset;
  max-width: 520px;
  max-height: 420px;
  text-align: center;
  position: relative;
  animation: casino-pop 0.5s;
  z-index: 1001;
}
@keyframes casino-pop {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}
.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 2.2rem;
  cursor: pointer;
  color: #d40000;
  text-shadow: 0 0 8px #fff, 0 0 16px #ffd700;
  transition: color 0.2s;
  z-index: 1002;
}
.close:hover {
  color: #ff003c;
}
.modal-title-icon {
  width: 36px;
  height: 36px;
  margin-right: 0.5rem;
  vertical-align: middle;
  filter: drop-shadow(0 0 8px #ffd700);
}
.storage-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
  margin-top: 1.5rem;
}
.slot {
  background: linear-gradient(135deg, #ffd700 0%, #ff003c 100%);
  border: 3px solid #fffbe6;
  border-radius: 12px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #2d001f;
  font-weight: bold;
  box-shadow: 0 0 12px 2px #ffd700, 0 0 0 4px #ff003c inset;
  position: relative;
  transition: transform 0.1s, box-shadow 0.1s;
  cursor: pointer;
  animation: slot-glow 2s infinite alternate;
  overflow: hidden;
}
.slot:hover {
  transform: scale(1.08) rotate(-2deg);
  box-shadow: 0 0 24px 6px #fffbe6, 0 0 0 6px #ffd700 inset;
}
@keyframes slot-glow {
  0% { box-shadow: 0 0 12px 2px #ffd700, 0 0 0 4px #ff003c inset; }
  100% { box-shadow: 0 0 32px 8px #ff003c, 0 0 0 8px #ffd700 inset; }
}
.slot-icon {
  width: 32px;
  height: 32px;
  margin-right: 0.3rem;
  vertical-align: middle;
  filter: drop-shadow(0 0 6px #fffbe6);
}
.slot-icon.empty {
  opacity: 0.3;
  filter: grayscale(1) drop-shadow(0 0 2px #fffbe6);
}
.lootbox-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.1);
  background: linear-gradient(135deg, #fffbe6 0%, #ffd700 100%);
  border: 3px solid #ff003c;
  border-radius: 16px;
  box-shadow: 0 0 24px 6px #ffd700, 0 0 0 8px #ff003c inset;
  padding: 1.2rem 2rem;
  z-index: 10;
  animation: lootbox-pop 0.5s;
  text-align: center;
}
.lootbox-big {
  width: 64px;
  height: 64px;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 12px #ffd700);
}
.lootbox-flash {
  font-size: 1.3rem;
  color: #d40000;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 8px #ffd700, 0 0 16px #fffbe6;
  margin-bottom: 0.7rem;
  animation: flash-text 1s infinite alternate;
}
@keyframes lootbox-pop {
  0% { transform: translate(-50%, -50%) scale(0.7); opacity: 0; }
  80% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.1); }
}
@keyframes flash-text {
  0% { color: #d40000; text-shadow: 0 0 8px #ffd700, 0 0 16px #fffbe6; }
  100% { color: #ffd700; text-shadow: 0 0 16px #d40000, 0 0 32px #fffbe6; }
}
.modal-content h3 {
  font-family: 'Luckiest Guy', cursive, sans-serif;
  font-size: 2.2rem;
  color: #d40000;
  text-shadow: 0 0 8px #ffd700, 0 0 16px #fffbe6;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.earn-q {
  font-size: 1.2rem;
  color: #d40000;
  font-weight: bold;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.earn-icon {
  width: 28px;
  height: 28px;
  margin-right: 0.5rem;
  filter: drop-shadow(0 0 6px #ffd700);
}
.earn-award {
  color: #008f00;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0.7rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
button {
  background: linear-gradient(90deg, #ffd700 0%, #ff003c 100%);
  color: #2d001f;
  font-weight: bold;
  border: 2px solid #fffbe6;
  border-radius: 10px;
  font-size: 1.1rem;
  padding: 0.5rem 1.5rem;
  margin: 0.5rem 0.5rem 0.5rem 0;
  box-shadow: 0 0 8px 2px #ffd700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.1s;
  outline: none;
  display: inline-flex;
  align-items: center;
}
button:active {
  transform: scale(0.96);
}
button:disabled {
  background: #ccc;
  color: #888;
  border: 2px solid #eee;
  box-shadow: none;
  cursor: not-allowed;
}
/* Volume slider disappointment wrapper */
.volume-slider-wrap {
  display: flex;
  align-items: center;
  position: relative;
  cursor: not-allowed;
  padding: 0.3rem 1.2rem 0.3rem 0.5rem;
  border-radius: 12px;
  transition: background 0.2s;
}
.volume-slider-wrap:hover {
  background: rgba(255, 215, 0, 0.08);
}
input[type="range"] {
  width: 260px;
  height: 16px;
  margin-bottom: 1rem;
  background: transparent;
  border-radius: 8px;
  box-shadow: 0 0 8px 2px #ffd700, 0 0 0 4px #ff003c inset;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  z-index: 2;
  transition: box-shadow 0.2s;
}
input[type="range"].disappointed {
  animation: slider-shake 0.5s;
  box-shadow: 0 0 16px 4px #ff003c, 0 0 0 8px #ffd700 inset;
}
@keyframes slider-shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-8px); }
  80% { transform: translateX(8px); }
  100% { transform: translateX(0); }
}
.disappoint-overlay {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  z-index: 10;
}
.disappoint-face {
  width: 48px;
  height: 48px;
  margin-bottom: 0.2rem;
  filter: drop-shadow(0 0 8px #ff003c);
}
.disappoint-text {
  color: #d40000;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  font-size: 1.1rem;
  text-shadow: 0 0 8px #fffbe6, 0 0 16px #ffd700;
  background: rgba(255,255,255,0.85);
  border-radius: 8px;
  padding: 0.2rem 0.8rem;
  margin-top: 0.1rem;
}
.disappoint-fade-enter-active, .disappoint-fade-leave-active {
  transition: opacity 0.3s;
}
.disappoint-fade-enter-from, .disappoint-fade-leave-to {
  opacity: 0;
}
.disappoint-fade-enter-to, .disappoint-fade-leave-from {
  opacity: 1;
}
input[type="range"]::-webkit-slider-runnable-track {
  height: 14px;
  background: linear-gradient(90deg, #ffd700 0%, #ff003c 100%);
  border-radius: 8px;
  box-shadow: 0 0 8px #ffd700, 0 0 0 2px #fffbe6 inset;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle, #fffbe6 60%, #ffd700 100%);
  border: 3px solid #ff003c;
  box-shadow: 0 0 12px 2px #ffd700, 0 0 0 4px #ff003c inset;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  margin-top: -7px;
}
input[type="range"]:disabled::-webkit-slider-thumb {
  background: #eee;
  border: 3px solid #ccc;
  box-shadow: none;
}
input[type="range"]::-ms-fill-lower {
  background: #ffd700;
  border-radius: 8px;
}
input[type="range"]::-ms-fill-upper {
  background: #ff003c;
  border-radius: 8px;
}
input[type="range"]::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle, #fffbe6 60%, #ffd700 100%);
  border: 3px solid #ff003c;
  box-shadow: 0 0 12px 2px #ffd700, 0 0 0 4px #ff003c inset;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
}
input[type="range"]:disabled::-moz-range-thumb {
  background: #eee;
  border: 3px solid #ccc;
  box-shadow: none;
}
input[type="range"]::-moz-range-track {
  height: 14px;
  background: linear-gradient(90deg, #ffd700 0%, #ff003c 100%);
  border-radius: 8px;
  box-shadow: 0 0 8px #ffd700, 0 0 0 2px #fffbe6 inset;
}
input[type="range"]::-ms-thumb {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle, #fffbe6 60%, #ffd700 100%);
  border: 3px solid #ff003c;
  box-shadow: 0 0 12px 2px #ffd700, 0 0 0 4px #ff003c inset;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
}
input[type="range"]:disabled::-ms-thumb {
  background: #eee;
  border: 3px solid #ccc;
  box-shadow: none;
}
input[type="range"]:focus {
  outline: none;
  border: none;
}
input[type="range"]::-ms-tooltip {
  display: none;
}
input[type="text"], input[type="password"], input[type="email"], input[type="number"], input[type="search"] {
  border: 2px solid #ffd700;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  background: #fffbe6;
  color: #2d001f;
  box-shadow: 0 0 8px 2px #ffd700 inset;
  outline: none;
  transition: border 0.2s;
}
input:focus {
  border: 2px solid #ff003c;
}
/* Sparkle casino effect */
.sparkle {
  position: fixed;
  pointer-events: none;
  z-index: 2000;
  width: 60px;
  height: 60px;
  background: url('https://cdn.pixabay.com/photo/2013/07/12/13/57/star-147615_1280.png') center/contain no-repeat;
  opacity: 0.7;
  animation: sparkle-move 3s infinite linear;
}
.sparkle1 { top: 10%; left: 10%; animation-delay: 0s; }
.sparkle2 { top: 60%; left: 80%; animation-delay: 1s; }
.sparkle3 { top: 80%; left: 30%; animation-delay: 2s; }
@keyframes sparkle-move {
  0% { opacity: 0.7; transform: scale(1) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
  100% { opacity: 0.7; transform: scale(1) rotate(360deg); }
}
/* Casino font for headings */
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');
</style>