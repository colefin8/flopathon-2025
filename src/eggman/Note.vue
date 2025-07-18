<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  volume: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  },
  message: {
    type: String,
    default: null
  },
  showNote: {
    type: Boolean,
    default: true
  },
  warning: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['buyMoreEggs']);

const inputValue = ref('');

const displayText = computed(() => {
  return props.message || `${props.volume} volume`
})

const handleEnterKey = () => {
  if (inputValue.value.toLowerCase() === 'yes') {
    emit('buyMoreEggs')
    inputValue.value = '';
  }
}
</script>

<template>
  <div
    class="note fancy-border"
    v-show="showNote"
    :style="props.warning ? { '--primary-color': '#a00' } : {}"
  >
    <div class="note-content" :style="{ color: 'var(--primary-color)' }">
      <template v-if="props.warning">
        <div class="warning-container">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            style="border-radius: 8px;"
          >
            <polygon points="50,10 90,90 10,90" fill="#a00" />
            <rect x="45" y="35" width="10" height="30" rx="4" fill="#fff" />
            <ellipse cx="50" cy="75" rx="7" ry="6" fill="#fff" />
          </svg>
          <div class="warning-message">{{ displayText }}</div>
          <input
            v-model="inputValue"
            @keyup.enter="handleEnterKey"
            class="warning-input"
            type="text"
          />
        </div>
      </template>
      <template v-else>
        {{ displayText }}
      </template>
    </div>
  </div>
</template>

<style scoped>
.note {
  --fancy-border-bg: var(--off-white);
  background: var(--off-white);
  border-left: var(--line-width) solid var(--primary-color);
  border-right: var(--line-width) solid var(--primary-color);
  border-bottom: var(--line-width) solid var(--primary-color);
  padding: 21px;
  line-height: 20px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--primary-color);
}

.warning-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.warning-message {
  font-size: 12px;
  text-align: center;
  color: var(--primary-color);
}

.warning-input {
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  background: var(--off-white);
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  padding: 8px;
  text-align: center;
  width: 200px;
  outline: none;
}

.warning-input::placeholder {
  color: var(--primary-color);
  opacity: 0.7;
}
</style>
