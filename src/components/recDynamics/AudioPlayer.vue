<template>
	<div>
    <!-- Modal overlay -->
    <div class="audio-modal-overlay">
        <div class="audio-modal">
            <!-- Close button -->
            <button @click="handleClose" class="close-button">✕</button>
            <div class="audio-player-content">
                <div class="audio-header">
                    <h2 class="audio-title">🎵 INTERCEPTED AUDIO MESSAGE 🎵</h2>
                    <p class="audio-subtitle">PLAYING AUTOMATICALLY...</p>
                </div>
                <!-- Warning message -->
                <div class="warning-message">
                    <div class="warning-header">
                        <span class="warning-icon">⚠️</span>
                        <span class="warning-text">W A R N I N G</span>
                        <span class="warning-icon">⚠️</span>
                    </div>
                    <p class="warning-content">
                        This message will only play once! Follow its instructions or
                        your search history will be broadcasted moments after its conclusion.
                    </p>
                </div>
                <!-- Large waveform visualization -->
                <div class="waveform-container">
                    <div
                        v-for="(bar, index) in waveformBars"
                        :key="index"
                        class="waveform-bar"
                        :class="{ 'waveform-active': currentTime > (index * duration) / 80 }"
                        :style="{ height: bar.height + '%' }"
                        ></div>
                </div>
                <!-- Timeline -->
                <div class="timeline-section">
                    <div class="timeline-labels">
                        <span>{{ formatTime(currentTime) }}</span>
                        <span class="recording-indicator">● REC</span>
                        <span>{{ formatTime(duration) }}</span>
                    </div>
                    <!-- Progress timeline -->
                    <div class="progress-container">
                        <div
                            class="progress-bar"
                            :style="{ width: (currentTime / duration) * 100 + '%' }"
                            ></div>
                        <div
                            class="progress-handle"
                            :style="{ left: (currentTime / duration) * 100 + '%' }"
                            ></div>
                    </div>
                </div>
                <!-- OVERLY COMPLEX VOLUME CONTROL SYSTEM -->
                <div class="volume-section">
                    <div class="volume-panel" :class="{ 'volume-glow': volumeGlow }">
                        <!-- Technical Grid Background -->
                        <div class="volume-grid" ></div>
                        <!-- Scanning Line Effect -->
                        <div v-if="volumeGlow" class="volume-scanner">
                            <div class="scanner-line" ></div>
                        </div>
                        <!-- Header Section -->
                        <div class="volume-header">
                            <div class="volume-controls-header">
                                <div
                                    class="volume-icon-container"
                                    :class="{ 'volume-active': volumeGlow }"
                                    @click="handleVolumeClick"
                                    >
                                    <div class="volume-icon">🔊</div>
                                </div>
                                <div class="volume-titles">
                                    <h3
                                        class="volume-main-title"
                                        :class="{ 'volume-text-active': volumeGlow }"
                                        >
                                        AUDIO AMPLIFICATION MATRIX
                                    </h3>
                                    <p
                                        class="volume-sub-title"
                                        :class="{ 'volume-text-active': volumeGlow }"
                                        >
                                        [CLASSIFIED] QUANTUM VOLUME REGULATOR v3.7.2
                                    </p>
                                </div>
                            </div>
                            <!-- Status Indicators -->
                            <div class="status-indicators">
                                <div
                                    class="status-dot"
                                    :class="{ 'status-active': volumeGlow }"
                                    ></div>
                                <div
                                    class="status-dot"
                                    :class="{ 'status-active': volumeGlow }"
                                    style="animation-delay: 0.2s"
                                    ></div>
                                <div
                                    class="status-dot"
                                    :class="{ 'status-active': volumeGlow }"
                                    style="animation-delay: 0.4s"
                                    ></div>
                            </div>
                        </div>
                        <!-- Technical Readouts -->
                        <div class="technical-readouts">
                            <div
                                class="readout-item"
                                :class="{ 'readout-active': volumeGlow }"
                                >
                                <div class="readout-label">PWR</div>
                                <div class="readout-value">47.3dB</div>
                            </div>
                            <div
                                class="readout-item"
                                :class="{ 'readout-active': volumeGlow }"
                                >
                                <div class="readout-label">FREQ</div>
                                <div class="readout-value">441Hz</div>
                            </div>
                            <div
                                class="readout-item"
                                :class="{ 'readout-active': volumeGlow }"
                                >
                                <div class="readout-label">THD</div>
                                <div class="readout-value">0.03%</div>
                            </div>
                            <div
                                class="readout-item"
                                :class="{ 'readout-active': volumeGlow }"
                                >
                                <div class="readout-label">S/N</div>
                                <div class="readout-value">-97dB</div>
                            </div>
                        </div>
                        <!-- Complex Slider Section -->
                        <div class="slider-section">
                            <!-- Slider Labels -->
                            <div class="slider-labels">
                                <span
                                    class="slider-label"
                                    :class="{ 'label-active': volumeGlow }"
                                    >MIN [-∞dB]</span
                                    >
                                <span
                                    class="slider-label"
                                    :class="{ 'label-active': volumeGlow }"
                                    >NEURAL INTERFACE LOCKED</span
                                    >
                                <span
                                    class="slider-label"
                                    :class="{ 'label-active': volumeGlow }"
                                    >MAX [+12dB]</span
                                    >
                            </div>
                            <!-- Multi-layer Slider Container -->
                            <div
                                class="slider-container"
                                :class="{ 'slider-active': volumeGlow }"
                                >
                                <!-- Circuit Pattern Background -->
                                <div
                                    class="circuit-pattern"
                                    :class="{ 'circuit-active': volumeGlow }"
                                    ></div>
                                <!-- Actual Slider -->
                                <div class="volume-slider" @click="handleVolumeClick">
                                    <div class="slider-track">
                                        <div
                                            class="slider-thumb"
                                            :style="{ left: volume + '%' }"
                                            ></div>
                                    </div>
                                    <!-- Volume Level Indicators -->
                                    <div class="volume-indicators">
                                        <div
                                            v-for="i in 11"
                                            :key="i"
                                            class="volume-indicator"
                                            :class="{ 'indicator-active': (i-1) * 10 <= volume && volumeGlow }"
                                            >
                                            <div class="indicator-line" ></div>
                                            <span class="indicator-number">{{ (i-1) * 10 }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Bottom Status Panel -->
                        <div class="bottom-status">
                            <div
                                class="volume-display"
                                :class="{ 'display-active': volumeGlow }"
                                >
                                <div class="volume-percentage">{{ volume }}%</div>
                                <div class="volume-details">
                                    <div>AMPLITUDE: {{ (volume * 1.27).toFixed(1) }}V</div>
                                    <div>GAIN: {{ (volume * 0.6 - 60).toFixed(1) }}dB</div>
                                </div>
                            </div>
                            <!-- Warning Panel -->
                            <div v-if="volumeGlow" class="quantum-warning">
                                <div class="quantum-indicator" ></div>
                                <div class="quantum-text">QUANTUM LOCK ENGAGED</div>
                            </div>
                            <!-- Biometric Scanner Mock -->
                            <div
                                class="biometric-scanner"
                                :class="{ 'scanner-active': volumeGlow }"
                                >
                                <div class="scanner-label">BIOMETRIC</div>
                                <div class="scanner-icon">🔒</div>
                                <div class="scanner-status">LOCKED</div>
                            </div>
                        </div>
                        <!-- Error Message -->
                        <div v-if="volumeGlow" class="error-message">
                            <div class="error-content">
                                <div class="error-icon">⚠️</div>
                                <p class="error-text">
                                    NEURAL INTERFACE COMPROMISED - MANUAL OVERRIDE REQUIRED
                                </p>
                                <div class="error-icon">⚠️</div>
                            </div>
                            <div class="error-code">
                                ERROR CODE: 0xDEADBEEF | SUBSYSTEM: AUDIO_MATRIX | STATUS:
                                LOCKED
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Instructions button -->
                <div class="instructions-section">
                    <button
                        @click="handleInstructionsClick"
                        class="instructions-button"
                        >
                    <span class="help-icon">❓</span>
                    Click for instructions
                    </button>
                    <!-- Stop button - only show when modals are active -->
                    <div v-if="showModals" class="stop-button-container">
                        <button @click="handleStopClick" class="stop-button">
                        😭 PLEASE MAKE IT STOP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Render instruction modal -->
    <InstructionModal v-if="showModals" />
    <!-- Render lucky button -->
    <LuckyButton
        v-if="showModals"
        @lucky-click="handleLuckyClick"
        @position-change="handleLuckyPositionChange"
	/>
    <!-- Render stalker button -->
    <StalkerButton
        v-if="showModals"
        :lucky-button-position="luckyButtonPosition"
        @publish-click="handlePublishClick"
        :is-visible="showModals"
    />
    <!-- Render draggable modals -->
    <DraggableModal
        v-for="(word, index) in words"
        v-if="showModals"
        :key="index"
        :word="word"
        :index="index"
        @close="() => closeModal(index)"
        :forced-position="organizedPositions ? organizedPositions[index] : null"
    />
    <!-- Render search history modal -->
    <SearchHistoryModal
        v-if="showSearchHistoryModal"
        @close="() => setShowSearchHistoryModal(false)"
	/>
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import InstructionModal from './InstructionModal.vue';
import LuckyButton from './LuckyButton.vue';
import StalkerButton from './StalkerButton.vue';
import DraggableModal from './DraggableModal.vue';
import SearchHistoryModal from './SearchHistoryModal.vue';
import { storeToRefs } from 'pinia';
import useRecDynamicsStore from './_recDynamicsStore.js';
const recDynamicsStore = useRecDynamicsStore();
const { startRecordingTrigger, stopRecordingTrigger } = storeToRefs(recDynamicsStore);

const currentTime = ref(0)
const volume = ref(0)
const showModals = ref(false)
const volumeGlow = ref(false)
const organizedPositions = ref(null)
const showSearchHistoryModal = ref(false)
const luckyButtonPosition = ref({ x: 300, y: 200 })

const duration = 60 // 1 minute fake duration
const isPlaying = true; // Always playing automatically >:)

const words = [
	"To", "control", "the", "volume,", "match", "the", "volume",
	"of", "a", "yell", "to", "the", "desired", "volume."
]

// Generate waveform bars
const waveformBars = computed(() => {
	return Array.from({ length: 80 }).map(() => ({
		height: Math.random() * 80 + 20
	}))
})

let audioInterval = null

// Simulate automatic audio progress
const startAudioProgress = () => {
	audioInterval = setInterval(() => {
		currentTime.value = currentTime.value >= duration ? 0 : currentTime.value + 1
	}, 1000)
}

const formatTime = (seconds) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const handleVolumeClick = () => {
	volumeGlow.value = true;
  startRecordingTrigger.value++;

	setTimeout(() => {
		volumeGlow.value = false;
    stopRecordingTrigger.value++;
	}, 2000)
  // Volume doesn't actually change anything
}

const handleInstructionsClick = () => {
	showModals.value = true;
}

const handleStopClick = () => {
	showModals.value = false;
	organizedPositions.value = null;
}

const handlePublishClick = () => {
	showSearchHistoryModal.value = true;
}

const handleLuckyPositionChange = (position) => {
	luckyButtonPosition.value = position;
}

const handleLuckyClick = () => {
  // Organize modals in correct order for 3 seconds, ensuring they fit in viewport
	const organized = {};

	// Calculate available space
	const modalWidth = 200 // Approximate modal width
	const modalHeight = 100 // Approximate modal height
	const margin = 20 // Margin from screen edges

	const availableWidth = window.innerWidth - margin * 2;
	const availableHeight = window.innerHeight - margin * 2;

	// Calculate optimal spacing and positioning
	const totalModals = words.length;
	const maxModalsPerRow = Math.floor(availableWidth / modalWidth);
	const rows = Math.ceil(totalModals / maxModalsPerRow);
	const modalsPerRow = Math.min(totalModals, maxModalsPerRow);

	// Calculate spacing to center the arrangement
	const horizontalSpacing = Math.min(modalWidth, availableWidth / modalsPerRow);
	const verticalSpacing = Math.min(modalHeight + 50, availableHeight / rows);

	const startX = margin + (availableWidth - modalsPerRow * horizontalSpacing) / 2;
	const startY = margin + (availableHeight - rows * verticalSpacing) / 2;

	words.forEach((_, index) => {
		const row = Math.floor(index / modalsPerRow);
		const col = index % modalsPerRow;

		organized[index] = {
		x: Math.max(
			margin,
			Math.min(
			startX + col * horizontalSpacing,
			window.innerWidth - modalWidth - margin
			)
		),
		y: Math.max(
			margin,
			Math.min(
			startY + row * verticalSpacing,
			window.innerHeight - modalHeight - margin
			)
		)
		}
	})

	organizedPositions.value = organized;
	// Disperse after 3 seconds
	setTimeout(() => {
		organizedPositions.value = null
	}, 3000)
}

const closeModal = (index) => {
  // SURPRISE THEY NEVER CLOSE SUCKA
}

const setShowSearchHistoryModal = (value) => {
	showSearchHistoryModal.value = value;
}

const emit = defineEmits(['close'])

const handleClose = () => {
	emit('close');
}

onMounted(() => {
	startAudioProgress();
})

onUnmounted(() => {
	if (audioInterval) {
		clearInterval(audioInterval);
	}
})
</script>

<style scoped>
.audio-modal-overlay {
	position: fixed;
	top: 40px;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 40;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	animation: foreboding-pulse 4s ease-in-out infinite;
}

.audio-modal {
	background: #1a1a1a;
	border: 2px solid #4a4a4a;
	border-radius: 12px;
	box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
	width: 100%;
	max-width: 1000px;
	max-height: 95vh;
	overflow-y: auto;
	margin: 0 auto;
	position: relative;
}

.close-button {
	position: absolute;
	top: 1rem;
	right: 1rem;
	width: 32px;
	height: 32px;
	background: rgba(75, 75, 75, 0.8);
	color: #ccc;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	z-index: 10;
	font-size: 1.2rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.close-button:hover {
	background: rgba(100, 100, 100, 0.9);
	color: #fff;
}

.audio-player-content {
	padding: 3rem 2rem;
}

.audio-header {
  text-align: center;
  margin-bottom: 2rem;
}

.audio-title {
  font-size: 2rem;
  color: white;
  margin-bottom: 0.5rem;
  font-family: "Impact", sans-serif;
  letter-spacing: 0.1em;
}

.audio-subtitle {
  color: #ff6b6b;
  font-size: 1.2rem;
  font-family: "Courier New", monospace;
  font-weight: bold;
}

.warning-message {
  background: #7f1d1d;
  border: 2px solid #dc2626;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
}

.warning-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.warning-icon {
  color: #fca5a5;
  font-size: 1.5rem;
  margin: -4px 8px 0 8px;

}

.warning-text {
  color: #fca5a5;
  text-transform: uppercase;
  font-family: "Impact", sans-serif;
  font-size: 24px;
}

.warning-content {
  color: #fecaca;
  text-align: center;
  line-height: 1.6;
  margin: 0;
  font-family: "Courier New", monospace;
}

.waveform-container {
  background: #000;
  border-radius: 8px;
  margin-bottom: 2rem;
  padding: 2rem;
  height: 120px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  border: 1px solid #4a4a4a;
}

.waveform-bar {
  width: 8px;
  background: #4b5563;
  transition: all 0.15s ease;
}

.waveform-active {
  background: #10b981 !important;
}

.timeline-section {
  margin-bottom: 2rem;
}

.timeline-labels {
  display: flex;
  justify-content: space-between;
  color: #9ca3af;
  font-family: "Courier New", monospace;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.recording-indicator {
  color: #10b981;
}

.progress-container {
  position: relative;
  height: 16px;
  background: #374151;
  border-radius: 9999px;
  border: 1px solid #4a4a4a;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #10b981;
  border-radius: 9999px;
  transition: width 1s ease;
}

.progress-handle {
  position: absolute;
  top: 0;
  height: 100%;
  width: 4px;
  background: white;
  border-radius: 9999px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  transition: left 1s ease;
}

/* Volume Section Styles */
.volume-section {
  margin-bottom: 2rem;
}

.volume-panel {
  position: relative;
  background: #000;
  border: 2px solid #4a4a4a;
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.5s ease;
}

.volume-glow {
  border-color: #dc2626;
  animation: volume-panel-glow 3s ease-in-out infinite;
}

.volume-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.2;
  background-image:
    linear-gradient(rgba(139, 0, 0, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 0, 0, 0.3) 1px, transparent 1px);
  background-size: 20px 20px;
}

.volume-scanner {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  animation: volume-scanner 2s linear infinite;
}

.scanner-line {
  height: 100%;
  width: 4px;
  background: linear-gradient(to bottom, transparent, #dc2626, transparent);
  opacity: 0.8;
}

.volume-header {
  position: relative;
  z-index: 10;
  margin-bottom: 1.5rem;
}

.volume-controls-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.volume-icon-container {
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid #4a4a4a;
  background: #374151;
  transition: all 0.3s ease;
}

.volume-active {
  border-color: #fca5a5;
  background: #7f1d1d;
}

.volume-icon {
  font-size: 1.5rem;
  filter: grayscale(1);
  transition: all 0.3s ease;
}

.volume-active .volume-icon {
  filter: grayscale(0);
  animation: volume-indicator-pulse 0.8s ease-in-out infinite;
}

.volume-titles {
  flex: 1;
}

.volume-main-title {
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  transition: color 0.3s ease;
}

.volume-text-active {
  color: #fca5a5;
}

.volume-sub-title {
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  transition: color 0.3s ease;
}

.status-indicators {
  display: flex;
  gap: 0.5rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4b5563;
  transition: all 0.3s ease;
}

.status-active {
  background: #dc2626;
  animation: volume-indicator-pulse 0.8s ease-in-out infinite;
}

.technical-readouts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.readout-item {
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #4a4a4a;
  background: #374151;
  transition: all 0.3s ease;
}

.readout-active {
  border-color: #fca5a5;
  background: #450a0a;
}

.readout-label {
  font-family: "Courier New", monospace;
  color: #9ca3af;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.readout-active .readout-label {
  color: #fca5a5;
}

.readout-value {
  font-family: "Courier New", monospace;
  color: #e5e7eb;
  font-size: 0.9rem;
  font-weight: bold;
}

.readout-active .readout-value {
  color: #fecaca;
}

.slider-section {
  position: relative;
  z-index: 10;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.slider-label {
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  color: #9ca3af;
  transition: color 0.3s ease;
}

.label-active {
  color: #fca5a5;
}

.slider-container {
  position: relative;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #4a4a4a;
  background: #374151;
  transition: all 0.3s ease;
}

.slider-active {
  border-color: #dc2626;
  background: #450a0a;
}

.circuit-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
  background-image:
    radial-gradient(
      circle at 20% 20%,
      rgba(139, 0, 0, 0.3) 1px,
      transparent 1px
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(139, 0, 0, 0.3) 1px,
      transparent 1px
    ),
    linear-gradient(
      45deg,
      transparent 48%,
      rgba(139, 0, 0, 0.2) 50%,
      transparent 52%
    );
  background-size:
    30px 30px,
    25px 25px,
    40px 40px;
}

.circuit-active {
  animation: volume-circuit 1.5s ease-in-out infinite;
}

.volume-slider {
  position: relative;
  cursor: pointer;
  margin-bottom: 2rem;
}

.slider-track {
  position: relative;
  height: 12px;
  background: #1f2937;
  border-radius: 6px;
  border: 1px solid #374151;
}

.slider-thumb {
  position: absolute;
  top: -4px;
  width: 20px;
  height: 20px;
  background: #dc2626;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
  transition: left 0.3s ease;
}

.volume-indicators {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

.volume-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  color: #6b7280;
}

.indicator-active {
  color: #fca5a5;
}

.indicator-line {
  width: 2px;
  height: 12px;
  background: #4b5563;
  margin-bottom: 0.25rem;
}

.indicator-active .indicator-line {
  background: #fca5a5;
}

.indicator-number {
  color: inherit;
}

.bottom-status {
  position: relative;
  z-index: 10;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.volume-display {
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #4a4a4a;
  background: #374151;
  transition: all 0.3s ease;
}

.display-active {
  border-color: #fca5a5;
  background: #450a0a;
}

.volume-percentage {
  font-family: "Courier New", monospace;
  font-size: 1.5rem;
  color: #e5e7eb;
  margin-bottom: 0.5rem;
}

.display-active .volume-percentage {
  color: #fca5a5;
}

.volume-details {
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  color: #9ca3af;
  line-height: 1.4;
}

.display-active .volume-details {
  color: #fca5a5;
}

.quantum-warning {
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #eab308;
  background: #451a03;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: pulse 1s ease-in-out infinite;
}

.quantum-indicator {
  width: 16px;
  height: 16px;
  background: #eab308;
  border-radius: 50%;
  animation: volume-indicator-pulse 0.8s ease-in-out infinite;
}

.quantum-text {
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  color: #fde047;
  text-transform: uppercase;
}

.biometric-scanner {
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #4a4a4a;
  background: #374151;
  text-align: center;
  transition: all 0.3s ease;
}

.scanner-active {
  border-color: #fca5a5;
  background: #450a0a;
}

.scanner-label {
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
}

.scanner-active .scanner-label {
  color: #fca5a5;
}

.scanner-icon {
  font-size: 1.2rem;
  margin: 0.25rem 0;
}

.scanner-status {
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  color: #9ca3af;
}

.scanner-active .scanner-status {
  color: #fca5a5;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #dc2626;
  background: #450a0a;
  animation: pulse 1s ease-in-out infinite;
}

.error-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.error-icon {
  color: #fca5a5;
  font-size: 1.2rem;
}

.error-text {
  color: #fca5a5;
  text-align: center;
  font-family: "Courier New", monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  font-size: 0.9rem;
}

.error-code {
  color: #fca5a5;
  text-align: center;
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
}

.instructions-section {
  text-align: center;
  margin-top: 2rem;
}

.instructions-button {
  background: #374151;
  border: 1px solid #4a4a4a;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.instructions-button:hover {
  background: #4b5563;
}

.help-icon {
  font-size: 1rem;
}

.stop-button-container {
  margin-top: 1rem;
}

.stop-button {
  background: #7f1d1d;
  border: 1px solid #dc2626;
  color: #fecaca;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.stop-button:hover {
  background: #991b1b;
  color: white;
}

@media (max-width: 768px) {
  .audio-player-content {
    padding: 2rem 1rem;
  }

  .audio-title {
    font-size: 1.5rem;
  }

  .waveform-container {
    height: 80px;
    padding: 1rem;
  }

  .technical-readouts {
    grid-template-columns: repeat(2, 1fr);
  }

  .volume-sub-title {
    display: none;
  }

  .bottom-status {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>