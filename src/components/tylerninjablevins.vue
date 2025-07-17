<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
// Countdown for next free lootbox
const nextLootboxCountdown = ref(60);
const nextLootboxCountdownText = computed(() => {
  const min = Math.floor(nextLootboxCountdown.value / 60);
  const sec = nextLootboxCountdown.value % 60;
  if (min > 0) {
    return `${min}m ${sec}s`;
  } else {
    return `${sec}s`;
  }
});
let lootboxInterval = null;

onMounted(() => {
  lootboxInterval = setInterval(() => {
    nextLootboxCountdown.value--;
    if (nextLootboxCountdown.value <= 0) {
      const emptySlot = backpack.value.findIndex(slot => slot === null);
      if (emptySlot !== -1) {
        addToBackpack({
          name: 'Loot Box',
          icon: '🎁',
          itemType: ITEM_TYPES.LOOTBOX,
        });
      }
      nextLootboxCountdown.value = 60;
    }
  }, 1000);
});
onUnmounted(() => {
  if (lootboxInterval) clearInterval(lootboxInterval);
});

// Backpack state: dynamic slots, starts at 15
const INITIAL_SLOTS = 15;
const backpackSize = ref(INITIAL_SLOTS);
const backpack = ref([]);

// Currency state
const blevCoins = ref(100000000000);
const blevCoinsFormatted = computed(() => blevCoins.value.toLocaleString());

// Ensure backpack always has at least backpackSize slots
function ensureBackpackSize() {
  while (backpack.value.length < backpackSize.value) {
    backpack.value.push(null);
  }
}
ensureBackpackSize();
let nextBackpackId = 1;

function expandBackpack() {
  backpackSize.value += INITIAL_SLOTS;
  ensureBackpackSize();
}

// For selecting items for lootbox opening
const selectedKeyIndex = ref(null);
const selectedLootboxIndex = ref(null);
const selectedVolumeIndex = ref(null);
const airhornSound = ref(null);
const vineboomSound = ref(null);
const lowTaperFadeSound = ref(null);

const blevsterImages = ref([
  '/Blevsters/TheBlevster.jpg',
  '/Blevsters/Blevster3.jpg',
  '/Blevsters/Blevster2.jpg',
  '/Blevsters/Blevster1.jpg'

]);
const currentBlevsterImageIndex = ref(0);

// // Inactivity timer with popup
// let inactivityTimer = null;
// const showAngryBlevPopup = ref(false);
// function resetInactivityTimer() {
//   clearTimeout(inactivityTimer);
//   inactivityTimer = setTimeout(() => {
//     showAngryBlevPopup.value = true;
//     // Optionally reload after a delay
//     setTimeout(() => {
//       location.reload();
//     }, 2000);
//   }, 1000);
// }

// onMounted(() => {
//   window.addEventListener('mousemove', resetInactivityTimer);
//   resetInactivityTimer();
// });

// onUnmounted(() => {
//   window.removeEventListener('mousemove', resetInactivityTimer);
//   clearTimeout(inactivityTimer);
// });

// Item type definitions
const ITEM_TYPES = {
  VOLUME: 'volume',
  KEY: 'key',
  LOOTBOX: 'lootbox',
};

// Computed properties for item counts
const blevKeysCount = computed(() => backpack.value.filter(item => item && item.itemType === ITEM_TYPES.KEY).length);
const lootboxesOwnedCount = computed(() => backpack.value.filter(item => item && item.itemType === ITEM_TYPES.LOOTBOX).length);

function addToBackpack(item) {
  ensureBackpackSize();
  const emptyIdx = backpack.value.findIndex((slot, idx) => slot === null && idx < backpackSize.value);
  if (emptyIdx !== -1) {
    backpack.value[emptyIdx] = {
      id: nextBackpackId++,
      ...item
    };
  }
}

function selectItem(slotIdx) {
  const item = backpack.value[slotIdx];
  if (!item) return;

  if (item.itemType === ITEM_TYPES.KEY) {
    selectedKeyIndex.value = selectedKeyIndex.value === slotIdx ? null : slotIdx;
  } else if (item.itemType === ITEM_TYPES.LOOTBOX) {
    selectedLootboxIndex.value = selectedLootboxIndex.value === slotIdx ? null : slotIdx;
  } else if (item.itemType === ITEM_TYPES.VOLUME) {
    selectedVolumeIndex.value = selectedVolumeIndex.value === slotIdx ? null : slotIdx;
  }
}

// Set page volume when a volume item is selected
watch(selectedVolumeIndex, (newIdx) => {
  if (newIdx !== null && backpack.value[newIdx] && backpack.value[newIdx].itemType === ITEM_TYPES.VOLUME) {
    let volume = backpack.value[newIdx].value;
    // Clamp and normalize to [0,1]
    let normalized = Math.max(0, Math.min(1, volume / 100));
    // Set all audio elements on the page
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
      audio.volume = normalized;
    });
  }
});

const currentVolume = computed(() => {
  if (selectedVolumeIndex.value !== null && backpack.value[selectedVolumeIndex.value] && backpack.value[selectedVolumeIndex.value].itemType === ITEM_TYPES.VOLUME) {
    return backpack.value[selectedVolumeIndex.value].value;
  }
  return 100;
});

function getVolumeRarity(volumeLevel) {
  if ((volumeLevel >= 0 && volumeLevel <= 20) || (volumeLevel >= 80 && volumeLevel <= 100)) {
    return 'Common';
  } else if ((volumeLevel > 20 && volumeLevel <= 30) || (volumeLevel >= 70 && volumeLevel < 80)) {
    return 'Uncommon';
  } else if ((volumeLevel > 30 && volumeLevel <= 47.5) || (volumeLevel >= 52.5 && volumeLevel < 70)) {
    return 'Epic';
  } else if (volumeLevel > 47.5 && volumeLevel < 52.5) {
    return 'Legendary';
  }
  return 'Common';
}

// Lootbox
const isOpening = ref(false);
const openedItem = ref([]);

function openLootBox() {
  if (isOpening.value) return;

  if (selectedLootboxIndex.value === null) {
    alert("Please select a loot box to open.");
    return;
  }
  if (selectedKeyIndex.value === null) {
    alert("Please select a Blev Key to open the loot box.");
    return;
  }

  if (airhornSound.value) {
    airhornSound.value.currentTime = 0;
    airhornSound.value.play();
  }
  if (lowTaperFadeSound.value) {
    lowTaperFadeSound.value.currentTime = 0;
    lowTaperFadeSound.value.play();
  }

  // Consume a key and a lootbox
  backpack.value[selectedKeyIndex.value] = null;
  backpack.value[selectedLootboxIndex.value] = null;
  selectedKeyIndex.value = null;
  selectedLootboxIndex.value = null;
  
  isOpening.value = true;
  openedItem.value = [];

  // Simulate box opening animation
  setTimeout(() => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      let newItem;
      const existingVolumes = backpack.value.filter(item => item && item.itemType === ITEM_TYPES.VOLUME);

      if (existingVolumes.length > 0 && Math.random() < 0.66) {
        // 66% chance to get a duplicate
        const duplicateItem = existingVolumes[Math.floor(Math.random() * existingVolumes.length)];
        newItem = { ...duplicateItem };
        delete newItem.id; // remove old id, addToBackpack will add a new one
      } else {
        // Generate a new volume item
        const r = Math.random();
        const beta = Math.pow(Math.sin(r * Math.PI), 2);
        const volumeLevel = parseFloat((beta * 100).toFixed(2));

        newItem = {
            name: `Volume ${volumeLevel}`,
            icon: volumeLevel === 0 ? '🔇' : '🔊',
            itemType: ITEM_TYPES.VOLUME,
            value: volumeLevel,
            rarity: getVolumeRarity(volumeLevel)
        };
      }
      
      addToBackpack(newItem);
      items.push(newItem);
    }
    openedItem.value = items; // Show the revealed items
    isOpening.value = false;

    // Reset after showing the item for a bit
    setTimeout(() => {
      openedItem.value = [];
    }, 5000); // Show item for 5 seconds
  }, 2000); // 2 second opening animation
}

// Shop functions
function buyBlevKey() {
  if (blevCoins.value >= 50) {
    const emptySlot = backpack.value.findIndex(slot => slot === null);
    if (emptySlot === -1) {
        alert("Backpack is full!");
        return;
    }
    blevCoins.value -= 50;
    addToBackpack({
        name: 'Blev Key',
        icon: '🔑',
        itemType: ITEM_TYPES.KEY,
    });
  } else {
    alert("Not enough Blev Coins to buy a key!");
  }
}

function buyLootbox() {
  if (blevCoins.value >= 10) {
    const emptySlot = backpack.value.findIndex(slot => slot === null);
    if (emptySlot === -1) {
        alert("Backpack is full!");
        return;
    }
    blevCoins.value -= 10;
    addToBackpack({
        name: 'Loot Box',
        icon: '🎁',
        itemType: ITEM_TYPES.LOOTBOX,
    });
  } else {
    alert("Not enough Blev Coins to buy a loot box!");
  }
}

function buyBackpackExpansion() {
  if (blevCoins.value >= 100) {
    blevCoins.value -= 100;
    expandBackpack();
  } else {
    alert("Not enough Blev Coins to expand the backpack!");
  }
}

function sortBackpack() {
  const shuffledBackpack = [...backpack.value];

  // Fisher-Yates shuffle
  for (let i = shuffledBackpack.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledBackpack[i], shuffledBackpack[j]] = [shuffledBackpack[j], shuffledBackpack[i]];
  }

  backpack.value = shuffledBackpack;

  // Reset selections as indices are no longer valid
  selectedKeyIndex.value = null;
  selectedLootboxIndex.value = null;
  selectedVolumeIndex.value = null;
}

function blevsterClick() {
  if (vineboomSound.value) {
    vineboomSound.value.pause();
    vineboomSound.value.currentTime = 0;
    vineboomSound.value.play();
  }
  blevCoins.value++;
  currentBlevsterImageIndex.value = (currentBlevsterImageIndex.value + 1) % blevsterImages.value.length;
}

const questions = [
  {
    label: 'Do you like gaming?',
    model: ref(''),
  },
  {
    label: 'Do you like Fortnite?',
    model: ref(''),
  },
  {
    label: 'Do you like Tyler Ninja Blevins?',
    model: ref(''),
  },
  {
    label: 'Are you a true Blevins fan?',
    model: ref(''),
  },
  {
    label: 'What is your Full Name?',
    model: ref(''),
  },
  {
    label: 'What is your Email Address?',
    model: ref(''),
  },
  {
    label: 'What is your Date of Birth?',
    model: ref(''),
  },
  {
    label: 'What is your address?',
    model: ref(''),
  },
  {
    label: 'What is your Mother\'s Maiden Name?',
    model: ref(''),
  },
  {
    label: 'What is your First Car\'s Make and Model?',
    model: ref(''),
  },
  {
    label: 'Who was your childhood best friend?',
    model: ref(''),
  },
  {
    label: 'What is your social security number?',
    model: ref(''),
  },
];
const currentQuestionIndex = ref(0);

function nextQuestion() {
  const answer = questions[currentQuestionIndex.value].model.value.trim();
  if (!answer) {
    alert('Please enter an answer before continuing.');
    return;
  }
  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++;
  }
}

function submitAnswers() {
  // Only allow submit on last question
  const allFilled = questions.every(q => q.model.value.trim() !== '');
  if (questions.some(q => q.model.value)) {
    if (allFilled) {
      blevCoins.value += 1000;
      alert('Your answers have been submitted! You earned 1,000 Blev Coins!');
    } else {
      alert('Your answers have been submitted');
    }
    console.log({
      question1: questions[0].model.value,
      question2: questions[1].model.value,
      question3: questions[2].model.value,
      question4: questions[3].model.value,
      question5: questions[4].model.value,
      question6: questions[5].model.value,
      question7: questions[6].model.value,
    });
    questions.forEach(q => q.model.value = '');
    currentQuestionIndex.value = 0;
  } else {
    alert('Please fill out at least one answer.');
  }
}
</script>

<template>
  <div v-if="showAngryBlevPopup" class="angry-blev-popup">
    <img src="/ANGRYBLEV.jpg" alt="Angry Blev" class="angry-blev-img" />
    <div class="angry-blev-text">NOT ENOUGH MOVEMENT</div>
  </div>
  <div class="current-volume-module">
    <span class="current-volume-icon">🔊</span>
    <span class="current-volume-label">Current Volume:</span>
    <span class="current-volume-value">
      {{ currentVolume + '%' }}
    </span>
  </div>
  <div class="main-container">
    <div class="left-column">
      <div class="module-section">
        <h2 class="module-title">Backpack</h2>
        <div class="backpack-grid">
          <div
            v-for="idx in backpackSize"
            :key="'slot-' + (idx-1)"
            class="backpack-item"
            :class="{ 
              'backpack-empty': !backpack[idx-1], 
              'selected-key': selectedKeyIndex === (idx-1),
              'selected-lootbox': selectedLootboxIndex === (idx-1),
              'selected-volume': selectedVolumeIndex === (idx-1),
              'rarity-common': backpack[idx-1] && backpack[idx-1].rarity === 'Common',
              'rarity-uncommon': backpack[idx-1] && backpack[idx-1].rarity === 'Uncommon',
              'rarity-epic': backpack[idx-1] && backpack[idx-1].rarity === 'Epic',
              'rarity-legendary': backpack[idx-1] && backpack[idx-1].rarity === 'Legendary'
            }"
            @click="selectItem(idx-1)"
            :title="backpack[idx-1] ? 'Click to select' : ''"
          >
            <template v-if="backpack[idx-1]">
              <span class="backpack-icon">{{ backpack[idx-1].icon }}</span>
              <span v-if="backpack[idx-1].itemType === ITEM_TYPES.VOLUME" class="backpack-item-value">{{ backpack[idx-1].value }}</span>
              <span class="backpack-type" :class="'type-' + backpack[idx-1].itemType">
                {{
                  backpack[idx-1].itemType === ITEM_TYPES.VOLUME ? 'Volume' :
                  backpack[idx-1].itemType === ITEM_TYPES.KEY ? 'Key' :
                  backpack[idx-1].itemType === ITEM_TYPES.LOOTBOX ? 'Lootbox' : ''
                }}
              </span>
            </template>
            <template v-else>
              <span class="backpack-empty-slot">Empty</span>
            </template>
          </div>
        </div>
        <div class="key-display" style="color:#f6e05e; font-weight:700; justify-content:center; margin-top: 1rem;">
          Next free lootbox in: {{ nextLootboxCountdownText }}
        </div>
        <div class="backpack-controls">
          <button @click="sortBackpack" class="backpack-sort-button">Sort</button>
          <div v-if="selectedVolumeIndex !== null" class="volume-display">
            Selected Volume: {{ backpack[selectedVolumeIndex].value }}
          </div>
        </div>
      </div>
    </div>
    <div class="middle-column">
        <div class="module-section">
          <h2 class="module-title">Loot Box</h2>
          <div class="lootbox-content">
            <div class="key-display">
                <span>🔑</span> You have: {{ blevKeysCount }} Blev Keys
            </div>
            <div class="key-display">
                <span>📦</span> You have: {{ lootboxesOwnedCount }} Boxes
            </div>
            <!-- Next free lootbox text moved to backpack section above -->
            <button @click="openLootBox" class="lootbox-button" :disabled="isOpening || selectedKeyIndex === null || selectedLootboxIndex === null">
              {{ isOpening ? 'Opening...' : 'Open Loot Box' }}
            </button>
            <div class="lootbox-animation-area">
              <div class="box-container" :class="{ 'box-shaking': isOpening }">🎁</div>
              <div v-if="openedItem.length" class="item-reveal">
                <div v-for="item in openedItem" :key="item.id" class="revealed-item-card" :class="{
                  'rarity-common': item.rarity === 'Common',
                  'rarity-uncommon': item.rarity === 'Uncommon',
                  'rarity-epic': item.rarity === 'Epic',
                  'rarity-legendary': item.rarity === 'Legendary'
                }">
                  <span class="backpack-icon">{{ item.icon }}</span>
                  <span v-if="item.itemType === ITEM_TYPES.VOLUME" class="backpack-item-value">{{ item.value }}</span>
                  <span class="backpack-type" :class="'type-' + item.itemType">
                    {{
                      item.itemType === ITEM_TYPES.VOLUME ? 'Volume' :
                      item.itemType === ITEM_TYPES.KEY ? 'Key' :
                      item.itemType === ITEM_TYPES.LOOTBOX ? 'Lootbox' : ''
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="module-section">
            <div class="currency-display">
                <span class="coin-icon">🪙</span>
                <span class="coin-amount">{{ blevCoinsFormatted }} Blev Coins</span>
            </div>
        </div>
        <div class="blevster-container">
            <div @click="blevsterClick" class="blevster-image" :style="{ backgroundImage: `url(${blevsterImages[currentBlevsterImageIndex]})` }"></div>
        </div>
    </div>
    <div class="right-column">
        <div class="module-section">
            <h2 class="module-title">Shop</h2>
            <div class="shop-content">
                <div class="shop-item">
                    <span>Buy Blev Key (50 Coins)</span>
                    <button @click="buyBlevKey" class="shop-button">Buy</button>
                </div>
                <div class="shop-item">
                    <span>Buy Loot Box (10 Coins)</span>
                    <button @click="buyLootbox" class="shop-button">Buy</button>
                </div>
                <div class="shop-item">
                    <span>Expand Backpack (100 Coins)</span>
                    <button @click="buyBackpackExpansion" class="shop-button">Buy</button>
                </div>
            </div>
        </div>
        <div class="module-section">
          <h2 class="module-title">Questionnaire</h2>
          <div class="questionnaire-advert" style="margin-bottom: 1rem; color: #f6e05e; font-weight: 700; text-align: center;">
            Complete the questionnaire below and earn <span style="color:#f6e05e;">1,000 Blev Coins</span> for fully filling it out!
          </div>
          <div class="questionnaire-content">
            <div class="question">
              <label>{{ questions[currentQuestionIndex].label }}</label>
              <input type="text" v-model="questions[currentQuestionIndex].model.value" class="questionnaire-input" @keyup.enter="currentQuestionIndex === questions.length - 1 ? submitAnswers() : nextQuestion()" />
            </div>
            <div style="display: flex; justify-content: flex-end;">
              <button v-if="currentQuestionIndex < questions.length - 1" @click="nextQuestion" class="shop-button">Next</button>
              <button v-else @click="submitAnswers" class="shop-button">Submit</button>
            </div>
          </div>
        </div>
    </div>
  </div>
  <audio ref="airhornSound" src="/airhorn.mp3" preload="auto"></audio>
  <audio ref="vineboomSound" src="/vineboom.mp3" preload="auto"></audio>
  <audio ref="lowTaperFadeSound" src="/imagine-if-ninja-got-a-low-taper-fade.mp3" preload="auto"></audio>
</template>


<style scoped>
.angry-blev-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.angry-blev-img {
  width: 320px;
  height: auto;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 32px 8px #f6e05e;
}
.angry-blev-text {
  font-size: 3rem;
  font-weight: bold;
  color: #ff2e2e;
  text-align: center;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}
.current-volume-module {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #23263a;
  border-radius: 0.5rem;
  padding: 0.75rem 2.5rem;
  margin: 0 auto 1rem auto;
  width: 420px;
  max-width: 90vw;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f6e05e;
  border: 1px solid #4a5568;
  box-sizing: border-box;
}
.current-volume-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}
.current-volume-label {
  margin-right: 0.5rem;
}
.current-volume-value {
  color: #fff;
  font-size: 1.1rem;
}

.main-container {
  display: flex;
  gap: 3.5rem;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  padding: 0 2.5rem;
  margin-top: 4.5rem;
}

.left-column {
  display: flex;
  flex-direction: column;
  row-gap: 3.5rem;
  width: 350px;
  min-width: 350px;
}
.middle-column,
.right-column {
  display: flex;
  flex-direction: column;
  row-gap: 3.5rem;
}

.middle-column {
    display: flex;
    flex-direction: column;
    align-items: center;
}
/* Currency display styles */
.currency-display {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f6e05e;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}
.coin-icon {
  font-size: 1.5rem;
}
.coin-amount {
  font-size: 1.1rem;
}
.module-section {
  /* margin removed to avoid double vertical spacing, spacing is now controlled by column gap */
  width: 100%;
  background: #23263a;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #4a5568;
  align-self: flex-start;
}
.backpack-section {
  margin: 2rem 0;
  width: 100%;
  max-width: 22rem;
}
.module-title {
  font-size: 1.25rem;
  color: #f6e05e;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-align: center;
}
.backpack-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  background: #23263a;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #4a5568;
  width: 320px;
  min-width: 320px;
  height: auto;
}
.backpack-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #373a4d;
  border-radius: 0.5rem;
  padding: 0.5rem;
  position: relative;
  min-width: 0;
  cursor: pointer;
  transition: box-shadow 0.1s;
  aspect-ratio: 1 / 1;
  border: 2px solid transparent;
}
.backpack-empty {
  background: transparent;
  border: 1px dashed #4a5568;
}
.backpack-empty-slot {
  color: #4a5568;
  font-size: 0.9rem;
}
.selected-key,
.selected-lootbox,
.selected-volume {
  border-color: white !important;
}
.backpack-icon {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.backpack-item-value {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.backpack-type {
  font-size: 0.8rem;
  margin-top: 0.2rem;
  padding: 0.1rem 0.4rem;
  border-radius: 0.5rem;
  display: inline-block;
  font-weight: 600;
}
.type-volume {
  background: #4299e1;
  color: #fff;
}
.type-key {
  background: #f6e05e;
  color: #23263a;
}
.type-lootbox {
  background: #dd6b20;
  color: #fff;
}
.volume-display {
  margin-top: 1rem;
  text-align: center;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
}
.backpack-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
.backpack-sort-button {
  background: #6b46c1;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.backpack-sort-button:hover {
  background: #805ad5;
}
.backpack-controls button {
  background: #6b46c1;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.backpack-controls button:hover {
  background: #805ad5;
}

.lootbox-section, .shop-section {
  margin-top: 2rem;
  width: 100%;
  max-width: 18rem;
  background: #23263a;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #4a5568;
  align-self: flex-start; /* Aligns to the top of the flex container */
}

.lootbox-title, .shop-title {
  font-size: 1.25rem;
  color: #f6e05e;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-align: center;
}

.lootbox-content, .shop-content {
  text-align: center;
  color: #cbd5e0;
}

.lootbox-button {
  background: #dd6b20;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 1rem;
  font-size: 1rem;
}

.lootbox-button:hover {
  background: #f6ad55;
}

.shop-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.key-display {
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.shop-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #373a4d;
    padding: 0.75rem;
    border-radius: 0.5rem;
}

.shop-button {
    background: #3182ce;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
}

.shop-button:hover {
    background: #4299e1;
}

.lootbox-button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.lootbox-animation-area {
  min-height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 1rem;
}

.box-container {
  font-size: 4rem;
}

.box-shaking {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

.item-reveal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #23263a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.5s;
  gap: 0.5rem;
}

.revealed-item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #373a4d;
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: 90px;
  aspect-ratio: 1 / 1;
  border: 2px solid;
}

.item-reveal-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

.blevster-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.blevster-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 3px solid #f6e05e;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.blevster-image:hover {
  transform: scale(1.05);
}

.blevster-image:active {
  transform: scale(0.95);
}

.rarity-common {
  border-color: #9ca3af; /* gray-400 */
}
.rarity-uncommon {
  border-color: #10b981; /* green-500 */
}
.rarity-epic {
  border-color: #8b5cf6; /* violet-500 */
}
.rarity-legendary {
  border-color: #f59e0b; /* amber-500 */
}

.right-column {
  display: flex;
  flex-direction: column;
  row-gap: 3.5rem;
  width: 350px;
  min-width: 350px;
}

.questionnaire-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
  color: #cbd5e0;
}

.questionnaire-input {
  background: #373a4d;
  color: #fff;
  border: 1px solid #4a5568;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 1rem;
}
</style>

<style>
body {
  background-image: url('/BlevFloss.gif');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}
</style>