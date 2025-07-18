<template>
	<div v-if="timeUp" :class="['red-envelope', { show: showMessage }]">
		<div class="ransom-message text-center animate-ransom-text-appear">
			<div
				class="absolute inset-0 transform -rotate-1"
				style="
				background-image:
					linear-gradient(
					45deg,
					rgb(245, 245, 220) 0%,
					rgb(230, 230, 230) 25%,
					rgb(240, 240, 240) 50%,
					rgb(230, 230, 230) 75%,
					rgb(245, 245, 220) 100%
					),
					radial-gradient(
					circle at 20% 30%,
					rgba(139, 69, 19, 0.1) 0%,
					transparent 50%
					),
					radial-gradient(
					circle at 80% 70%,
					rgba(105, 105, 105, 0.1) 0%,
					transparent 40%
					),
					linear-gradient(
					25deg,
					transparent 40%,
					rgba(139, 69, 19, 0.05) 42%,
					transparent 44%
					),
					linear-gradient(
					-15deg,
					transparent 60%,
					rgba(105, 105, 105, 0.05) 62%,
					transparent 64%
					);
				filter: drop-shadow(rgba(0, 0, 0, 0.3) 8px 8px 20px);
				border: 3px solid rgb(139, 69, 19);
				border-radius: 8px;
				"
			></div>
			<div class="relative p-16 max-w-4xl">
				<div
				class="text-6xl text-black mt-4 tracking-wider"
				style="
					font-family:
					Impact,
					Arial Black,
					sans-serif;
					text-shadow:
					rgba(139, 0, 0, 0.5) 4px 4px 8px,
					rgba(0, 0, 0, 0.8) -2px -2px 4px;
					transform: rotate(1deg);
					letter-spacing: 0.15em;
				"
				>
					<span
						style="
						background: linear-gradient(
							45deg,
							rgb(139, 0, 0),
							rgb(220, 20, 60),
							rgb(139, 0, 0)
							)
							text;
						-webkit-text-fill-color: transparent;
						filter: drop-shadow(rgba(0, 0, 0, 0.5) 2px 2px 4px);
						"
					>
						NOW YOUR
					</span>
				</div>
				<div
					class="text-8xl text-black tracking-wider leading-tight"
					style="
						font-family:
						Impact,
						Arial Black,
						sans-serif;
						text-shadow:
						rgba(139, 0, 0, 0.5) 4px 4px 8px,
						rgba(0, 0, 0, 0.8) -2px -2px 4px;
						transform: rotate(-1deg);
						letter-spacing: 0.2em;
					"
				>
					<span
						style="
						background: linear-gradient(
							45deg,
							rgb(139, 0, 0),
							rgb(220, 20, 60),
							rgb(139, 0, 0)
							)
							text;
						-webkit-text-fill-color: transparent;
						filter: drop-shadow(rgba(0, 0, 0, 0.2) 2px 2px 4px);
						"
					>
						MOM KNOWS
					</span>
				<div
					class="text-6xl text-black mt-4 tracking-wider"
					style="
					font-family:
						Impact,
						Arial Black,
						sans-serif;
					text-shadow:
						rgba(139, 0, 0, 0.5) 4px 4px 8px,
						rgba(0, 0, 0, 0.8) -2px -2px 4px;
					transform: rotate(1deg);
					letter-spacing: 0.15em;
					"
				>
					<span
						style="
							background: linear-gradient(
								45deg,
								rgb(139, 0, 0),
								rgb(220, 20, 60),
								rgb(139, 0, 0)
							)
							text;
							-webkit-text-fill-color: transparent;
							filter: drop-shadow(rgba(0, 0, 0, 0.5) 2px 2px 4px);
						"
					>
						EVERYTHING
					</span>
				</div>
				<div class="skull-symbols">💀💀💀</div>
				</div>
				<div
				class="absolute -top-2 left-4 w-8 h-8 bg-white transform rotate-45 opacity-80"
				></div>
				<div
				class="absolute -bottom-2 right-8 w-6 h-6 bg-white transform rotate-12 opacity-80"
				></div>
				<div
				class="absolute top-1/2 -left-2 w-4 h-8 bg-white transform -rotate-12 opacity-80"
				></div>
				<div
				class="absolute top-1/4 -right-2 w-6 h-4 bg-white transform rotate-45 opacity-80"
				></div>
				<div
				class="absolute top-8 right-12 w-12 h-12 bg-red-800 rounded-full opacity-60 transform rotate-12"
				></div>
				<div
				class="absolute bottom-16 left-8 w-8 h-8 bg-red-900 rounded-full opacity-40"
				></div>
				<div
				class="absolute top-1/3 left-1/4 w-4 h-6 bg-red-700 rounded-full opacity-50 transform -rotate-45"
				></div>
			</div>
		</div>
	</div>
	<div class="countdown-container">
		<div v-if="!timeUp" class="countdown-timer" :class="getTimerClass()">
			<div class="timer-glow"></div>
			<div class="timer-display">
				<div class="timer-numbers">{{ formatTime(timerCountdownValue) }}</div>
				<div class="timer-label">TIME REMAINING</div>
			</div>
			<div class="timer-effects">
				<div class="spark spark-1"></div>
				<div class="spark spark-2"></div>
				<div class="spark spark-3"></div>
				<div class="spark spark-4"></div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import useRecDynamicsStore from './_recDynamicsStore.js';
const recDynamicsStore = useRecDynamicsStore();
const { timerCountdownValue, defeatedTheProgram, standardCountVal } = storeToRefs(recDynamicsStore);

const timeUp = ref(false);
const showMessage = ref(false);
let interval = null;

const formatTime = (seconds) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const getTimerClass = () => {
	if (timerCountdownValue?.value <= 10) return 'timer-critical';
	if (timerCountdownValue?.value <= 30) return 'timer-warning';
	return 'timer-normal';
}

const startTimer = () => {
	interval = setInterval(() => {
		if (timerCountdownValue.value > 0) {
			timerCountdownValue.value--;
		}
		else {
			clearInterval(interval);
			timeUp.value = true;
			setTimeout(() => {
				showMessage.value = true;
			}, 100)
		}
	}, 1000)
}

const stopTimer = () => {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
}


onMounted(() => {
	startTimer();
})

onUnmounted(() => {
	if (interval) {
		clearInterval(interval);
	}
})

watch(defeatedTheProgram, (newValue) => {
	if (newValue) {
		stopTimer();
	}
	else {
		if(defeatedTheProgram.value) {
			// You've defeated it once, you get less time next time
			timerCountdownValue.value = standardCountVal / 4;
			defeatedTheProgram.value = false;
		}
		startTimer();
	}
});

</script>
<style scoped>
.countdown-container {
	position: fixed;
	top: 2rem;
	right: 0;
	transform: translateX(-50%);
	z-index: 50;
}
.countdown-timer {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 300px;
	height: 120px;
	background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
	border: 3px solid #4a4a4a;
	border-radius: 15px;
	box-shadow:
		0 0 30px rgba(139, 0, 0, 0.5),
		inset 0 0 20px rgba(0, 0, 0, 0.8);
	overflow: hidden;
}
.timer-glow {
	position: absolute;
	top: -50%;
	left: -50%;
	right: -50%;
	bottom: -50%;
	background: radial-gradient(circle, rgba(139, 0, 0, 0.3) 0%, transparent 70%);
	animation: timer-pulse 2s ease-in-out infinite;
}
.timer-display {
	position: relative;
	z-index: 2;
	text-align: center;
}
.timer-numbers {
	font-family: "Courier New", monospace;
	font-size: 3rem;
	font-weight: bold;
	color: #ff0000;
	text-shadow:
		0 0 10px #ff0000,
		0 0 20px #ff0000,
		0 0 30px #ff0000;
	margin-bottom: 0.5rem;
}
.timer-label {
	font-family: "Impact", sans-serif;
	font-size: 0.9rem;
	color: #cccccc;
	letter-spacing: 0.2em;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}
.timer-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
.spark {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ff0000;
  border-radius: 50%;
  box-shadow: 0 0 10px #ff0000;
}
.spark-1 {
  top: 20%;
  left: 10%;
  animation: spark-float 3s ease-in-out infinite;
}
.spark-2 {
  top: 30%;
  right: 15%;
  animation: spark-float 2.5s ease-in-out infinite 0.5s;
}
.spark-3 {
  bottom: 25%;
  left: 20%;
  animation: spark-float 2.8s ease-in-out infinite 1s;
}
.spark-4 {
  bottom: 20%;
  right: 10%;
  animation: spark-float 3.2s ease-in-out infinite 1.5s;
}
/* Timer state classes */
.timer-normal {
  border-color: #4a4a4a;
}
.timer-normal .timer-numbers {
  color: #00ff00;
  text-shadow:
    0 0 10px #00ff00,
    0 0 20px #00ff00;
}
.timer-warning {
  border-color: #ff8800;
  animation: timer-warning-pulse 1s ease-in-out infinite;
}
.timer-warning .timer-numbers {
  color: #ff8800;
  text-shadow:
    0 0 10px #ff8800,
    0 0 20px #ff8800,
    0 0 30px #ff8800;
}
.timer-critical {
  border-color: #ff0000;
  animation: timer-critical-shake 0.1s ease-in-out infinite;
}
.timer-critical .timer-numbers {
  color: #ff0000;
  text-shadow:
    0 0 15px #ff0000,
    0 0 30px #ff0000,
    0 0 45px #ff0000;
  animation: timer-critical-flash 0.5s ease-in-out infinite;
}
.red-envelope {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #1a1a1a;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%232c2c2c' d='M50 0 C25 25 25 75 50 100 C75 75 75 25 50 0 Z'/%3E%3C/svg%3E");
	background-repeat: repeat;
	background-size: 50px 50px;
	animation: eerie-pulse 20s infinite linear;
	border-radius: 0;
	opacity: 0;
	z-index: 100;
	transition: opacity 5s ease-in-out;
	&.show {
		opacity: 1;
		.ransom-message {
			opacity: 1;
		}
	}
}
@keyframes eerie-pulse {
	0% {
		background-position: 0% 0%;
	}
	100% {
		background-position: 100% 100%; /* Moves the background diagonally */
	}
}
.ransom-message {
  opacity: 0;
  z-index: 1000;
  text-align: center;
  background-color: beige;
  position: absolute;
  top: 24px;
  width: 50%;
  left: 25%;
  animation:
    opacity 5s ease-in-out,
    shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  transform: rotate(-2deg);
}
.ransom-final-text {
  font-family: "Impact", sans-serif;
  font-size: 4rem;
  color: #ffffff;
  text-shadow:
    3px 3px 0px #000000,
    6px 6px 10px rgba(139, 0, 0, 0.8);
  margin: 0;
  letter-spacing: 0.2em;
  background: linear-gradient(
      45deg,
      rgb(139, 0, 0),
      rgb(220, 20, 60),
      rgb(139, 0, 0)
    )
    text;
  -webkit-text-fill-color: transparent;
  transform: rotate(-2deg);
  filter: drop-shadow(rgba(0, 0, 0, 0.5) 2px 2px 4px);
}
.skull-symbols {
  font-size: 3rem;
  margin-top: 1rem;
  animation: menacing-shake 0.3s ease-in-out infinite;
}
/* Animations */
@keyframes timer-pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
@keyframes timer-warning-pulse {
  0%,
  100% {
    box-shadow:
      0 0 30px rgba(255, 136, 0, 0.5),
      inset 0 0 20px rgba(0, 0, 0, 0.8);
  }
  50% {
    box-shadow:
      0 0 50px rgba(255, 136, 0, 0.8),
      inset 0 0 30px rgba(255, 136, 0, 0.2);
  }
}
@keyframes timer-critical-shake {
  0%,
  100% {
    transform: translateX(-50%) translateY(0px);
  }
  25% {
    transform: translateX(-50%) translateY(-2px);
  }
  75% {
    transform: translateX(-50%) translateY(2px);
  }
}
@keyframes timer-critical-flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
@keyframes spark-float {
  0%,
  100% {
    transform: translateY(0px);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}
@media (max-width: 768px) {
  .countdown-timer {
    width: 250px;
    height: 100px;
  }
  .timer-numbers {
    font-size: 2.5rem;
  }
  .timer-label {
    font-size: 0.8rem;
  }
  .ransom-final-text {
    font-size: 2.5rem;
  }
  .skull-symbols {
    font-size: 2rem;
  }
}
.ransom-note-container {
  /* Basic container styling */
  display: flex;
  flex-wrap: wrap; /* Allows words to wrap to the next line */
  gap: 12px; /* Increased space between "cut-out" words */
  padding: 30px; /* Increased padding */
  background-color: #4a3e35; /* Dark, grimy paper background for the container */
  border: 2px solid #2c2520; /* Even darker, stark border */
  box-shadow: 10px 10px 25px rgba(0, 0, 0, 0.7); /* Much stronger, darker shadow for depth */
  max-width: 95%; /* Responsive width */
  /* More irregular border-radius for a rougher container edge */
  border-radius: 15px 10px 18px 12px / 12px 16px 11px 14px;
  position: relative;
}
.ransom-word {
  display: inline-block; /* Allows individual transformation and background */
  padding: 8px 15px; /* Increased padding around each word */
  margin: 4px; /* Small margin for spacing */
  color: #fff; /* White text color for stark contrast */
  text-transform: uppercase; /* All caps for ransom note effect */
  line-height: 1; /* Tightly packed text */
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.7); /* Stronger shadow for cut-out effect */
  white-space: nowrap; /* Prevent words from breaking */
  transition:
    transform 0.1s ease-out,
    box-shadow 0.1s ease-out; /* Smooth transition for hover effect */
  cursor: default; /* Indicate it's not clickable */
  filter: brightness(1.2) contrast(1.5); /* Enhance contrast and brightness for a stark look */
}
@keyframes shake {
  0% {
    transform: translateX(0);
  }
  10% {
    transform: translateX(-5px);
  }
  20% {
    transform: translateX(5px);
  }
  30% {
    transform: translateX(-5px);
  }
  40% {
    transform: translateX(5px);
  }
  50% {
    transform: translateX(-5px);
  }
  60% {
    transform: translateX(5px);
  }
  70% {
    transform: translateX(-5px);
  }
  80% {
    transform: translateX(5px);
  }
  90% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
