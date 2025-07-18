<template>
<div id="recDynamics" :class="['rec-dynamics', { joyful: defeatedTheProgram }]">
	<div :class="['rec-dynamics-container-joyful', { show: defeatedTheProgram, hidden: !defeatedTheProgram }]">
		<!-- Joyful state -->
		<div class="cloud">
			<div class="joyful-content">
				<h1 class="joyful-title">You defeated the program!</h1>
				<p class="joyful-message">Congratulations! Your data is safe for another day.</p>
			</div>
		</div>

	</div>
	<div :class="['rec-dynamics-container-angry', { show: !defeatedTheProgram, hidden: defeatedTheProgram }]">
		<DragDropProvider>
		<div class="flop-container">
			<!-- Base distressed texture layer -->
			<div
				class="texture-layer"
				:style="{
					backgroundImage: `
						linear-gradient(45deg, rgba(139,69,19,0.3) 0%, transparent 25%, rgba(105,105,105,0.4) 50%, transparent 75%, rgba(139,69,19,0.2) 100%),
						radial-gradient(circle at 30% 20%, rgba(220,20,60,0.2) 0%, transparent 40%),
						radial-gradient(circle at 70% 80%, rgba(105,105,105,0.3) 0%, transparent 50%),
						url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23696969\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')
					`,
					backgroundSize: '300px 300px, 400px 400px, 350px 350px, 60px 60px',
			}"
			></div>

			<!-- Heavy grungy distressed overlay -->
			<div class="distressed-overlay">
				<div
					class="distressed-inner"
					:style="{
						backgroundImage: `
						radial-gradient(circle at 15% 30%, rgba(105,105,105,0.8) 0%, transparent 60%),
						radial-gradient(circle at 85% 70%, rgba(139,0,0,0.6) 0%, transparent 50%),
						radial-gradient(circle at 50% 90%, rgba(169,169,169,0.7) 0%, transparent 40%),
						radial-gradient(circle at 20% 80%, rgba(178,34,34,0.5) 0%, transparent 45%),
						linear-gradient(25deg, transparent 45%, rgba(105,105,105,0.4) 48%, rgba(139,0,0,0.3) 52%, transparent 55%),
						linear-gradient(-65deg, transparent 40%, rgba(169,169,169,0.3) 49%, transparent 51%),
						linear-gradient(95deg, transparent 30%, rgba(105,105,105,0.5) 48%, transparent 52%),
						url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\' viewBox=\'0 0 120 120\'%3E%3Cg fill-opacity=\'0.25\'%3E%3Cpath d=\'M15 25c4.5 0 8-3.5 8-8s-3.5-8-8-8-8 3.5-8 8 3.5 8 8 8zm55 30c4.5 0 8-3.5 8-8s-3.5-8-8-8-8 3.5-8 8 3.5 8 8 8zm-50-10c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4zm70 35c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4zM40 100c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4zm65-85c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4z\' fill=\'%238B0000\'/%3E%3Cpath d=\'M25 15c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5zm35 25c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5zm-25 35c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5zm45 20c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5z\' fill=\'%23696969\'/%3E%3C/g%3E%3C/svg%3E')
						`,
						backgroundSize:
							'250px 250px, 180px 180px, 220px 220px, 160px 160px, 8px 8px, 12px 12px, 6px 6px, 120px 120px',
					}"
				>
				<!-- Scratches and wear marks -->
				<div class="scratches-layer">
					<div
						class="scratches-inner"
						:style="{
						backgroundImage: `
							linear-gradient(15deg, transparent 0%, rgba(105,105,105,0.7) 1%, transparent 3%),
							linear-gradient(165deg, transparent 0%, rgba(139,0,0,0.5) 0.5%, transparent 2%),
							linear-gradient(75deg, transparent 0%, rgba(169,169,169,0.6) 1%, transparent 2.5%),
							linear-gradient(-30deg, transparent 0%, rgba(105,105,105,0.4) 0.8%, transparent 1.5%),
							linear-gradient(120deg, transparent 0%, rgba(178,34,34,0.5) 1.2%, transparent 2.8%),
							radial-gradient(ellipse 200px 50px at 30% 40%, rgba(105,105,105,0.3) 0%, transparent 70%),
							radial-gradient(ellipse 150px 30px at 80% 70%, rgba(139,0,0,0.4) 0%, transparent 70%)
						`,
						backgroundSize:
							'300px 100%, 250px 100%, 180px 100%, 220px 100%, 160px 100%, 400px 200px, 350px 150px',
						backgroundPosition: '0 15%, 0 45%, 0 75%, 0 25%, 0 65%, 0 20%, 0 80%',
						}"
				></div>
			</div>

			<!-- Rust and corrosion effects -->
			<div class="rust-layer">
				<div
					class="rust-inner"
					:style="{
					backgroundImage: `
						radial-gradient(circle at 25% 25%, rgba(165,42,42,0.6) 0%, transparent 30%),
						radial-gradient(circle at 75% 15%, rgba(128,128,128,0.5) 0%, transparent 25%),
						radial-gradient(circle at 40% 85%, rgba(139,69,19,0.4) 0%, transparent 35%),
						radial-gradient(circle at 90% 60%, rgba(105,105,105,0.7) 0%, transparent 20%),
						radial-gradient(circle at 10% 70%, rgba(178,34,34,0.5) 0%, transparent 40%)
					`,
					backgroundSize: '200px 200px, 150px 150px, 180px 180px, 120px 120px, 160px 160px',
				}"
				></div>
				</div>
			</div>
		</div>

			<!-- Atmospheric lighting with red and grey tones -->
			<div class="lighting-top"></div>
			<div class="lighting-bottom"></div>
			<div class="glow-red-1"></div>
			<div class="glow-gray-1"></div>
			<div class="glow-red-2"></div>

			<!-- Foreboding countdown timer -->
			<CountdownTimer />

			<div class="main-content content-spacing">
				<RansomNote @listen-click="handleListenClick" />
				<AudioPlayer v-if="showAudioPlayer" @close="handleAudioPlayerClose" />
			</div>
		</div>
		</DragDropProvider>
	</div>
	<Listener/>
</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import RansomNote from './recDynamics/RansomNote.vue';
import AudioPlayer from './recDynamics/AudioPlayer.vue';
import DragDropProvider from './recDynamics/DragDropProvider.vue';
import CountdownTimer from './recDynamics/CountdownTimer.vue';
import Listener from './recDynamics/Listener.vue';
import { storeToRefs } from 'pinia';
import useRecDynamicsStore from './recDynamics/_recDynamicsStore.js';
const recDynamicsStore = useRecDynamicsStore();
const { defeatedTheProgram } = storeToRefs(recDynamicsStore);

const showAudioPlayer = ref(false)
const tailwind = document.createElement('script');
tailwind.setAttribute('src', 'https://cdn.tailwindcss.com');


const handleListenClick = () => {
	showAudioPlayer.value = true;
}

const handleAudioPlayerClose = () => {
	showAudioPlayer.value = false;
}

onMounted(() => {
	document.head.appendChild(tailwind)
});

onUnmounted(() => {
	tailwind.parentNode.removeChild(tailwind);
});
</script>
<style scoped>
@import url('./recDynamics/globals.css');
.rec-dynamics {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	position: absolute;
	top: 34px;
	left: 0;
	right: 0;
	overflow: hidden;
	background: #1a1a1a;
	color: #e5e7eb;
	min-height: 100vh;
	line-height: 1.5;
	&.joyful{
		background-color: floralwhite;
		width: 100%;
		height: 100%;
		border-radius: 1rem; /* Rounded corners for the div */
		overflow: hidden; /* Ensure icons stay within bounds */
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* Subtle shadow */
		display: flex;
		justify-content: center;
		align-items: center;
		color: #4a5568; /* Text color */
		font-size: 2rem; /* Larger text for visibility */
		font-weight: bold;
		text-align: center;

		/* Cheerful Repeating Icons Background */
		background-image:
			/* Top row of icons */
			url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="90" font-size="90" text-anchor="middle" x="50">🌟</text></svg>'),
			url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="90" font-size="90" text-anchor="middle" x="50">🌈</text></svg>'),
			url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="90" font-size="90" text-anchor="middle" x="50">💖</text></svg>'),
			/* Middle row of icons */
			url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="90" font-size="90" text-anchor="middle" x="50">☀️</text></svg>'),
			url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="90" font-size="90" text-anchor="middle" x="50">🌸</text></svg>'),
			url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="90" font-size="90" text-anchor="middle" x="50">🎈</text></svg>');

		background-position:
			0px 0px, 50px 0px, 100px 0px, /* Positions for top row */
			0px 50px, 50px 50px, 100px 50px; /* Positions for middle row */

		background-repeat: repeat; /* This makes the icons repeat */
		background-size: 50px 50px; /* Size of each icon */
		background-color: #e2e8f0; /* Light blue-gray background */
	}
}

.rec-dynamics-container-joyful {
	.cloud {
		height: 300px;
		width: 600px;
		margin: auto;
		aspect-ratio: 1.8;
		--g: radial-gradient(50% 50%, #000 98%, #0000) no-repeat;
		mask: var(--g) 100% 100%/30% 60%,var(--g) 70% 0/50% 100%,var(--g) 0 100%/36% 68%,var(--g) 27% 18%/26% 40%,linear-gradient(#000 0 0) bottom/67% 58% no-repeat;
		background: #269af2;
	}
	.joyful-content {
		text-align: center;
		width: 100%;
		display: grid;
		justify-items: center;
		font-weight: bold;
		.joyful-title {
			margin-top: 145px;
			width: fit-content;
			background-image: linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
		.joyful-message {
			width: fit-content;
			background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	}
}

.show{
	visibility: visible;
}

.hidden {
	visibility: hidden;
}
</style>
