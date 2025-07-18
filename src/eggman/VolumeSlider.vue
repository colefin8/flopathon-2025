<script setup>
const props = defineProps({
  volume: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  }
})
</script>

<template>
  <div class="volume-slider">
    <div class="slider-track">
      <div 
        class="slider-fill"
        :style="{ width: `${props.volume}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.volume-slider {
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-track {
  width: 411px;
  height: 43px;
  background-color: var(--primary-color);
  border: 2px solid var(--primary-color);
  position: relative;
  overflow: hidden;
}

.slider-fill {
  height: 100%;
  background-color: #919191;
  transition: width 0.3s ease;
}
</style>
