<template>
    <div class="slider-captcha">
        <h3 class="slider-captcha-header"><i class="ph ph-check-circle" />Verify you are human</h3>
        <div
            class="slider-track"
            ref="sliderTrackRef"
            @mousedown="startDrag"
            @touchstart="startDrag"
        >
            <div
                class="slider-handle"
                :style="{ left: handlePosition + 'px' }"
                @mousedown.stop="startDrag"
                @touchstart.stop="startDrag"
            ></div>
            <div
                v-if="showSuccessIndicator"
                class="success-indicator"
                :style="{ left: correctPositionPercentage }"
            ></div>
        </div>
        <p v-if="verificationMessage" :class="messageClass">
            {{ verificationMessage }}
        </p>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Reactive state
const isDragging = ref(false);
const handlePosition = ref(0); // Current position of the slider handle in pixels
const trackWidth = ref(0); // Width of the slider track in pixels
const correctPositionPercentage = ref('75%'); // The "correct" position as a percentage
const tolerance = 10; // Pixels of tolerance for the correct position
const verificationMessage = ref('');
const showSuccessIndicator = ref(true); // Optionally show where the correct spot is

const isCorrect = defineModel('is-correct',{
    type: Boolean
})

// Template refs
const sliderTrackRef = ref(null);

// Computed properties
const correctPositionPx = computed(() => {
    // Calculate the correct position in pixels based on the track width
    return (parseFloat(correctPositionPercentage.value) / 100) * trackWidth.value;
});

const messageClass = computed(() => {
    return {
        'text-success': isCorrect.value,
        'text-error': !isCorrect.value && verificationMessage.value,
    };
});

// Methods
const updateTrackWidth = () => {
    if (sliderTrackRef.value) {
        trackWidth.value = sliderTrackRef.value.offsetWidth;
        // Ensure handle position is within bounds after resize
        handlePosition.value = Math.min(
            handlePosition.value,
            trackWidth.value - 20
        ); // -20 for handle width
    }
};

const startDrag = (event) => {
    if (isCorrect.value) return; // Don't allow dragging if already verified

    isDragging.value = true;
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('touchend', endDrag);

    // Prevent default to avoid text selection issues on drag
    event.preventDefault();
};

const onDrag = (event) => {
    if (!isDragging.value) return;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const trackRect = sliderTrackRef.value.getBoundingClientRect();
    let newPosition = clientX - trackRect.left - 10; // -10 for half handle width

    // Clamp the position within the track boundaries
    newPosition = Math.max(0, newPosition);
    newPosition = Math.min(newPosition, trackWidth.value - 20); // -20 for handle width

    handlePosition.value = newPosition;
    verifySliderPosition();
};

const endDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', endDrag);
    verifySliderPosition(); // Final check on drag end
};

const verifySliderPosition = () => {
    // Check if the handle is within the tolerance range of the correct position
    const minCorrect = correctPositionPx.value - tolerance;
    const maxCorrect = correctPositionPx.value + tolerance;

    if (handlePosition.value >= minCorrect && handlePosition.value <= maxCorrect) {
        isCorrect.value = true;
        verificationMessage.value = 'Verification successful! 🎉';
        // Optionally, snap the handle to the correct position
        handlePosition.value = correctPositionPx.value;
    } else {
        isCorrect.value = false;
        verificationMessage.value = 'Keep trying!';
    }
};

const resetSlider = () => {
    handlePosition.value = 0;
    isCorrect.value = false;
    verificationMessage.value = '';
};

// Lifecycle hooks
onMounted(() => {
    updateTrackWidth();
    window.addEventListener('resize', updateTrackWidth);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateTrackWidth);
});
</script>

<style scoped>
/* Styles remain the same as the Options API version */
.slider-captcha {
    width: 100%;
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-align: center;
    background-color: #f9f9f9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.slider-captcha-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.slider-track {
    width: 90%;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    margin: 20px auto;
    position: relative;
    cursor: grab;
    overflow: hidden; /* Ensure handle doesn't go outside */
}

.slider-handle {
    width: 40px;
    height: 40px;
    background-color: #007bff;
    border-radius: 50%;
    position: absolute;
    top: -10px; /* Center handle vertically on track */
    left: 0;
    cursor: grab;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: background-color 0.1s ease;
}

.slider-handle:active {
    cursor: grabbing;
    background-color: #0056b3;
}

.success-indicator {
    position: absolute;
    top: 0;
    width: 40px;
    height: 100%;
    background-color: rgba(40, 167, 69, 0.5); /* Greenish translucent marker */
    border-radius: 2px;
    z-index: 0; /* Behind the handle */
}

p {
    margin-top: 15px;
    font-weight: bold;
}

.text-success {
    color: #28a745; /* Green */
}

.text-error {
    color: #dc3545; /* Red */
}

button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover:not(:disabled) {
    background-color: #5a6268;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>