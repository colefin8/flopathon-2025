<script setup>
import { computed } from 'vue'

const props = defineProps({
  volume: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  },
  message: {
    type: String,
    default: null
  }
})

const displayText = computed(() => {
  return props.message || `${props.volume} volume`
})
</script>

<template>
  <div class="note fancy-border">
    <div class="note-content">
      {{ displayText }}
    </div>
  </div>
</template>

<style scoped>
.note {
  --fancy-border-bg: var(--off-white);
  background: var(--off-white);
  border-left: var(--line-width) solid black;
  border-right: var(--line-width) solid black;
  border-bottom: var(--line-width) solid black;
  width: 343px;
  min-height: 172px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.note-content {
  font-family: 'Press Start 2P', monospace;
  font-size: 12px;
  position: relative;
  top: 5px;
  user-select: none;
}
</style>