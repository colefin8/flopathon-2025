<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  volume: Number,
})

const sliderValue = ref(props.volume)

watch(() => props.volume, (val) => {
  sliderValue.value = val
})
</script>

<template>
  <div class="slider">
    <label>Final Volume</label>
    <input type="range" min="0" max="100" v-model="sliderValue" disabled />
  </div>
</template>

<style scoped>
.slider {
  margin-top: 1rem;
}
</style>
