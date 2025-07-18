<template>
	<div
		class="draggable-modal"
		:style="modalStyle"
		@mousedown="startDrag"
		@touchstart="startDrag"
		>
		<!-- Paper cutout background with torn edges -->
		<div class="modal-paper" :style="paperStyle">
			<!-- Paper texture overlay -->
			<div class="paper-texture"></div>
			<!-- Close button -->
			<button
				@click="handleClose"
				class="close-button"
				>
			✕
			</button>
			<!-- The word in ransom letter style -->
			<div class="modal-content">
				<span :style="wordStyle">{{ word }}</span>
			</div>
			<!-- Adhesive tape effect on corners -->
			<div class="tape tape-top-left"></div>
			<div class="tape tape-bottom-right"></div>
			<!-- Crumple and fold effects -->
			<div class="crumple crumple-1"></div>
			<div class="crumple crumple-2"></div>
			<!-- Drag handle indicator -->
			<div class="drag-handle">
				<div class="handle-dot" ></div>
				<div class="handle-dot" ></div>
				<div class="handle-dot" ></div>
				<div class="handle-dot" ></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    word: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    forcedPosition: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close'])

const position = ref({
  x: 200 + (props.index * 50) % 400,
  y: 150 + (props.index * 30) % 300
})
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

let shuffleTimer = null

// Random letter styles to simulate different magazine cutouts
const letterStyles = [
    {
        fontFamily: 'serif',
        fontSize: '2.5rem',
        background: 'linear-gradient(145deg, #f8f4e6 0%, #ede4c8 100%)',
        color: '#2c1810',
        border: '2px solid #d4c4a0'
    },
    {
        fontFamily: 'sans-serif',
        fontSize: '2.2rem',
        background: 'linear-gradient(145deg, #fff8dc 0%, #f5f0d8 100%)',
        color: '#1a1a1a',
        border: '2px solid #e6dcc0'
    },
    {
        fontFamily: 'monospace',
        fontSize: '2.8rem',
        background: 'linear-gradient(145deg, #fefefe 0%, #f0f0f0 100%)',
        color: '#333',
        border: '2px solid #ddd'
    },
    {
        fontFamily: 'cursive',
        fontSize: '2.4rem',
        background: 'linear-gradient(145deg, #f9f6f1 0%, #ede8e0 100%)',
        color: '#2a1f18',
        border: '2px solid #d8cfc0'
    },
    {
        fontFamily: 'fantasy',
        fontSize: '2.6rem',
        background: 'linear-gradient(145deg, #fffef7 0%, #f7f4ed 100%)',
        color: '#1f1f1f',
        border: '2px solid #e8e0d0'
    }
]

const style = computed(() => letterStyles[props.index % letterStyles.length])
const rotation = computed(() => (Math.random() - 0.5) * 20)
const skew = computed(() => (Math.random() - 0.5) * 10)

const modalStyle = computed(() => ({
    left: position.value.x + 'px',
    top: position.value.y + 'px',
    transform: `rotate(${rotation.value}deg) skew(${skew.value}deg, ${skew.value * 0.5}deg) ${isDragging.value ? 'scale(1.1)' : 'scale(1)'}`,
    position: 'fixed',
    zIndex: 50,
    cursor: isDragging.value ? 'grabbing' : 'grab',
    transition: isDragging.value ? 'none' : 'all 0.5s ease',
    filter: isDragging.value ? 'brightness(1.1)' : 'none',
    boxShadow: isDragging.value ? '0 25px 50px rgba(0, 0, 0, 0.5)' : '0 10px 20px rgba(0, 0, 0, 0.3)'
}))

const paperStyle = computed(() => ({
    background: style.value.background,
    border: style.value.border,
    borderRadius: '8px',
    position: 'relative',
    padding: '1.5rem',
    minWidth: '120px',
    minHeight: '80px',
    clipPath: `polygon(
        2% 8%, 8% 2%, 15% 6%, 22% 1%, 28% 7%, 35% 3%, 42% 9%,
        48% 4%, 55% 8%, 62% 2%, 68% 6%, 75% 1%, 82% 5%, 88% 9%,
        95% 3%, 98% 8%, 96% 15%, 99% 22%, 94% 28%, 98% 35%,
        92% 42%, 97% 48%, 93% 55%, 98% 62%, 94% 68%, 99% 75%,
        95% 82%, 91% 88%, 97% 95%, 92% 98%, 85% 96%, 78% 99%,
        72% 94%, 65% 98%, 58% 92%, 52% 97%, 45% 93%, 38% 98%,
        32% 94%, 25% 99%, 18% 95%, 12% 91%, 5% 97%, 2% 92%,
        6% 85%, 1% 78%, 6% 72%, 2% 65%, 8% 58%, 3% 52%,
        7% 45%, 2% 38%, 6% 32%, 1% 25%, 5% 18%, 9% 12%, 3% 5%
    )`
}))

const wordStyle = computed(() => ({
    fontFamily: style.value.fontFamily,
    fontSize: style.value.fontSize,
    color: style.value.color,
    fontWeight: Math.random() > 0.5 ? 'bold' : 'normal',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
    letterSpacing: `${(Math.random() - 0.5) * 2}px`,
    userSelect: 'none'
}))

// Update position when forcedPosition changes
const updatePosition = () => {
    if (props.forcedPosition) {
        position.value = { ...props.forcedPosition }
    }
}

// Shuffle positions every 10 seconds
const startShuffling = () => {
    shuffleTimer = setInterval(() => {
        if (!isDragging.value && !props.forcedPosition) {
        position.value = {
            x: Math.random() * (window.innerWidth - 200),
            y: Math.random() * (window.innerHeight - 150)
        }
        }
    }, 10000)
}

const startDrag = (event) => {
    event.preventDefault()
    isDragging.value = true

    const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX
    const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY

    dragStart.value = {
        x: clientX - position.value.x,
        y: clientY - position.value.y
    }

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('touchend', stopDrag);
}

const handleDrag = (event) => {
    if (!isDragging.value) return

    const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX
    const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY

    position.value = {
        x: Math.max(0, Math.min(window.innerWidth - 200, clientX - dragStart.value.x)),
        y: Math.max(0, Math.min(window.innerHeight - 150, clientY - dragStart.value.y))
    }
}

const stopDrag = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', stopDrag);
}

const handleClose = () => {
    emit('close')
}

onMounted(() => {
    updatePosition()
    startShuffling()
})

onUnmounted(() => {
    if (shuffleTimer) clearInterval(shuffleTimer)
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('touchmove', handleDrag)
    document.removeEventListener('touchend', stopDrag)
})

// Watch for forced position changes
if (props.forcedPosition) {
    updatePosition()
}
</script>

<style scoped>
.paper-texture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.2;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(139,69,19,0.1) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(105,105,105,0.1) 0%, transparent 30%),
        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2zm10 5c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2zm-15-10c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z'/%3E%3C/g%3E%3C/svg%3E");
    background-size: 40px 40px;
    mix-blend-mode: multiply;
}

.close-button {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    padding: 0;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 10;
}

.close-button:hover {
    background: #991b1b;
}

.modal-content {
    text-align: center;
    position: relative;
    z-index: 2;
}

.tape {
    position: absolute;
    background: rgba(255, 248, 150, 0.6);
    border: 1px solid rgba(200, 190, 100, 0.6);
    z-index: 3;
}

.tape-top-left {
    top: -4px;
    left: -4px;
    width: 16px;
    height: 16px;
    transform: rotate(45deg);
    clip-path: polygon(0 0, 100% 20%, 80% 100%, 20% 80%);
}

.tape-bottom-right {
    bottom: -4px;
    right: -4px;
    width: 16px;
    height: 16px;
    transform: rotate(45deg);
    clip-path: polygon(0 0, 100% 20%, 80% 100%, 20% 80%);
}

.crumple {
    position: absolute;
    background: linear-gradient(45deg, rgba(0,0,0,0.1), transparent);
    border-radius: 50%;
    z-index: 1;
}

.crumple-1 {
    top: 20%;
    right: 15%;
    width: 12px;
    height: 12px;
}

.crumple-2 {
    bottom: 25%;
    left: 10%;
    width: 10px;
    height: 10px;
    background: linear-gradient(-45deg, rgba(0,0,0,0.08), transparent);
}

.drag-handle {
    position: absolute;
    bottom: 4px;
    right: 8px;
    opacity: 0.3;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
}

.handle-dot {
    width: 2px;
    height: 2px;
    background: #6b7280;
    border-radius: 50%;
}
</style>