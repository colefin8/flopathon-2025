<template>
    <div id="overlay" ref="overlayRef"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const overlayRef = ref(null);

const handleMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    if (overlayRef.value) {
        overlayRef.value.style.setProperty('--mouse-x', `${mouseX}px`);
        overlayRef.value.style.setProperty('--mouse-y', `${mouseY}px`);
    }
};

const initiateOverlay = () => {
    console.log('Overlay setup');
    document.addEventListener('mousemove', handleMouseMove);
};

onMounted(() => {
    console.log('Overlay mounted');
    document.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove);
});
initiateOverlay();
</script>

<style>
#overlay {
    position: fixed;
    /* Fixed position relative to the viewport */
    top: 0;
    left: 0;
    width: 100vw;
    /* Full viewport width */
    height: 100vh;
    /* Full viewport height */
    background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), transparent 0px, transparent 40px, rgba(0, 0, 0, 0.99) 80px);

    /* Initial gradient: transparent in the center, black outside */
    pointer-events: none;
    /* Allows clicks/interactions to pass through the overlay */
    transition: background 0.05s linear;
    /* Smooth transition for the flashlight movement */
    border-radius: 0;
    /* No rounded corners for the overlay itself */
    z-index: 20;
    /* Ensure the overlay is on top of the content */
}
</style>