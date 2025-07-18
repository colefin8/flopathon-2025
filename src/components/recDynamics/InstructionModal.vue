<template>
    <div class="instruction-modal">
        <div class="instruction-content">
            <h3 class="instruction-title">VOLUME SLIDER INSTRUCTIONS</h3>
            <p class="instruction-text">
                To view the volume slider instructions, arrange the notes in the correct order
            </p>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.instruction-modal {
    position: fixed;
    top: 50px;
    left: 1rem;
    z-index: 45;
    background: linear-gradient(145deg, #f8f4e6 0%, #ede4c8 100%);
    border: 2px solid #8b0000;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.5);
    max-width: 300px;
    font-family: 'Courier New', monospace;
}

.instruction-title {
    color: #8b0000;
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.instruction-text {
    color: #2c1810;
    font-size: 0.8rem;
    margin: 0;
    line-height: 1.4;
}
</style>