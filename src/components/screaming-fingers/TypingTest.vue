<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import MistakeMeter from './MistakeMeter.vue'
import VolumeDisplay from './VolumeSlider.vue'

const props = defineProps({
  typingAudio: Array,
})

const emit = defineEmits(['complete'])

const typingVolume = ref(0.1)
const words = ref([])
const input = ref('')
const mistakes = ref(0)
const keystrokes = ref(0)
const startTime = ref(null)
const backgroundColor = ref('#fff')
const remainingTime = ref(10)
const timerInterval = ref(null)
const loading = ref(true)
const audioLoaded = ref(false)

function checkAudioLoaded(audioSources) {
  let loadedCount = 0
  audioSources.forEach((source) => {
    const audio = new Audio(source)
    audio.preload = 'auto'

    audio.addEventListener('canplaythrough', () => {
      loadedCount++
      if (loadedCount === audioSources.length) {
        audioLoaded.value = true
        loading.value = false
      }
    })
  })
}

function startTimer() {
  remainingTime.value = 10
  timerInterval.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      clearInterval(timerInterval.value)
      console.log('Timer ended, final WPM:', WPM.value)
      emit('complete', successPercentage.value)
    }
  }, 1000)
}

const WPM = computed(() => {
  if (!startTime.value || isNaN(keystrokes.value)) return 0
  const minutes = (Date.now() - startTime.value) / 60000
  if (!minutes || minutes <= 0) return 0
  const wpm = keystrokes.value / 5 / minutes
  return isFinite(wpm) && wpm >= 0 ? Math.floor(wpm) : 0
})

const successPercentage = computed(() => {
  const total = keystrokes.value
  const errorFree = total - mistakes.value
  return total === 0 ? 0 : Math.max(0, Math.floor((errorFree / total) * 100))
})

function generateWords() {
  const sampleWords = [
    'banana',
    'chaos',
    'fizz',
    'weird',
    'nonsense',
    'vortex',
    'echo',
    'taco',
    'pogo',
    'explode',
  ]
  words.value = Array.from(
    { length: 50 },
    () => sampleWords[Math.floor(Math.random() * sampleWords.length)],
  )
}

function handleKeydown(e) {
  if (!timerInterval.value) {
    startTimer()
    startTime.value = Date.now()
  }
  console.log('Key pressed:', e.key)
  flashBackground()
  playTypingSound()
  if (e.key === 'Backspace') {
    e.preventDefault()
    showXPPopup("Backspace is disabled in this typing test!")
    return
  }

  const expectedChar = words.value.join(' ')[input.value.length] || ''
  if (e.key.length === 1) {
    keystrokes.value++
    input.value += e.key

    if (e.key !== expectedChar) {
      mistakes.value++
    }
  }
}

function showXPPopup(message) {
  // freeze the background like a normal alert
  if (document.body.querySelector('.xp-overlay')) {
    return // Prevent multiple overlays
  }
  // Create overlay
  const overlay = document.createElement('div')
  overlay.style.position = 'fixed'
  overlay.style.top = 0
  overlay.style.left = 0
  overlay.style.width = '100vw'
  overlay.style.height = '100vh'
  overlay.style.background = 'rgba(0,0,0,0.2)'
  overlay.style.zIndex = 9999
  overlay.style.display = 'flex'
  overlay.style.alignItems = 'center'
  overlay.style.justifyContent = 'center'
  overlay.style.pointerEvents = 'auto'
  overlay.tabIndex = 0

  // Trap focus and block tab navigation
  const focusHandler = (e) => {
    e.preventDefault()
    if (btn) btn.focus()
  }
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') focusHandler(e)
    if (e.key === 'Enter' || e.key === 'Escape') {
      btn.click()
    }
  })

  // Prevent interaction with background
  document.body.style.overflow = 'hidden'

  // Create popup
  const popup = document.createElement('div')
  popup.style.background = '#ece9d8'
  popup.style.border = '2px solid #000080'
  popup.style.boxShadow = '4px 4px 0 #808080'
  popup.style.padding = '24px 32px 16px 32px'
  popup.style.borderRadius = '6px'
  popup.style.fontFamily = 'Tahoma, Verdana, Arial, sans-serif'
  popup.style.minWidth = '320px'
  popup.style.position = 'relative'

  // Title bar
  const titleBar = document.createElement('div')
  titleBar.style.background = 'linear-gradient(to right, #000080, #3a6ea5)'
  titleBar.style.color = 'white'
  titleBar.style.fontWeight = 'bold'
  titleBar.style.padding = '4px 8px'
  titleBar.style.margin = '-24px -32px 12px -32px'
  titleBar.style.fontSize = '15px'
  titleBar.innerText = 'Windows XP'

  // Message
  const msg = document.createElement('div')
  msg.style.marginBottom = '18px'
  msg.style.fontSize = '15px'
  msg.innerText = message

  // OK button
  const btn = document.createElement('button')
  btn.innerText = 'OK'
  btn.style.background = '#ece9d8'
  btn.style.border = '2px outset #fff'
  btn.style.padding = '2px 18px'
  btn.style.fontSize = '15px'
  btn.style.marginLeft = 'auto'
  btn.style.marginRight = 'auto'
  btn.style.display = 'block'
  btn.style.cursor = 'pointer'
  btn.style.boxShadow = '1px 1px 0 #808080'
  btn.onclick = () => {
    document.body.removeChild(overlay)
    document.body.style.overflow = ''
  }

  popup.appendChild(titleBar)
  popup.appendChild(msg)
  popup.appendChild(btn)
  overlay.appendChild(popup)
  document.body.appendChild(overlay)
  btn.focus()
}

watch(WPM, (newWPM) => {
  if (newWPM >= 100) {
    typingVolume.value = 1
  } else {
    typingVolume.value = Math.min(1, Math.max(0.1, newWPM / 100))
  }
  console.log('WPM changed:', newWPM, 'Volume set to:', typingVolume.value)
})

function flashBackground() {
  const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
  backgroundColor.value = color
}

function playTypingSound() {
  console.log('Playing typing sound at volume:', typingVolume.value)
  const randomIndex = Math.floor(Math.random() * props.typingAudio.length)
  const sound = new Audio(props.typingAudio[randomIndex])
  console.log('sound', sound)
  sound.volume = typingVolume.value
  sound.play()
}
onMounted(() => {
  generateWords()
  document.addEventListener('keydown', handleKeydown)
  checkAudioLoaded(props.typingAudio)
})
</script>

<template>
  <div
    v-if="audioLoaded"
    class="typing-test"
    :style="{ backgroundColor, fontSize: `${1.5 - mistakes * 0.08}rem` }"
  >
    <div class="typing-area">
      <div class="words">
        {{ words.join(' ') }}
      </div>
      <input v-model="input" disabled class="invisible-input" />
      <div>
        <p>Current WPM: {{ WPM }}</p>
        <VolumeDisplay :volume="successPercentage" />
      </div>
      <div>
        <p>Time Remaining: {{ remainingTime }} seconds</p>
      </div>
    </div>
    <div>
      <MistakeMeter :mistakes="mistakes" :keystrokes="keystrokes" />
      <p>Mistake Meter</p>
    </div>
  </div>
</template>

<style scoped>
.typing-test {
  padding: 2rem;
  font-family: monospace;
  font-size: 1.5rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
  box-sizing: border-box;
  margin: 20px 0 0 0;
  height: calc(100vh - 34px);
}
.invisible-input {
  position: absolute;
  opacity: 0;
}
.typing-area {
  width: 80%;
}
</style>
