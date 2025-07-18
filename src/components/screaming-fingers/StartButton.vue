<!-- components/StartButton.vue -->
<script setup>
const emit = defineEmits(['start'])

function handleClick() {
  emit('start')
}
</script>

<template>
  <button @click="handleClick" class="start-button">
    To Change Your Volume, Take the Typing Test!
  </button>
</template>

<style scoped>
.start-button {
  display: block;
  margin: 3rem auto;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  background-color: #ff00aa;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  animation: pulse 1.2s infinite;
}

.start-button:hover {
  background-color: #ff33cc;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>
