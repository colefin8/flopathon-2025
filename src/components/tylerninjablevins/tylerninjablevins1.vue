<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
// import * as Tone from 'tone'; // Remove Tone.js import

// --- Reactive State Variables ---
const keys = ref(3); // Starting keys
const maxKeys = 5; // Max keys user can hold
const keyRegenCooldown = 30; // Seconds to regenerate one key
const currentRegenTime = ref(keyRegenCooldown);
const isRegenActive = ref(false);

const volume = ref(50); // Displayed volume (will be set by loot box)
const actualVolume = ref(50); // Actual audio volume (0-100)
const isMuted = ref(false);
const lootBoxResult = ref("Open a box to find out!"); // Message after opening a box
const isOpeningBox = ref(false); // Controls opening animation/state

// Visual chaos for the "slider" which is no longer directly controllable
const sliderPosition = ref(50); // Reflects 'volume'
const sliderOrientation = ref('horizontal');
const sliderShift = ref({ x: 0, y: 0 });
const flickerVisible = ref(true);

// Template refs
const youtubePlayerContainerRef = ref(null); // Ref for the YouTube player div

// Internal refs for YouTube Player
let youtubePlayer = null; // YouTube player instance

const YOUTUBE_VIDEO_ID = 'dQw4w9WgXcQ'; // Example YouTube video ID (Rick Astley - Never Gonna Give You Up)
const YOUTUBE_PLAYER_WIDTH = 1; // Set to 1px to hide the player visually
const YOUTUBE_PLAYER_HEIGHT = 1; // Set to 1px to hide the player visually

// --- YouTube Player API Loading and Initialization ---
// Define the global callback function that the YouTube API will call
const initYoutubePlayer = () => {
  youtubePlayer = new window.YT.Player(youtubePlayerContainerRef.value, {
    videoId: YOUTUBE_VIDEO_ID,
    width: YOUTUBE_PLAYER_WIDTH,
    height: YOUTUBE_PLAYER_HEIGHT,
    playerVars: {
      autoplay: 1, // Autoplay the video
      controls: 0, // Hide YouTube controls
      loop: 1, // Loop the video
      playlist: YOUTUBE_VIDEO_ID, // Required for loop to work with a single video
      disablekb: 1, // Disable keyboard controls
      modestbranding: 1, // Hide YouTube logo
      rel: 0, // Do not show related videos
      playsinline: 1, // Play inline on iOS
    },
    events: {
      onReady: (event) => {
        event.target.setVolume(actualVolume.value); // Set initial volume
        if (isMuted.value) {
          event.target.mute();
        } else {
          event.target.unMute();
        }
        event.target.playVideo(); // Ensure video plays
        console.log("YouTube Player Ready and playing.");
      },
      onStateChange: (event) => {
        // If video ends, and loop is 1, it should restart automatically
        // This can be used for debugging player state if needed
      }
    }
  });
};

onMounted(() => {
  window.onYouTubeIframeAPIReady = initYoutubePlayer; // Define global callback FIRST

  if (window.YT && window.YT.Player) { // Check if API is already loaded
    initYoutubePlayer(); // If loaded, initialize immediately
  } else {
    // Otherwise, load the script
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // Start key regeneration
  startKeyRegen();
});

// Watch for changes in actualVolume or isMuted to update YouTube player volume
watch([actualVolume, isMuted], ([newActualVolume, newIsMuted]) => {
  // Update YouTube player volume
  if (youtubePlayer && typeof youtubePlayer.setVolume === 'function') {
    youtubePlayer.setVolume(newActualVolume);
    if (newIsMuted) {
      youtubePlayer.mute();
    } else {
      youtubePlayer.unMute();
    }
  }
});

// Clean up YouTube Player on component unmount
onUnmounted(() => {
  if (youtubePlayer && typeof youtubePlayer.destroy === 'function') {
    youtubePlayer.destroy(); // Destroy the YouTube player instance
  }
  // Remove the global callback to prevent issues if component remounts
  delete window.onYouTubeIframeAPIReady;
});

// --- Key Regeneration Logic ---
let regenInterval = null;
const startKeyRegen = () => {
  if (isRegenActive.value) return;
  isRegenActive.value = true;
  regenInterval = setInterval(() => {
    if (keys.value < maxKeys) {
      currentRegenTime.value--;
      if (currentRegenTime.value <= 0) {
        keys.value++;
        // keySound.triggerAttackRelease("C4", "8n"); // Tone.js sound removed
        currentRegenTime.value = keyRegenCooldown;
        if (keys.value >= maxKeys) {
          clearInterval(regenInterval);
          isRegenActive.value = false;
        }
      }
    } else {
      clearInterval(regenInterval);
      isRegenActive.value = false;
    }
  }, 1000);
};

// --- Terrible UX Effects ---

// 1. Ephemeral and Confusing Visuals: Flickering
onMounted(() => {
  const flickerInterval = setInterval(() => {
    flickerVisible.value = !flickerVisible.value;
  }, Math.random() * 500 + 100);
  onUnmounted(() => clearInterval(flickerInterval));
});

// 2. Ephemeral and Confusing Visuals: Random Orientation & Shift
onMounted(() => {
  const visualChaosInterval = setInterval(() => {
    if (Math.random() < 0.2) {
      sliderOrientation.value = (sliderOrientation.value === 'horizontal' ? 'vertical' : 'horizontal');
    }
    sliderShift.value = {
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10
    };
  }, 1000);
  onUnmounted(() => clearInterval(visualChaosInterval));
});

// 3. Contextual Chaos: Reset on focus/blur (simulated for app)
onMounted(() => {
  const handleWindowFocus = () => {
    const newVol = Math.floor(Math.random() * 101);
    volume.value = newVol;
    actualVolume.value = newVol;
    sliderPosition.value = newVol;
    isMuted.value = false;
    console.log("App focused, volume reset to random.");
    // Also reset YouTube player volume
    if (youtubePlayer && typeof youtubePlayer.setVolume === 'function') {
      youtubePlayer.setVolume(newVol);
      youtubePlayer.unMute();
    }
  };

  window.addEventListener('focus', handleWindowFocus);
  onUnmounted(() => window.removeEventListener('focus', handleWindowFocus));
});

// --- Loot Box Logic ---
const openLootBox = () => {
  if (keys.value <= 0 || isOpeningBox.value) {
    lootBoxResult.value = "Not enough keys or box already opening!";
    return;
  }

  keys.value--;
  isOpeningBox.value = true;
  // lootSound.triggerAttackRelease("C5", "8n"); // Tone.js sound removed

  // Start key regeneration if it was stopped
  if (!isRegenActive.value) {
    startKeyRegen();
  }

  setTimeout(() => {
    const rarity = Math.random();
    let newVolumeValue = actualVolume.value; // Default to no change
    let resultText = "";

    if (rarity < 0.6) { // Common: Random volume (0-100)
      newVolumeValue = Math.floor(Math.random() * 101);
      resultText = `Common: Volume set to ${newVolumeValue}!`;
    } else if (rarity < 0.85) { // Uncommon: Slightly more controlled volume (e.g., +/- 20)
      newVolumeValue = Math.max(0, Math.min(100, actualVolume.value + Math.floor(Math.random() * 41) - 20));
      resultText = `Uncommon: Volume changed to ${newVolumeValue}!`;
    } else if (rarity < 0.95) { // Rare: Mute Key (temporary or unreliable)
      isMuted.value = !isMuted.value; // Toggle mute
      resultText = `RARE! Mute Toggled! (Might not last...)`;
      if (!isMuted.value) { // If unmuted by this, set random volume
        newVolumeValue = Math.floor(Math.random() * 101);
        resultText += ` Now ${newVolumeValue}.`;
      }
    } else { // Legendary: Extreme volume (0 or 100)
      newVolumeValue = Math.random() < 0.5 ? 0 : 100;
      resultText = `LEGENDARY! Volume set to ${newVolumeValue}! Enjoy the silence/blast!`;
    }

    lootBoxResult.value = resultText;

    // Apply volume with a random delay (Terrible UX: Delayed Feedback)
    const delay = Math.random() * 3000 + 500; // 0.5 to 3.5 seconds delay
    setTimeout(() => {
      // Brief jump to extreme before settling (Terrible UX: Misleading Auditory Feedback)
      const jumpVolume = Math.random() < 0.5 ? 0 : 100;
      // if (popSynth) popSynth.triggerAttackRelease("8n"); // Tone.js sound removed

      // Directly update YouTube player volume
      if (youtubePlayer && typeof youtubePlayer.setVolume === 'function') {
        youtubePlayer.setVolume(jumpVolume); // Jump volume
        setTimeout(() => {
          youtubePlayer.setVolume(newVolumeValue); // Settle volume
          if (isMuted.value) { // Re-apply mute state if it was toggled
            youtubePlayer.mute();
          } else {
            youtubePlayer.unMute();
          }
        }, 200);
      }

      actualVolume.value = newVolumeValue;
      volume.value = newVolumeValue; // Update displayed volume
      sliderPosition.value = newVolumeValue; // Update visual slider
      isOpeningBox.value = false;
    }, delay);
  }, 1500); // Animation duration for opening box
};

// --- Computed Properties for Dynamic Styles ---
const sliderStyle = computed(() => ({
  transform: `translate(${sliderShift.value.x}px, ${sliderShift.value.y}px)`,
  opacity: flickerVisible.value ? 1 : 0.2,
  transition: 'opacity 0.1s ease-in-out, transform 0.1s ease-out',
}));

const handleStyle = computed(() => ({
  [sliderOrientation.value === 'horizontal' ? 'left' : 'bottom']: `${sliderPosition.value}%`,
  transform: sliderOrientation.value === 'horizontal'
    ? 'translateX(-50%)'
    : 'translateY(50%)',
}));

const fillStyle = computed(() => ({
  [sliderOrientation.value === 'horizontal' ? 'width' : 'height']: `${sliderPosition.value}%`,
  [sliderOrientation.value === 'horizontal' ? 'left' : 'bottom']: 0,
}));

// Computed class for slider track orientation
const sliderTrackClasses = computed(() => ({
  'slider-track-horizontal': sliderOrientation.value === 'horizontal',
  'slider-track-vertical': sliderOrientation.value === 'vertical',
}));

// Computed class for slider fill orientation
const sliderFillClasses = computed(() => ({
  'slider-fill-horizontal': sliderOrientation.value === 'horizontal',
  'slider-fill-vertical': sliderOrientation.value === 'vertical',
}));

const sliderHandleClasses = computed(() => ({
  // No dragging, so no scale-on-drag
}));
</script>

<template>
  <div class="app-container">
    <div class="card-container">
      <h1 class="main-title">
        The Loot Box Volume Control
      </h1>
      <p class="subtitle">
        Control your audio... if you're lucky. Volume is determined by opening loot boxes!
      </p>

      <div class="content-area">
        <!-- Volume Display -->
        <div class="volume-display">
          {{ isMuted ? 'MUTED' : actualVolume }}
        </div>

        <!-- Loot Box Result Display -->
        <div class="loot-result-display">
          {{ lootBoxResult }}
        </div>

        <!-- YouTube Player Container -->
        <!-- The YouTube iframe will be injected here by the API -->
        <div ref="youtubePlayerContainerRef" class="youtube-player-container-hidden"></div>


        <!-- Slider Track (Visual representation only, not interactive) -->
        <div
          ref="sliderRef"
          :class="['slider-track', sliderTrackClasses]"
          :style="sliderStyle"
        >
          <!-- Slider Fill -->
          <div
            class="slider-fill"
            :class="sliderFillClasses"
            :style="fillStyle"
          ></div>
          <!-- Slider Handle -->
          <div
            class="slider-handle"
            :class="sliderHandleClasses"
            :style="handleStyle"
          ></div>
        </div>

        <!-- Key Counter -->
        <div class="key-counter">
          Keys: {{ keys }} / {{ maxKeys }}
          <span v-if="keys < maxKeys && isRegenActive" class="key-regen-info">
            (Next in {{ currentRegenTime }}s)
          </span>
        </div>

        <!-- Open Loot Box Button -->
        <button
          @click="openLootBox"
          :disabled="keys <= 0 || isOpeningBox"
          class="loot-box-button"
        >
          {{ isOpeningBox ? 'Opening...' : 'Open Loot Box!' }}
        </button>
      </div>
      <p class="warning-text">
        (Warning: This is intentionally bad UX for a hackathon. Do not use in production!)
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Global/Layout */
.app-container {
  min-height: 100vh;
  background-color: #1a202c; /* bg-gray-900 */
  color: #f7fafc; /* text-gray-100 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem; /* p-4 */
  font-family: 'Inter', sans-serif; /* font-inter */
}

/* Card Container */
.card-container {
  background-color: #2d3748; /* bg-gray-800 */
  padding: 2rem; /* p-8 */
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
  border: 1px solid #4a5568; /* border border-gray-700 */
  width: 100%; /* w-full */
  max-width: 28rem; /* max-w-md */
}

/* Headings/Text */
.main-title {
  font-size: 1.875rem; /* text-3xl */
  line-height: 2.25rem; /* text-3xl */
  font-weight: 700; /* font-bold */
  text-align: center; /* text-center */
  margin-bottom: 1.5rem; /* mb-6 */
  color: #fc8181; /* text-red-400 */
}

.subtitle {
  text-align: center; /* text-center */
  color: #cbd5e0; /* text-gray-400 */
  margin-bottom: 2rem; /* mb-8 */
}

.warning-text {
  text-align: center; /* text-center */
  color: #a0aec0; /* text-gray-500 */
  margin-top: 2rem; /* mt-8 */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem; /* text-sm */
}

.volume-display {
  font-size: 2.25rem; /* text-4xl */
  line-height: 2.5rem; /* text-4xl */
  font-weight: 800; /* font-extrabold */
  color: #f7fafc; /* text-white */
}

.loot-result-display {
  font-size: 1.125rem; /* text-lg */
  line-height: 1.75rem; /* text-lg */
  color: #f6e05e; /* text-yellow-400 */
  font-weight: 600; /* font-semibold */
  height: 2rem; /* h-8 */
  text-align: center; /* text-center */
}

.key-counter {
  font-size: 1.25rem; /* text-xl */
  line-height: 1.75rem; /* text-xl */
  color: #90cdf4; /* text-blue-300 */
}

.key-regen-info {
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem; /* text-sm */
  color: #a0aec0; /* text-gray-400 */
  margin-left: 0.5rem; /* ml-2 */
}

/* Content Area (flex container for internal elements) */
.content-area {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* space-y-6 equivalent, apply margin-top to children except first */
}
.content-area > *:not(:first-child) {
  margin-top: 1.5rem; /* space-y-6 */
}


/* Slider Track */
.slider-track {
  position: relative;
  background-color: #4a5568; /* bg-gray-700 */
  border-radius: 9999px; /* rounded-full */
  overflow: hidden;
  /* cursor-grab and active:cursor-grabbing are handled via JS/inline for simplicity */
}

.slider-track-horizontal {
  width: 100%; /* w-full */
  height: 1rem; /* h-4 */
}

.slider-track-vertical {
  height: 16rem; /* h-64 */
  width: 1rem; /* w-4 */
}

/* Slider Fill */
.slider-fill {
  position: absolute;
  background-color: #e53e3e; /* bg-red-600 */
  border-radius: 9999px; /* rounded-full */
}

.slider-fill-horizontal {
  height: 100%; /* h-full */
}

.slider-fill-vertical {
  width: 100%; /* w-full */
}

/* Slider Handle */
.slider-handle {
  position: absolute;
  width: 1.5rem; /* w-6 */
  height: 1.5rem; /* h-6 */
  background-color: #fc8181; /* bg-red-400 */
  border-radius: 9999px; /* rounded-full */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  border: 2px solid #feb2b2; /* border-2 border-red-200 */
  transition: transform 0.075s ease-out; /* transition-transform duration-75 ease-out */
}

/* Button */
.loot-box-button {
  padding: 1rem 2rem; /* px-8 py-4 */
  background-color: #6b46c1; /* bg-purple-700 */
  color: #fff; /* text-white */
  font-weight: 700; /* font-bold */
  font-size: 1.25rem; /* text-xl */
  line-height: 1.75rem; /* text-xl */
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  transition: all 0.15s ease-in-out; /* transition-all duration-150 ease-in-out */
  border: none; /* Remove default button border */
  cursor: pointer; /* Indicate clickable */
}

.loot-box-button:hover {
  background-color: #805ad5; /* hover:bg-purple-600 */
  transform: scale(1.05); /* hover:scale-105 */
}

.loot-box-button:focus {
  outline: none; /* focus:outline-none */
  box-shadow: 0 0 0 3px rgba(128, 90, 240, 0.5); /* focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 */
}

.loot-box-button:disabled {
  opacity: 0.5; /* disabled:opacity-50 */
  cursor: not-allowed; /* disabled:cursor-not-allowed */
}

/* YouTube Player Container Styling */
.youtube-player-container-hidden { /* Changed class name to reflect hidden state */
  position: absolute; /* Position absolutely to take it out of normal flow */
  left: -9999px; /* Move far off-screen */
  top: -9999px; /* Move far off-screen */
  width: 1px; /* Minimal width */
  height: 1px; /* Minimal height */
  overflow: hidden; /* Ensure nothing is visible */
}
</style>
