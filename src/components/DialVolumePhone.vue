<script setup>
import { ref, computed } from 'vue'; // Import computed for dynamic styles

const enteredNumber = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const currentVolume = ref(null);

// State for card rotation based on cursor
const rotateX = ref(5); // Initial X rotation
const rotateY = ref(-5); // Initial Y rotation

// Dial pad keys (2-9)
const dialPadKeys = [
  { number: 2, letters: 'ABC' },
  { number: 3, letters: 'DEF' },
  { number: 4, letters: 'GHI' },
  { number: 5, letters: 'JKL' },
  { number: 6, letters: 'MNO' },
  { number: 7, letters: 'PQRS' },
  { number: 8, letters: 'TUV' },
  { number: 9, letters: 'WXYZ' },
];

const numberToLetterMap = {
  '2': ['a', 'b', 'c'],
  '3': ['d', 'e', 'f'],
  '4': ['g', 'h', 'i'],
  '5': ['j', 'k', 'l'],
  '6': ['m', 'n', 'o'],
  '7': ['p', 'q', 'r', 's'],
  '8': ['t', 'u', 'v'],
  '9': ['w', 'x', 'y', 'z'],
};

// Helper function to generate word representations of numbers 1-100
const generateNumberWordsMap = () => {
  const units = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const map = {};
  for (let i = 0; i <= 100; i++) {
    let word = '';
    if (i === 100) {
      word = 'onehundred';
    } else if (i < 10) {
      word = units[i];
    } else if (i >= 10 && i < 20) {
      word = teens[i - 10];
    } else {
      const tenDigit = Math.floor(i / 10);
      const unitDigit = i % 10;
      word = tens[tenDigit] + units[unitDigit];
    }
    map[word] = i;
  }
  return map;
};

const validNumberWords = generateNumberWordsMap();

const handleDial = (number) => {
  // Limiting input length to prevent excessively long sequences
  if (enteredNumber.value.length < 14) {
    enteredNumber.value += number;
  }
  clearMessages();
};

const clearMessages = () => {
  errorMessage.value = '';
  successMessage.value = '';
};

const getWordsFromNumbers = (numberSequence) => {
  if (!numberSequence) {
    return [];
  }

  let possibleWords = [''];

  for (let i = 0; i < numberSequence.length; i++) {
    const digit = numberSequence[i];
    const letters = numberToLetterMap[digit];

    if (!letters) {
      // If a digit doesn't map to letters, it means no valid word can be formed.
      return [];
    }

    let newPossibleWords = [];
    for (const word of possibleWords) {
      for (const letter of letters) {
        newPossibleWords.push(word + letter);
      }
    }
    possibleWords = newPossibleWords;
  }
  return possibleWords;
};

const verifyAndSetVolume = () => {
  clearMessages();

  if (!enteredNumber.value) {
    errorMessage.value = 'Please dial a number first.';
    return;
  }

  const possibleWords = getWordsFromNumbers(enteredNumber.value);
  let foundVolume = null;

  for (const word of possibleWords) {
    const lowerCaseWord = word.toLowerCase();
    if (validNumberWords.hasOwnProperty(lowerCaseWord)) {
      const volume = validNumberWords[lowerCaseWord];
      if (volume >= 0 && volume <= 100) {
        foundVolume = volume;
        break;
      }
    }
  }

  if (foundVolume !== null) {
    currentVolume.value = foundVolume;
    successMessage.value = `Volume set to: ${currentVolume.value}`;
    enteredNumber.value = '';
  } else {
    errorMessage.value = 'Error: Dialed sequence does not spell a number 0-100.';
    enteredNumber.value = '';
  }
};

// --- Cursor-based rotation logic ---
const handleMouseMove = (event) => {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const sensitivity = 3; // Reduced sensitivity for more subtle movement

  // Calculate rotation relative to center
  rotateY.value = (mouseX - centerX) / (rect.width / 2) * sensitivity;
  rotateX.value = -((mouseY - centerY) / (rect.height / 2) * sensitivity);
};

const handleMouseLeave = () => {
  // Reset to initial tilt
  rotateX.value = 5;
  rotateY.value = -5;
};

// Computed property for dynamic transform style
const cardTransform = computed(() => {
  return `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`;
});

</script>

<template>
  <div class="volume-app-wrapper">
    <!-- Moving background grid - now absolute within this wrapper -->
    <div class="hud-background-grid"></div>

    <div
      class="volume-input-card"
      :style="{ transform: cardTransform }"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <div class="header">
        <h1 class="title">Volume Dial</h1>
        <div class="current-volume">Current Volume: {{ currentVolume !== null ? currentVolume : 'N/A' }}</div>
        <div class="dial-instruction">For level 1 dial 663 (ONE)</div>
      </div>

      <div class="input-display">
        <span class="entered-number">{{ enteredNumber || ' Volume' }}</span>
      </div>

      <div class="dial-pad">
        <div
          v-for="key in dialPadKeys"
          :key="key.number"
          class="dial-pad-key"
          @click="handleDial(key.number)"
        >
          <div class="number">{{ key.number }}</div>
          <div class="letters">{{ key.letters }}</div>
        </div>
        <!-- The Call button, now styled like a dial pad key and placed in the grid -->
        <div class="dial-pad-key call-button" @click="verifyAndSetVolume">
          <div class="number">Call</div>
          <!-- Removed the "Verify" letters div -->
        </div>
      </div>

      <!-- New message area to prevent layout shifts -->
      <div class="message-area">
        <div v-show="errorMessage" class="message error-message">
          {{ errorMessage }}
        </div>
        <div v-show="successMessage" class="message success-message">
          {{ successMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Import Google Fonts directly within the component's style block */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

/* Keyframe for card pulsing */
@keyframes cardPulse {
    0% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.3); filter: brightness(1); }
    50% { box-shadow: 0 0 55px rgba(0, 255, 255, 0.8), inset 0 0 25px rgba(0, 255, 255, 0.4); filter: brightness(1.1); }
    100% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.3); filter: brightness(1); }
}

/* Keyframe for input display pulsing */
@keyframes inputPulse {
    0% { text-shadow: 0 0 15px rgba(0, 255, 255, 0.9), 0 0 25px rgba(0, 255, 255, 0.5); box-shadow: inset 0 0 15px rgba(0, 255, 255, 0.4); filter: brightness(1); }
    50% { text-shadow: 0 0 20px rgba(0, 255, 255, 1), 0 0 35px rgba(0, 255, 255, 0.7); box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.6); filter: brightness(1.05); }
    100% { text-shadow: 0 0 15px rgba(0, 255, 255, 0.9), 0 0 25px rgba(0, 255, 255, 0.5); box-shadow: inset 0 0 15px rgba(0, 255, 255, 0.4); filter: brightness(1); }
}

/* Text glitch effect - more aggressive */
@keyframes textGlitch {
    0% { text-shadow: 0 0 10px rgba(0,255,255,0.7), 2px 2px 0px rgba(255,0,0,0.5); transform: translateX(0px); }
    20% { text-shadow: 0 0 10px rgba(0,255,255,0.7), -2px -2px 0px rgba(0,255,0,0.5); transform: translateX(1px); }
    40% { text-shadow: 0 0 10px rgba(0,255,255,0.7), 1px 1px 0px rgba(0,0,255,0.5); transform: translateX(-1px); }
    60% { text-shadow: 0 0 10px rgba(0,255,255,0.7), -1px 1px 0px rgba(255,255,0,0.5); transform: translateX(0.5px); }
    80% { text-shadow: 0 0 10px rgba(0,255,255,0.7), 2px -2px 0px rgba(255,0,255,0.5); transform: translateX(-0.5px); }
    100% { text-shadow: 0 0 10px rgba(0,255,255,0.7), 2px 2px 0px rgba(255,0,0,0.5); transform: translateX(0px); }
}

/* Cursor blink animation */
@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

/* Glitch for messages - more intense */
@keyframes messageGlitch {
    0% { transform: scale(1) skewX(0deg); opacity: 1; filter: hue-rotate(0deg); }
    5% { transform: scale(1.01) skewX(2deg); opacity: 0.8; filter: hue-rotate(10deg); }
    10% { transform: scale(1) skewX(-2deg); opacity: 1; filter: hue-rotate(0deg); }
    15% { transform: scale(1.01) skewX(1deg); opacity: 0.9; filter: hue-rotate(5deg); }
    20% { transform: scale(1) skewX(0deg); opacity: 1; filter: hue-rotate(0deg); }
    100% { transform: scale(1) skewX(0deg); opacity: 1; filter: hue-rotate(0deg); }
}

/* Keyframe for border pulsing */
@keyframes pulseBorder {
    from { opacity: 0.5; box-shadow: 0 0 5px #00ffff; }
    to { opacity: 1; box-shadow: 0 0 20px #00ffff; }
}


/* Component-specific styles */
.volume-app-wrapper {
    /* No longer min-height: 100vh here */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px; /* Reduced padding */
    box-sizing: border-box;
    perspective: 1000px; /* For 3D effects */
    position: relative; /* For background grid */
    z-index: 1; /* Ensure container is above grid */
    /* Add top margin to push it below the fixed header */
    margin-top: 70px; /* Adjust this value based on your header's height (60px) + desired spacing */
    margin-bottom: 20px; /* Add some margin at the bottom */

    /* Global styles that should ideally be on body/App.vue */
    font-family: 'Share Tech Mono', monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #050a14;
    background-image:
        radial-gradient(circle at 50% 50%, rgba(0, 100, 150, 0.1) 0%, transparent 70%),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2300ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7l10 10M7 17l10-10"/></svg>') 12 12, auto;
    position: relative; /* For scanline pseudo-element */
    min-height: calc(100vh - 90px); /* Ensure wrapper takes up remaining height, considering header and margin */
}

/* Global Scanline Overlay - now on component's root */
.volume-app-wrapper::before {
    content: '';
    position: absolute; /* Changed from fixed to absolute to stay within wrapper */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0px,
        rgba(0, 0, 0, 0.1) 1px, /* More visible scanlines */
        rgba(0, 0, 0, 0.1) 3px,
        rgba(0, 0, 0, 0) 4px
    );
    pointer-events: none;
    z-index: 9999; /* Ensure it's on top */
    animation: scanlineFlicker 0.1s infinite alternate, globalFlicker 2s infinite step-end; /* Faster flicker, global flicker */
}

@keyframes scanlineFlicker {
    from { opacity: 0.8; }
    to { opacity: 1; }
}

@keyframes globalFlicker {
    0%, 100% { opacity: 1; filter: brightness(1); }
    10%, 30%, 70% { opacity: 0.95; filter: brightness(1.05); }
    20%, 40%, 80% { opacity: 1; filter: brightness(1); }
    50% { opacity: 0.9; filter: brightness(1.1); }
}

/* Moving Background Grid - now absolute within the wrapper */
.hud-background-grid {
    position: absolute; /* Changed to absolute to stay within wrapper */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #050a14; /* Base background for the grid */
    background-image:
        linear-gradient(to right, rgba(0, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px; /* Larger grid cells */
    pointer-events: none;
    z-index: -2; /* Behind the card */
    animation: gridMove 60s linear infinite, gridFlicker 0.5s infinite alternate;
}

.hud-background-grid::before { /* Second layer of grid */
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
        linear-gradient(to right, rgba(0, 191, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 191, 255, 0.02) 1px, transparent 1px);
    background-size: 30px 30px; /* Smaller grid cells for second layer */
    animation: gridMoveReverse 40s linear infinite, gridFlicker 0.7s infinite alternate reverse;
}

@keyframes gridMove {
    from { background-position: 0 0; }
    to { background-position: 100% 100%; }
}

@keyframes gridMoveReverse {
    from { background-position: 100% 100%; }
    to { background-position: 0 0; }
}

@keyframes gridFlicker {
    0% { opacity: 0.8; }
    50% { opacity: 0.7; }
    100% { opacity: 0.8; }
}


.volume-input-card {
    background: linear-gradient(135deg, rgba(10, 25, 40, 0.85) 0%, rgba(15, 35, 55, 0.85) 100%); /* Deeper gradient */
    backdrop-filter: blur(8px) brightness(1.1); /* Stronger glassmorphism */
    border: 2px solid; /* Thicker border */
    border-image: linear-gradient(45deg, #00ffff, #007bff, #00ffff) 1; /* Gradient border */
    border-radius: 20px; /* More rounded */
    max-width: 480px; /* Slightly wider */
    width: 100%;
    box-shadow:
        0 0 40px rgba(0, 255, 255, 0.6), /* Stronger outer glow */
        inset 0 0 20px rgba(0, 255, 255, 0.3); /* Stronger inner glow */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px; /* More spacing */
    padding: 40px; /* More padding */
    position: relative;
    overflow: hidden;
    /* Initial transform is now handled by computed property */
    transition: transform 0.5s ease; /* Smooth transition for cursor movement */
    animation: cardPulse 4s infinite ease-in-out; /* Pulsing effect for the card */
}

/* Corner accents */


.header {
    text-align: center;
    width: 100%;
    padding-bottom: 15px;
    border-bottom: 1px dashed rgba(0, 255, 255, 0.3); /* Cyan dashed line */
}

.title {
    font-family: 'Press Start 2P', cursive;
    font-size: 2.2em; /* Slightly larger title */
    color: #00ffff; /* Brighter Cyan */
    margin-bottom: 10px;
    text-shadow: 0 0 20px rgba(0, 255, 255, 1), 0 0 30px rgba(0, 255, 255, 0.7); /* More intense glow */
    letter-spacing: 3px;
    animation: textGlitch 0.2s infinite alternate steps(2); /* Faster text glitch */
}

.current-volume {
    font-size: 1.3em;
    color: #76ff03; /* Bright lime green for active info */
    text-shadow: 0 0 8px rgba(118, 255, 3, 0.8);
    animation: textGlitch 0.3s infinite alternate steps(3); /* Faster text glitch */
}

.dial-instruction {
    font-size: 1em; /* Slightly larger instruction */
    color: #a0e0ff; /* Lighter blue for instructions */
    margin-top: 15px;
    margin-bottom: 20px;
    text-align: center;
    line-height: 1.5;
    text-shadow: 0 0 5px rgba(160, 224, 255, 0.5);
}

.input-display {
    background-color: rgba(0, 255, 255, 0.08); /* More transparent blue background */
    border: 2px solid #00ffff; /* Brighter Cyan border */
    border-radius: 10px;
    padding: 18px; /* More padding */
    height: 70px; /* Slightly taller for visual impact */
    width: calc(100% - 30px); /* Adjust for padding and border */
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-size: 2.5em; /* Larger font for input numbers */
    letter-spacing: 5px;
    color: #00ffff; /* Cyan text for input */
    text-shadow: 0 0 15px rgba(0, 255, 255, 0.9), 0 0 25px rgba(0, 255, 255, 0.5); /* Intense input glow */
    overflow-x: auto;
    white-space: nowrap;
    box-shadow: inset 0 0 15px rgba(0, 255, 255, 0.4); /* Stronger inner glow */
    position: relative;
    animation: inputPulse 3s infinite ease-in-out, textGlitch 0.25s infinite alternate steps(2); /* Pulsing effect for input + text glitch */
}

.entered-number {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.5em; /* Ensure "Enter Volume" fits well */
}

.entered-number:empty::after {
    content: '_'; /* Blinking cursor */
    animation: blink 1s step-end infinite;
}

.dial-pad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px; /* Even more gap */
    width: 100%;
}

.dial-pad-key {
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.08) 0%, rgba(0, 191, 255, 0.08) 100%); /* Subtle gradient for buttons */
    border: 1px solid rgba(0, 255, 255, 0.6); /* More prominent border */
    border-radius: 12px;
    padding: 20px 0; /* More padding */
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease, border-color 0.3s ease, filter 0.2s ease;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.2); /* Enhanced glow */
    user-select: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.dial-pad-key::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.dial-pad-key:hover::before {
    opacity: 1;
}

.dial-pad-key:hover {
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(0, 191, 255, 0.2) 100%);
    border-color: #00ffff;
    transform: translateY(-5px) scale(1.05); /* More pronounced lift and scale */
    box-shadow: 0 0 35px rgba(0, 255, 255, 0.8), inset 0 0 18px rgba(0, 255, 255, 0.5); /* Intense hover glow */
    filter: hue-rotate(10deg) brightness(1.2); /* Color shift on hover */
}

.dial-pad-key:active {
    transform: translateY(0) scale(0.95);
    box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.6), 0 0 10px rgba(0, 255, 255, 0.3); /* Deeper inset shadow for pressed */
    background-color: rgba(0, 191, 255, 0.35); /* Slightly darker on press */
    filter: hue-rotate(20deg) brightness(1.3); /* More intense color shift on active */
}

.dial-pad-key .number {
    font-family: 'Press Start 2P', cursive;
    font-size: 2.8em; /* Even larger numbers */
    font-weight: bold;
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5); /* Stronger text glow */
}

.dial-pad-key.call-button .number {
    font-size: 1.8em; /* Adjusted "Call" font size to be more prominent but fit */
}


.dial-pad-key:hover .number {
    color: #fff; /* White on hover for contrast */
    text-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 25px rgba(255, 255, 255, 0.7);
}

.dial-pad-key .letters {
    font-size: 1em; /* Larger letters */
    color: #a0e0ff; /* Lighter blue letters */
    margin-top: 8px; /* More space */
    text-shadow: 0 0 5px rgba(160, 224, 255, 0.7);
}

.dial-pad-key:hover .letters {
    color: #fff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

/* Message area styles */
.message-area {
    height: 60px; /* Slightly taller fixed height for messages */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
}

.message {
    font-size: 1.2em; /* Larger message text */
    text-align: center;
    padding: 15px; /* More padding */
    border-radius: 10px;
    width: 100%;
    box-sizing: border-box;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.4); /* Stronger message text glow */
    animation: messageFadeIn 0.5s ease-out, messagePulse 1.5s infinite alternate, messageGlitch 0.15s infinite alternate steps(2); /* Pulsing message + faster glitch */
}

@keyframes messageFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes messagePulse {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(1.02); opacity: 0.9; }
}

.error-message {
    background-color: rgba(255, 69, 0, 0.25); /* Transparent orange-red */
    color: #ff4500; /* Orange-red */
    border: 1px solid #ff0000; /* Red border */
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.7), inset 0 0 8px rgba(255, 0, 0, 0.4); /* Intense error glow */
}

.success-message {
    background-color: rgba(0, 255, 127, 0.25); /* Transparent spring green */
    color: #00ff7f; /* Spring green */
    border: 1px solid #00ff00; /* Pure green border */
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.7), inset 0 0 8px rgba(0, 255, 0, 0.4); /* Intense success glow */
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .volume-input-card {
        padding: 25px; /* Reduced padding */
        gap: 20px; /* Reduced gap */
        border-radius: 15px;
        transform: rotateX(0deg) rotateY(0deg); /* Disable 3D tilt on small screens */
    }

    .title {
        font-size: 1.6em; /* Smaller title */
    }

    .current-volume {
        font-size: 1em; /* Smaller current volume */
    }

    .dial-instruction {
        font-size: 0.85em; /* Smaller instruction */
        margin-bottom: 10px;
    }

    .input-display {
        font-size: 1.8em; /* Smaller input font */
        height: 55px; /* Reduced height */
        padding: 12px;
    }

    .dial-pad {
        gap: 15px; /* Reduced gap */
    }

    .dial-pad-key {
        padding: 15px 0; /* Reduced padding */
        border-radius: 10px;
    }

    .dial-pad-key .number {
        font-size: 2em; /* Smaller number font */
    }

    .dial-pad-key.call-button .number {
        font-size: 1.4em; /* Smaller call button font */
    }

    .dial-pad-key .letters {
        font-size: 0.8em; /* Smaller letters */
    }

    .message-area {
        height: 45px; /* Reduced height */
    }

    .message {
        font-size: 0.9em; /* Smaller message font */
        padding: 10px;
    }
}

@media (max-width: 400px) {
    .volume-input-card {
        padding: 15px; /* Even smaller padding */
        gap: 15px; /* Even smaller gap */
        border-radius: 10px;
    }

    .title {
        font-size: 1.4em; /* Even smaller title */
    }

    .current-volume {
        font-size: 0.9em; /* Even smaller current volume */
    }

    .dial-instruction {
        font-size: 0.75em; /* Even smaller instruction */
        margin-bottom: 8px;
    }

    .input-display {
        font-size: 1.5em; /* Even smaller input font */
        height: 50px; /* Even smaller height */
        padding: 10px;
    }

    .dial-pad {
        gap: 10px; /* Even smaller gap */
    }

    .dial-pad-key {
        padding: 12px 0; /* Even smaller padding */
        border-radius: 8px;
    }

    .dial-pad-key .number {
        font-size: 1.8em; /* Even smaller number font */
    }

    .dial-pad-key.call-button .number {
        font-size: 1.2em; /* Even smaller call button font */
    }

    .dial-pad-key .letters {
        font-size: 0.7em; /* Even smaller letters */
    }

    .message-area {
        height: 40px; /* Even smaller height */
    }

    .message {
        font-size: 0.8em; /* Even smaller message font */
        padding: 8px;
    }
}
</style>
