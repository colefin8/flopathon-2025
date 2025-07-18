<script setup>
import { computed } from 'vue'

const props = defineProps({
	mistakes: Number,
	keystrokes: Number,
})

const meterHeight = computed(() => `${100 - Math.min(props.mistakes * 6, 100)}%`)
</script>

<template>
	<div class="mistake-meter">
		<div class="meter-fill" :style="{ height: meterHeight }"></div>
	</div>
</template>

<style scoped>
.mistake-meter {
	height: 200px;
	width: 20px;
	border: 2px solid black;
	display: flex;
	flex-direction: column;
	justify-content: flex-start; /* Align fill at the bottom */
	background: linear-gradient(to top, green, yellow, red); /* Gradient flows upward */
}
.meter-fill {
	width: 100%;
	background: white;
}
</style>