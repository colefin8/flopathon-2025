<template>
	<div class="search-history-overlay">
		<div class="search-history-modal" :class="{ 'modal-flashing': isFlashing }">
			<div class="modal-header">
				<h2 class="modal-title">⚠️ PUBLISHING SEARCH HISTORY ⚠️</h2>
				<div class="countdown-display">
					<span class="countdown-number">{{ countdown }}</span>
					<span class="countdown-label">seconds remaining</span>
				</div>
			</div>
			<div class="modal-content">
				<p class="warning-text">
					Your embarrassing search history will be broadcasted to everyone!
				</p>
				<div class="search-preview">
					<div class="search-item">🔍 "Underground Super Smash Brothers Tournament"</div>
					<div class="search-item">🔍 "How to get AI to do my job"</div>
					<div class="search-item">🔍 "How to get a forklift certification fast?"</div>
					<div class="search-item">🔍 "How many energy drinks is too many webMD"</div>
				</div>
			</div>
			<div class="modal-actions">
				<button
					@click="handleCancel"
					class="cancel-button"
					>
				🚫 CANCEL BROADCAST
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from 'vue'

const emit = defineEmits(['close'])
const countdown = ref(5)
const isFlashing = ref(true)
let countdownTimer = null

const handleCancel = () => {
    emit('close');
}

const startCountdown = () => {
    countdownTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
        clearInterval(countdownTimer);
        // In a real app, this would trigger the "broadcast"
        // For now, we'll just close the modal
        emit('close');
        }
    }, 1000)
}

onMounted(() => {
    startCountdown();
})

onUnmounted(() => {
    if (countdownTimer) {
        clearInterval(countdownTimer)
    }
})
</script>

<style scoped>
.search-history-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
}

.search-history-modal {
    background: #1a1a1a;
    border: 3px solid #dc2626;
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 0 50px rgba(220, 38, 38, 0.5);
    animation: modal-shake 0.1s ease-in-out infinite;
}

.modal-flashing {
    animation: modal-flash 0.5s ease-in-out infinite, modal-shake 0.1s ease-in-out infinite;
}

.modal-header {
    text-align: center;
    margin-bottom: 1.5rem;
    }

.modal-title {
    color: #dc2626;
    font-family: 'Impact', sans-serif;
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    letter-spacing: 0.1em;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.countdown-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.countdown-number {
    font-family: 'Courier New', monospace;
    font-size: 3rem;
    color: #dc2626;
    font-weight: bold;
    text-shadow: 0 0 20px #dc2626;
    animation: countdown-pulse 1s ease-in-out infinite;
}

.countdown-label {
    color: #fca5a5;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.modal-content {
    margin-bottom: 2rem;
}

.warning-text {
    color: #fca5a5;
    text-align: center;
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0 0 1.5rem 0;
    line-height: 1.4;
}

.search-preview {
    background: #450a0a;
    border: 2px dashed #dc2626;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
}

.search-item {
    color: #fecaca;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    padding: 0.5rem 0;
    border-bottom: 1px dotted #dc2626;
}

.search-item:last-child {
    border-bottom: none;
}

.modal-actions {
    text-align: center;
}

.cancel-button {
    background: #059669;
    color: white;
    border: 2px solid #047857;
    padding: 1rem 2rem;
    font-family: 'Impact', sans-serif;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    letter-spacing: 0.1em;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.cancel-button:hover {
    background: #047857;
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.cancel-button:active {
    transform: scale(0.98);
}

@keyframes modal-flash {
    0%, 100% {
        background: #1a1a1a;
        border-color: #dc2626;
    }
    50% {
        background: #450a0a;
        border-color: #f87171;
    }
    }

    @keyframes modal-shake {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-2px, -1px); }
    50% { transform: translate(2px, 1px); }
    75% { transform: translate(-1px, 2px); }
    }

    @keyframes countdown-pulse {
    0%, 100% {
        transform: scale(1);
        text-shadow: 0 0 20px #dc2626;
    }
    50% {
        transform: scale(1.1);
        text-shadow: 0 0 30px #dc2626, 0 0 40px #dc2626;
    }
    }

    @media (max-width: 768px) {
    .search-history-modal {
        padding: 1.5rem;
    }

    .modal-title {
        font-size: 1.2rem;
    }

    .countdown-number {
        font-size: 2.5rem;
    }

    .warning-text {
        font-size: 1rem;
    }

    .cancel-button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
    }
}
</style>