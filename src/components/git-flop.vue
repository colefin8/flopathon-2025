<script setup>
// 2000's web style volume bar visual only
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import tuneUrl from '@/assets/tune.mp3';
import musicUrl from '@/assets/music.mp3';
let musicAudio = null;
const splashVisible = ref(false);
const frozen = ref(false);
const showFinalVolume = ref(false);
const animatedVolume = ref(0);
const postIntroMode = ref(false); // New flag for post-intro logic

function onSliderPress(e) {
  frozen.value = true;
  if (!musicAudio) {
    musicAudio = new Audio(musicUrl);
    musicAudio.loop = true;
  }
  musicAudio.currentTime = 0;
  musicAudio.play().catch(() => {});
}

const moveHead = () => {
  if (frozen.value) return;
  // Logic to move the volume bar head
}

// Generate random color for each limb
function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 90%, 60%)`;
}

const leftArmColor = ref(randomColor());
const rightArmColor = ref(randomColor());
const leftLegColor = ref(randomColor());
const rightLegColor = ref(randomColor());

// Delay legs animation until bar is rotated
const legsVisible = ref(false);
watch(frozen, (val) => {
  if (val) {
    setTimeout(() => { legsVisible.value = true; }, 1200);
  } else {
    legsVisible.value = false;
  }
});

// Delay arms animation in sequence after bar is rotated
const armsStage = ref(0); // 0=none, 1=left upper, 2=left lower, 3=right upper, 4=right lower, 5=all
watch(frozen, (val) => {
  if (val) {
    setTimeout(() => { legsVisible.value = true; armsStage.value = 1; }, 1200);
    setTimeout(() => { armsStage.value = 2; }, 1500);
    setTimeout(() => { armsStage.value = 3; }, 1800);
    setTimeout(() => { armsStage.value = 4; }, 2100);
    setTimeout(() => { armsStage.value = 5; }, 2400);
  } else {
    legsVisible.value = false;
    armsStage.value = 0;
  }
});

const headVisible = ref(false);
const headAttached = ref(false);
watch(armsStage, (val) => {
  if (val === 5) {
    setTimeout(() => {
      headVisible.value = true;
      headAttached.value = false;
      setTimeout(() => { headAttached.value = true; }, 50);
    }, 1000); // 5s delay for slower head appearance
  } else {
    headVisible.value = false;
    headAttached.value = false;
  }
});

const capVisible = ref(false);
const capAttached = ref(false);
watch(headAttached, (val) => {
  if (val) {
    setTimeout(() => {
      capVisible.value = true;
      capAttached.value = false;
      setTimeout(() => { capAttached.value = true; }, 50);
    }, 2900); // longer delay after head lands
  } else {
    capVisible.value = false;
    capAttached.value = false;
  }
});

// Leg animation: float up from bottom
const legStartY = 350; // off-screen
const legAttachY = 130; // attach point
const legFootY = 260; // foot position

const leftLegY1 = computed(() => (frozen.value ? legAttachY : legStartY));
const leftLegY2 = computed(() => (frozen.value ? legFootY : legStartY));
const rightLegY1 = computed(() => (frozen.value ? legAttachY : legStartY));
const rightLegY2 = computed(() => (frozen.value ? legFootY : legStartY));

const explosionsVisible = ref(false);
watch(capAttached, (val) => {
  if (val) {
    setTimeout(() => {
      explosionsVisible.value = true;
      setTimeout(() => { explosionsVisible.value = false; }, 1500);
    }, 4000); // 4s delay after cap lands
  } else {
    explosionsVisible.value = false;
  }
});

const cliffVisible = ref(false);
watch(explosionsVisible, (val) => {
  if (val) {
    setTimeout(() => { cliffVisible.value = true; }, 3000); // 3s after explosions start
    // headSquishActive.value = true; // Start squish forever after effects
  } else {
    cliffVisible.value = false;
  }
});

const explosionPositions = [
  { left: '0%', top: '0%' },
  { left: '20%', top: '0%' },
  { left: '40%', top: '0%' },
  { left: '60%', top: '0%' },
  { left: '80%', top: '0%' },
  { left: '100%', top: '0%' },
  { left: '0%', top: '20%' },
  { left: '100%', top: '20%' },
  { left: '0%', top: '40%' },
  { left: '100%', top: '40%' },
  { left: '0%', top: '60%' },
  { left: '100%', top: '60%' },
  { left: '0%', top: '80%' },
  { left: '100%', top: '80%' },
  { left: '0%', top: '100%' },
  { left: '20%', top: '100%' },
  { left: '40%', top: '100%' },
  { left: '60%', top: '100%' },
  { left: '80%', top: '100%' },
  { left: '100%', top: '100%' },
  { left: '50%', top: '50%' },
  { left: '25%', top: '25%' },
  { left: '75%', top: '25%' },
  { left: '25%', top: '75%' },
  { left: '75%', top: '75%' },
];

const shrinkDiver = ref(false);
watch(cliffVisible, (val) => {
  if (val) {
    setTimeout(() => { shrinkDiver.value = true; }, 800);
  } else {
    shrinkDiver.value = false;
  }
});

// --- Jump Game Logic ---
const jumpBarVisible = ref(false);
const power = ref(0); // 0 to 1
const powerCharging = ref(false);
const maxPower = 1.0;
const minPower = 0.2;
const powerChargeRate = 0.7; // per second
const jumping = ref(false);
const jumpProgress = ref(0); // 0 to 1
const jumpStart = ref(null);
const jumpPower = ref(minPower);
const diverY = ref(0); // vh, 0 = top, 100 = bottom
const diverX = ref(0); // vw, for left/right movement
const diverRotation = ref(0); // degrees
const flipSpeed = 32; // degrees per arrow press (faster flip)
const moveStep = 1.5; // vw per arrow press (less horizontal movement)
const jumpDurationBase = 6000; // ms (slower fall)
const jumpStartY = -410; // vh (matches .diver-container.shrink translateY)
const jumpEndY = 30; // vh (near bottom)
const powerDirection = ref(1); // 1 = increasing, -1 = decreasing
const canJump = ref(true);

// Show jump bar when diver is shrunk, not jumping, and canJump is true
watch([shrinkDiver, jumping, canJump], ([shrink, jump, can]) => {
  jumpBarVisible.value = shrink && !jump && can;
});

// Dramatic text visibility
const dramaticTextVisible = ref(true);

// --- Rotation Drift/Spin ---
const rotationVelocity = ref(0);
const rotationAcceleration = ref(0);
const maxRotationSpeed = 28; // degrees per frame (even faster)
const rotationAccelAmount = 6; // degrees per frame^2 (more responsive)
const rotationFriction = 0.97; // velocity decay per frame

// Flip/volume logic
const flips = ref(0);
const volume = ref(0);

function onKeyDown(e) {
  if ((e.code === 'Space' && ((jumpBarVisible.value && canJump.value) || (postIntroMode.value && !jumping.value && canJump.value)))) {
    if (!powerCharging.value) {
      powerCharging.value = true;
      power.value = minPower;
      powerDirection.value = 1;
      chargePower();
    }
    e.preventDefault();
  } else if (jumping.value) {
    if (e.code === 'ArrowLeft') {
      rotationAcceleration.value = -rotationAccelAmount;
      diverX.value -= moveStep;
    } else if (e.code === 'ArrowRight') {
      rotationAcceleration.value = rotationAccelAmount;
      diverX.value += moveStep;
    }
  }
}
function onKeyUp(e) {
  if ((e.code === 'Space' && powerCharging.value && canJump.value && (jumpBarVisible.value || postIntroMode.value))) {
    powerCharging.value = false;
    jumpPower.value = Math.min(power.value, maxPower);
    power.value = 0;
    dramaticTextVisible.value = false;
    canJump.value = false; // Prevent new jumps until splash is done
    startJump();
  }
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    rotationAcceleration.value = 0;
  }
}
function chargePower() {
  if (powerCharging.value) {
    power.value += powerDirection.value * (powerChargeRate / 60);
    if (power.value >= maxPower) {
      power.value = maxPower;
      powerDirection.value = -1;
    } else if (power.value <= minPower) {
      power.value = minPower;
      powerDirection.value = 1;
    }
    requestAnimationFrame(chargePower);
  }
}
function startJump() {
  jumping.value = true;
  jumpProgress.value = 0;
  jumpStart.value = null;
  diverY.value = jumpStartY;
  diverX.value = 0;
  diverRotation.value = 0;
  flips.value = 0;
  requestAnimationFrame(animateJump);
}
function animateJump(ts) {
  if (!jumpStart.value) jumpStart.value = ts;
  const duration = jumpDurationBase; // fixed duration for up and down
  const elapsed = ts - jumpStart.value;
  jumpProgress.value = Math.min(elapsed / duration, 1);
  // Calculate peak height based on power
  const minPeak = jumpStartY - 40; // lowest possible peak
  const maxPeak = jumpStartY - 700; // even higher possible peak
  const peakY = minPeak + (maxPeak - minPeak) * ((jumpPower.value - minPower) / (maxPower - minPower));
  // Parabolic up and down: t=0 at start, t=0.5 at peak, t=1 at end
  const t = jumpProgress.value;
  // Quadratic interpolation: y = (1-t)^2 * start + 2(1-t)t * peak + t^2 * end
  diverY.value = (1 - t) * (1 - t) * jumpStartY + 2 * (1 - t) * t * peakY + t * t * jumpEndY;
  // --- Rotation Drift ---
  if (jumping.value) {
    rotationVelocity.value += rotationAcceleration.value;
    // Clamp velocity
    if (rotationVelocity.value > maxRotationSpeed) rotationVelocity.value = maxRotationSpeed;
    if (rotationVelocity.value < -maxRotationSpeed) rotationVelocity.value = -maxRotationSpeed;
    diverRotation.value += rotationVelocity.value;
    // Apply friction
    rotationVelocity.value *= rotationFriction;
    // If very slow, stop
    if (Math.abs(rotationVelocity.value) < 0.01 && rotationAcceleration.value === 0) {
      rotationVelocity.value = 0;
    }
    // Count flips
    flips.value = Math.floor(Math.abs(diverRotation.value) / 360);
  }
  if (jumpProgress.value < 1 && diverY.value < jumpEndY) {
    requestAnimationFrame(animateJump);
  } else {
    jumping.value = false;
    diverY.value = jumpEndY;
    rotationVelocity.value = 0;
    rotationAcceleration.value = 0;
    // Prevent further movement after landing
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    // Show splash
    console.log('SPLASH SHOWN');
    splashVisible.value = true;
    // Set volume to flips (capped at 100)
    volume.value = Math.min(flips.value, 100);
    // --- Calculate scorecards with more randomness and special cases ---
    const rand = Math.random();
    if (rand < 1/3) {
      // 1/3: All 0's, bad dive
      scorecards.value = [0, 0, 0];
      scorecardMessage.value = 'That dive sucked!';
    } else if (rand < 1/3 + 1/8) {
      // Next 1/8: All 25's, perfect dive
      scorecards.value = [25, 25, 25];
      scorecardMessage.value = 'That was a perfect dive!';
    } else {
      // Otherwise: flatness-based, but more random
      let rot = Math.abs(diverRotation.value % 360);
      if (rot > 180) rot = 360 - rot;
      const flatness = Math.abs(90 - rot) / 90; // 1 at 0/180, 0 at 90
      const baseScore = Math.round(15 + 10 * flatness); // 15-25 for best, 15 for worst
      scorecards.value = [0, 1, 2].map(() => Math.max(0, Math.min(25, baseScore + Math.floor(Math.random() * 15) - 7)));
      scorecardMessage.value = '';
    }
    setTimeout(() => {
      splashVisible.value = false;
      // Show scorecards before final volume overlay
      showScorecards.value = true;
      // After a delay, hide scorecards and show final volume overlay
      setTimeout(() => {
        showScorecards.value = false;
        // Add scorecards to volume before showing overlay
        const scorecardSum = scorecards.value.reduce((a, b) => a + b, 0);
        volume.value = Math.min(volume.value + scorecardSum, 100);
        showFinalVolume.value = true;
        animatedVolume.value = 0;
        animateVolumeBar();
        postIntroMode.value = true; // Enter post-intro mode after first jump
      }, 3000); // Show scorecards for 2s
    }, 1000);
  }
}

function animateVolumeBar() {
  if (animatedVolume.value < volume.value) {
    animatedVolume.value += 2;
    if (animatedVolume.value > volume.value) animatedVolume.value = volume.value;
    setTimeout(animateVolumeBar, 16);
  } else {
    // Show jump again prompt after animation
    // setTimeout(() => { jumpAgainPrompt.value = true; }, 600); // Removed
  }
}

function onJumpAgain(yes) {
  if (yes) {
    showFinalVolume.value = false;
    animatedVolume.value = 0;
    flips.value = 0;
    volume.value = 0;
    dramaticTextVisible.value = true;
    canJump.value = true;
    diverY.value = jumpStartY;
    diverX.value = 0;
    diverRotation.value = 0;
    jumping.value = false;
    shrinkDiver.value = true; // Ensure diver is in pre-jump, shrunk state
    showScorecards.value = false;
    // Re-add event listeners for controls
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    // Do NOT reset dramatic intro/assembly refs so the diver stays intact
    // Do NOT touch frozen
  } else {
    // Keep overlay, do nothing
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
});
// Scorecard UI state
const scorecards = ref([18, 20, 22]); // Placeholder values, out of 25
const showScorecards = ref(false);
const scorecardMessage = ref(''); // Message to show with scorecards

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
});
// --- Diver Transform ---
const diverTransform = computed(() => {
  if (jumping.value) {
    // During jump: move and rotate
    return `scale(0.2) translate(calc(-44vw + ${diverX.value}vw), ${diverY.value}vh) rotate(${diverRotation.value}deg)`;
  } else if (shrinkDiver.value) {
    // Shrunk, pre-jump
    return 'scale(0.2) translate(-44vw, -410vh)';
  }
  return '';
});

// Audio for celebratory tune
let audioEl = null;
const bgMusicVolume = ref(0.3);
const bgMusic = ref(null);

onMounted(() => {
  if (bgMusic.value) {
    bgMusic.value.volume = bgMusicVolume.value;
    bgMusic.value.loop = true;
    bgMusic.value.play().catch(() => {});
  }
});

watch(showFinalVolume, (val) => {
  if (bgMusic.value) {
    if (val) {
      bgMusic.value.pause(); // Always pause background music when overlay appears
    } else {
      // Restore to default volume when overlay closes
      bgMusic.value.volume = bgMusicVolume.value;
      bgMusic.value.play().catch(() => {});
    }
  }
  // Play celebratory tune at the user's volume
  if (val) {
    if (!audioEl) {
      audioEl = new Audio(tuneUrl);
    }
    audioEl.currentTime = 0;
    audioEl.volume = volume.value / 100;
    audioEl.play();
    // Set background music volume based on score (volume.value)
    if (bgMusic.value) {
      // Map 0-100 score to 0.1-1.0 volume
      const minVol = 0.1;
      const maxVol = 1.0;
      const mappedVol = minVol + (maxVol - minVol) * (volume.value / 100);
      bgMusic.value.volume = mappedVol;
      bgMusic.value.pause(); // Ensure background music is paused when celebratory tune starts
    }
  } else if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
  }
});
</script>

<template>
  <div v-if="cliffVisible || postIntroMode" class="cliff-bg"></div>
  <!-- Multiple Explosions: appear around the diver for 2 seconds after cap lands, covering the whole screen -->
  <img
    v-for="(pos, i) in explosionsVisible ? explosionPositions : []"
    :key="'explode-'+i"
    class="explode-effect"
    src="@/assets/explode.gif"
    alt="explode effect"
    :style="{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }"
  />
  <!-- Dust Effect: appears under the diver's feet at the same time as explosions -->
  <img v-if="explosionsVisible" class="dust-effect" src="@/assets/dust.gif" alt="dust effect" />
  <!-- Dramatic Text: appears with the cliff background -->
  <div v-if="cliffVisible && dramaticTextVisible" class="dramatic-text">
    the volume will be decided by how good your flop is!
    <div class="dramatic-subtext">

    </div>
  </div>
  <!-- Final Volume Bar: top right -->
  <div v-if="cliffVisible" class="final-volume-bar">
    <label for="final-volume-slider" class="final-volume-label">VOLUME</label>
    <input id="final-volume-slider" type="range" min="0" max="100" :value="volume" class="final-volume-slider" disabled />
    <span class="flips-label">({{ flips }} flips)</span>
  </div>
  <!-- Jump Bar -->
  <div v-if="jumpBarVisible || (postIntroMode && !jumping && canJump)" class="jump-bar-outer">
    <div class="jump-bar-label">JUMP POWER</div>
    <div class="jump-bar">
      <div class="jump-bar-fill" :style="{ width: (100 * (powerCharging ? power : 0)) + '%' }"></div>
    </div>
    <div class="jump-bar-instructions">Hold SPACE to charge, release to jump. Flip with left and right arrow keys!</div>
  </div>
  <!-- Diver -->
  <div :class="['diver-container', { shrink: shrinkDiver || postIntroMode }]" :style="{ transform: diverTransform }">
    <div class="center-wrapper">
      <div class="head-figure-outer">
        <!-- Static stick figure limbs as images -->
        <!-- Left Arm: upper and lower -->
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='24'><line x1='110' y1='12' x2='10' y2='12' stroke='black' stroke-width='24'/></svg>"
          class="stick-arm left upper"
          :class="[{'hidden-arm': armsStage < 1}, armsStage < 1 ? 'offscreen-left' : '']"
        />
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='24'><line x1='10' y1='12' x2='190' y2='12' stroke='black' stroke-width='24'/></svg>"
          class="stick-arm left lower"
          :class="[{'hidden-arm': armsStage < 2}, armsStage < 2 ? 'offscreen-left' : '']"
        />
        <!-- Right Arm: upper and lower -->
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='24'><line x1='10' y1='12' x2='140' y2='12' stroke='black' stroke-width='24'/></svg>"
          class="stick-arm right upper"
          :class="[{'hidden-arm': armsStage < 3}, armsStage < 3 ? 'offscreen-right' : '']"
        />
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='210' height='24'><line x1='200' y1='12' x2='10' y2='12' stroke='black' stroke-width='24'/></svg>"
          class="stick-arm right lower"
          :class="[{'hidden-arm': armsStage < 4}, armsStage < 4 ? 'offscreen-right' : '']"
        />
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='200'><line x1='16' y1='10' x2='16' y2='190' stroke='black' stroke-width='24'/></svg>" class="stick-leg left" :class="{ floating: !legsVisible }" />
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='200'><line x1='16' y1='10' x2='16' y2='190' stroke='black' stroke-width='24'/></svg>" class="stick-leg right" :class="{ floating: !legsVisible }" />
        <!-- Swimming trunks image overlay -->
        <img src="@/assets/trunks.png" class="swim-trunks" alt="swimming trunks" :class="{ 'trunks-in': capVisible, 'trunks-hidden': !capVisible }" />
        <!-- Head: comes down and attaches after arms/legs -->
        <img
          v-if="headVisible"
          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><circle cx='40' cy='40' r='36' fill='white' stroke='black' stroke-width='6'/><circle cx='30' cy='35' r='6' fill='black'/><circle cx='50' cy='35' r='6' fill='black'/><path d='M30 55 Q40 65 50 55' stroke='black' stroke-width='4' fill='none'/></svg>"
          class="stick-head"
          :class="[{ 'head-attach': headAttached }, { 'squish-head': true }]"
        />
        <!-- Swim Cap: floats down after head -->
        <img
          v-if="capVisible"
          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='50'><ellipse cx='60' cy='40' rx='55' ry='30' fill='%2300bfff' stroke='black' stroke-width='4'/></svg>"
          class="swim-cap"
          :class="{ 'cap-attach': capAttached }"
        />
        <div :class="['crappy-volume-bar', { frozen }]" :style="frozen ? 'transform: rotate(-90deg); transition: transform 1.2s steps(12, end);' : ''">
          <img src="https://www.iconarchive.com/download/i108096/google/noto-emoji-objects/62899-speaker.ico" class="crappy-icon" alt="speaker" />
          <input type="range" min="0" max="100" value="50" class="crappy-slider" @pointerdown="onSliderPress" :disabled="frozen" :style="frozen ? 'pointer-events: none; opacity: 0.7;' : ''" />
          <span class="crappy-label">VOLUME</span>
        </div>
      </div>
    </div>
  </div>
  <img v-if="splashVisible" class="splash-effect" src="@/assets/splash.gif" alt="splash effect"
    :style="{ left: `calc(50vw + ${diverX}vw)`, top: `${jumpEndY}vh` }" />

  <div v-if="jumping" class="bottom-line" :style="{ top: `calc(${jumpEndY}vh + 700px)` }"></div>
  <div v-if="showFinalVolume" class="final-volume-overlay">
    <div class="final-volume-content">
      <div class="final-volume-title">YOUR VOLUME</div>
      <input id="final-volume-slider-anim" type="range" min="0" max="100" :value="animatedVolume" class="final-volume-slider big" disabled />
      <div class="final-volume-number">{{ animatedVolume }} / 100</div>
      <div class="final-flips">({{ flips }} flips)</div>
      <button class="jump-again-btn" style="margin-top: 24px;" @click="onJumpAgain(true)">Try Again</button>
    </div>
  </div>
  <!-- bgMusic audio element removed; music.mp3 is played via Audio object in script -->
  <div v-if="showScorecards" class="scorecards-overlay">
    <div class="scorecards-row">
      <div v-if="scorecardMessage" class="scorecard-message">{{ scorecardMessage }}</div>
      <div v-for="(score, i) in scorecards" :key="'scorecard-'+i" class="scorecard" :style="{ animationDelay: (i * 0.25) + 's' }">
        <div class="scorecard-value">{{ score }}</div>
        <div class="scorecard-outof">/ 25</div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.center-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.head-figure-outer {
  position: relative;
}

.crappy-volume-bar {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #00ffff 0%, #ff00ff 100%);
  border: 3px solid #ff0;
  border-radius: 8px;
  box-shadow: 0 0 10px #0ff, 0 0 5px #f0f;
  padding: 10px 20px;
  gap: 12px;
  width: 320px;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  transition: transform 1.2s steps(12, end);
}
.crappy-volume-bar.frozen {
  /* fallback for inline style, but keep for SSR/hydration */
  transform: rotate(-90deg);
}

.crappy-icon {
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 0 2px #ff0);
}

.crappy-slider {
  flex: 1;
  height: 18px;
  background: #fff200;
  border: 2px solid #00f;
  border-radius: 6px;
  box-shadow: 0 0 6px #0ff inset;
  accent-color: #ff00ff;
  margin: 0 8px;
}

.crappy-label {
  color: #ff00ff;
  font-weight: bold;
  text-shadow: 1px 1px 0 #fff, 2px 2px 0 #00f;
  font-size: 1.1em;
  letter-spacing: 2px;
}
/* Remove SVG limb styles */
.arm, .leg, .leg-group { display: none; }

/* Static stick limb images */
.stick-arm {
  position: absolute;
  z-index: 3;
  transition: transform 4s steps(10, end), opacity 0.6s;
}
.offscreen-left {
  transform: translateX(-100vw) rotate(-360deg) !important;
}
.offscreen-right {
  transform: translateX(100vw) rotate(360deg) !important;
}
/* Left arm upper: from shoulder to elbow */
.stick-arm.left.upper {
  top: -70px;
  left: 50px;
  width: 170px;
  height: 24px;
  transform: rotate(40deg);
}   
/* Left arm lower: from elbow, angled up */
.stick-arm.left.lower {
  top: -260px;
  left: 70px;
  width: 330px;
  height: 18px;
  transform: rotate(70deg);
}
/* Right arm upper: from shoulder to elbow */
.stick-arm.right.upper {
  top: -80px;
  right: 60px;
  width: 150px;
  height: 24px;
  transform: rotate(-40deg);
}
/* Right arm lower: from elbow, angled up */
.stick-arm.right.lower {
  top: -250px;
  right: 80px;
  width: 330px;
  height: 18px;
  transform: rotate(-70deg);
}
.stick-leg {
  position: absolute;
  width: 30px;
  height: 260px;
  z-index: 3;
  left: 120px;
  top: 180px;
  transition: transform 4s steps(10, end), opacity 0.6s;
}
.stick-leg.right {
  left: 182px;
}
.stick-leg.floating.left {
  transform: translateY(100vh) rotate(-30deg);
}
.stick-leg.floating.right {
  transform: translateY(100vh) rotate(30deg);
}
.stick-leg.left {
  left: 155px;
  transform: rotate(-15deg);
}
.stick-leg.right {
  left: 180px;
  transform: rotate(15deg);
}
.hidden-arm {
  opacity: 0;
  pointer-events: none;
}
.stick-head {
  position: absolute;
  left: 110px;
  width: 150px;
  height: 70px;
  z-index: 4;
  top: -400px;
  transition: top 3s steps(20, end);
}
.squish-head {
  animation: head-squish 1.2s cubic-bezier(0.4, 0.1, 0.6, 0.9) infinite;
}
@keyframes head-squish {
  0%   { transform: scaleX(1) scaleY(1); }
  20%  { transform: scaleX(1.15) scaleY(0.85); }
  50%  { transform: scaleX(0.92) scaleY(1.12); }
  70%  { transform: scaleX(1.08) scaleY(0.92); }
  100% { transform: scaleX(1) scaleY(1); }
}
.stick-head.head-attach {
  top: -190px;
}
.swim-cap {
  position: absolute;
  left: 125px;
  width: 120px;
  height: 50px;
  z-index: 5;
  top: -600px;
  transition: top 5s cubic-bezier(0.22, 1, 0.36, 1);
}
.swim-cap.cap-attach {
  top: -225px;
}
.explode-effect {
  position: fixed;
  width: 240px;
  height: 240px;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  animation: explode-fade-in-out 3s linear forwards;
}
.explode-topleft {
  left: -100px;
  top: -100px;
}
.explode-topright {
  right: -100px;
  top: -100px;
}
.explode-bottomleft {
  left: -100px;
  bottom: -100px;
}
.explode-bottomright {
  right: -100px;
  bottom: -100px;
}
.explode-left {
  left: -180px;
  top: 80px;
}
.explode-right {
  right: -180px;
  top: 80px;
}
.explode-topcenter {
  left: 50%;
  top: -120px;
  transform: translateX(-50%);
}
.explode-bottomcenter {
  left: 50%;
  bottom: -120px;
  transform: translateX(-50%);
}
@keyframes explode-fade-in-out {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}
.dust-effect {
  position: absolute;
  left: 50%;
  bottom: 200px;
  width: 600px;
  height: 200px;
  transform: translateX(-50%);
  z-index: 20;
  opacity: 0;
  pointer-events: none;
  animation: dust-fade-in-out 3s linear forwards;
}
@keyframes dust-fade-in-out {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}
.cliff-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: url('@/assets/cliff.png') center 60% / contain no-repeat;
  z-index: 0;
  opacity: 0;
  pointer-events: none;
  animation: cliff-fade-in 1.5s ease-in forwards;
}
@keyframes cliff-fade-in {
  to { opacity: 1; }
}
.dramatic-text {
  position: fixed;
  top: 18vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  font-size: 5.5rem;
  font-family: 'Impact', 'Arial Black', cursive, sans-serif;
  color: #fff700;
  text-shadow: 3px 3px 0 #000, 0 0 16px #ff0, 0 0 32px #f00;
  letter-spacing: 2px;
  opacity: 0;
  animation: dramatic-text-fade-in 2s 0.5s ease-in forwards;
  pointer-events: none;
  text-align: center;
  padding: 0.5em 1em;
}
@keyframes dramatic-text-fade-in {
  to { opacity: 1; }
}
.dramatic-subtext {
  margin-top: 1.2em;
  font-size: 1.5rem;
  color: #fff;
  text-shadow: 2px 2px 0 #000, 0 0 8px #ff0;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  letter-spacing: 1px;
  opacity: 0.85;
}
.diver-container {
  transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); 
  transform: scale(1);
  transform-origin: bottom center;
  will-change: transform;
}
.diver-container.shrink {
  transform: scale(0.2) translate(-44vw, -410vh);
}
.final-volume-bar {
  position: fixed;
  top: 4vh;
  right: 4vw;
  z-index: 2001;
  background: rgba(0,0,0,0.7);
  border: 3px solid #ff0;
  border-radius: 12px;
  padding: 18px 32px 18px 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: 0 0 16px #ff0, 0 0 8px #f0f;
  opacity: 0;
  animation: final-volume-fade-in 2s 0.7s ease-in forwards;
}
.final-volume-label {
  color: #fff700;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 0 #000, 0 0 8px #ff0;
  letter-spacing: 2px;
}
.final-volume-slider {
  width: 180px;
  accent-color: #ff00ff;
  background: #fff200;
  border: 2px solid #00f;
  border-radius: 8px;
  height: 18px;
  box-shadow: 0 0 6px #0ff inset;
  opacity: 0.8;
}
@keyframes final-volume-fade-in {
  to { opacity: 1; }
}
.jump-bar-outer {
  position: fixed;
  top: 62vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  background: #fff200;
  border: 3px solid #ff00ff;
  border-radius: 14px;
  box-shadow: 0 0 12px #ff0, 0 0 4px #f0f;
  padding: 10px 18px 10px 18px;
  min-width: 140px;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  text-align: center;
  font-size: 1.1rem;
  animation: jump-bar-fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.jump-bar-label {
  font-size: 2.2rem;
  color: #ff00ff;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 1px 1px 0 #fff, 2px 2px 0 #00f;
}
.jump-bar {
  width: 160px;
  height: 24px;
  background: #fff;
  border: 3px solid #00f;
  border-radius: 12px;
  margin: 0 auto 12px auto;
  overflow: hidden;
  box-shadow: 0 0 8px #0ff inset;
  position: relative;
}
.jump-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ffff 0%, #ff00ff 100%);
  transition: width 0.1s;
  border-radius: 12px 0 0 12px;
}
.jump-bar-instructions {
  font-size: 1.1rem;
  color: #00f;
  margin-top: 6px;
  text-shadow: 1px 1px 0 #fff;
}
@keyframes jump-bar-fade-in {
  from { opacity: 0; transform: translateY(-40px); }
  to { opacity: 1; transform: none; }
}
.splash-effect {
  position: fixed;
  width: 400px;
  height: 220px;
  z-index: 3002;
  pointer-events: none;
  transform: translate(-50%, 0);
  animation: splash-fade-in 1s linear forwards;
  border: 2px dashed red;
}
@keyframes splash-fade-in {
  0% { opacity: 0; transform: translate(-50%, 40px) scale(0.7); }
  20% { opacity: 1; transform: translate(-50%, 0) scale(1.1); }
  80% { opacity: 1; transform: translate(-50%, 0) scale(1); }
  100% { opacity: 0; transform: translate(-50%, 0) scale(1); }
}
.flips-label {
  color: #fff;
  font-size: 1.2rem;
  margin-left: 12px;
  text-shadow: 1px 1px 0 #000, 0 0 8px #ff0;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
}
.final-volume-overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.85);
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fade-in 0.5s;
}
.final-volume-content {
  background: #fff200;
  border: 6px solid #ff00ff;
  border-radius: 32px;
  box-shadow: 0 0 32px #ff0, 0 0 16px #f0f;
  padding: 48px 64px 36px 64px;
  min-width: 420px;
  text-align: center;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
}
.final-volume-title {
  font-size: 3.2rem;
  color: #ff00ff;
  font-weight: bold;
  margin-bottom: 18px;
  text-shadow: 2px 2px 0 #fff, 3px 3px 0 #00f;
}
.final-volume-slider.big {
  width: 320px;
  height: 32px;
  margin: 0 auto 18px auto;
  accent-color: #ff00ff;
  background: #fff200;
  border: 3px solid #00f;
  border-radius: 12px;
  box-shadow: 0 0 8px #0ff inset;
  opacity: 0.95;
}
.final-volume-number {
  font-size: 4.2rem;
  color: #ff00ff;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 0 #fff, 3px 3px 0 #00f;
}
.final-flips {
  font-size: 2rem;
  color: #00f;
  margin-bottom: 24px;
  text-shadow: 1px 1px 0 #fff;
}
.jump-again-prompt {
  margin-top: 18px;
  font-size: 1.6rem;
  color: #000;
  font-weight: bold;
}
.jump-again-btn {
  margin: 0 18px;
  font-size: 1.5rem;
  padding: 10px 32px;
  border-radius: 12px;
  border: 3px solid #ff00ff;
  background: #fff;
  color: #ff00ff;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 8px #ff0;
  transition: background 0.2s, color 0.2s;
}
.jump-again-btn:hover {
  background: #ff00ff;
  color: #fff;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.bottom-line {
  position: fixed;
  left: 0;
  width: 100vw;
  height: 0;
  border-top: 3px dashed #00bfff;
  box-shadow: 0 0 8px 2px #00bfff88;
  border-radius: 2px;
  z-index: 4000;
  pointer-events: none;
  opacity: 0.85;
  transition: opacity 0.4s;
}
.scorecards-overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  z-index: 3500;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fade-in 0.5s;
}
.scorecards-row {
  display: flex;
  gap: 48px;
}
.scorecard {
  width: 120px;
  height: 180px;
  background: #fff;
  border: 6px solid #ff00ff;
  border-radius: 24px;
  box-shadow: 0 0 32px #ff0, 0 0 16px #f0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  font-size: 4.2rem;
  color: #ff00ff;
  font-weight: bold;
  text-shadow: 2px 2px 0 #fff, 3px 3px 0 #00f;
  opacity: 0;
  transform: scale(0.7) rotate(-30deg);
  animation: scorecard-pop 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.scorecard-value {
  font-size: 4.2rem;
  margin-bottom: 8px;
}
.scorecard-outof {
  font-size: 2rem;
  color: #00f;
  font-weight: normal;
  text-shadow: 1px 1px 0 #fff;
}
.scorecard-message {
  font-size: 2.5rem;
  color: #fff;
  text-shadow: 2px 2px 0 #000, 0 0 8px #ff0;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  letter-spacing: 1px;
  opacity: 0.9;
  margin-bottom: 20px;
  text-align: center;
}
@keyframes scorecard-pop {
  0% { opacity: 0; transform: scale(0.7) rotate(-30deg); }
  60% { opacity: 1; transform: scale(1.15) rotate(8deg); }
  80% { opacity: 1; transform: scale(0.95) rotate(-4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
.swim-trunks {
  position: absolute;
  left: 90px;
  top: 105px;
  width: 200px;
  height: 180px;
  z-index: 4;
  pointer-events: none;
  opacity: 0;
  transform: translateY(600px) scale(1.1) rotate(-10deg);
  transition: opacity 0.7s steps(8, end), transform 2s steps(8, end);
}
.swim-trunks.trunks-in {
  opacity: 1;
  transform: translateY(0) scale(1) rotate(0deg);
}
.swim-trunks.trunks-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
