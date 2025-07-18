<template>
    <div class="flying-images-wrapper">
        <div class="image-container">
            <img v-for="image in images" :key="image.id" :src="image.src" :alt="`Flying Image ${image.id}`"
                class="flying-image" :style="{
                    width: `${image.width}px`,
                    height: `${image.height}px`,
                    transform: `translate(${image.x}px, ${image.y}px)`,
                }" />
        </div>

        <div class="glass-card">
            <h1>Flopathon 2025</h1>
            <p>Volume: {{ volume }}</p>
            <button class="volume-btn" @click="emit('open-modal')">Change Volume</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const emit = defineEmits(['open-modal']);

const {
    volumne,
} = defineProps({
    volume: {
        type: Number,
        default: 0
    }
});

// Array of placeholder image URLs
const imageUrls = [
    "https://media.tenor.com/3zvcxCJ9QeEAAAAM/tetriandoch.gif",
    "https://i.pinimg.com/originals/02/6c/5d/026c5dab9176700ffd06beb7db7da674.gif",
    "https://media.tenor.com/KNYTiWGWHRYAAAAM/saturnoir.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyYjRlaTl0OHVlY21ocmV1YW0wdHIxamVwa2MyOGQxZTR2bmlyYmtyaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUPGcCh4nUHyCkyuti/source.gif",
    "https://i.pinimg.com/originals/9b/23/37/9b2337068298eda1f59e6ea7bc1f8c3b.gif",
    "https://i0.wp.com/media2.giphy.com/media/MDXomrcGshGso/giphy.gif",
    "https://media.tenor.com/N4wM9uQOG7UAAAAM/shrek-shrek-dance.gif",
    "https://images.steamusercontent.com/ugc/285225308508782583/ACF1F2CCC07EF721673F913C9848ECD84D147E4F/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2b2dc0b8-6bc5-42ee-8c9f-5caae1cbc51c/delpchh-7c439b95-5974-486b-ab80-87819204bea0.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzJiMmRjMGI4LTZiYzUtNDJlZS04YzlmLTVjYWFlMWNiYzUxY1wvZGVscGNoaC03YzQzOWI5NS01OTc0LTQ4NmItYWI4MC04NzgxOTIwNGJlYTAuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.PAnEE-wY2Wh6FJBRejCsG2UN8u4scHNwkCPdehj1Iwk",
    "https://i0.wp.com/media1.giphy.com/media/26BRBAA6bQv8nqA4o/giphy.gif",
    "https://33.media.tumblr.com/e23b887e118bc6b4c67da9d031a884ce/tumblr_n14hxuAxww1r98lcqo1_400.gif",
    "https://i.pinimg.com/originals/09/0b/d5/090bd5d905405468ddec899726c1c7c6.gif",
];

const numImages = 75; // Number of images to display

// Reactive state for images
const images = ref([]);
// Reactive state for window dimensions
const windowDimensions = ref({
    width: window.innerWidth,
    height: window.innerHeight,
});
// Ref to store the animation frame ID for cleanup
let animationFrameId = null;

// Helper function to generate a random number within a range
const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};

// Function to initialize images
const initializeImages = () => {
    const initialImages = [];
    for (let i = 0; i < numImages; i++) {
        const width = getRandom(50, 700);
        const height = getRandom(50, 700);
        const x = getRandom(0, window.innerWidth - width);
        const y = getRandom(0, window.innerHeight - height);
        const vx = getRandom(-2, 2); // X velocity
        const vy = getRandom(-2, 2); // Y velocity

        initialImages.push({
            id: i, // Unique ID for Vue key
            src: imageUrls[Math.floor(getRandom(0, imageUrls.length))],
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            width: width,
            height: height,
        });
    }
    images.value = initialImages; // Update the reactive state
};

// Animation loop function
const animate = () => {
    images.value = images.value.map(image => {
        let newX = image.x + image.vx;
        let newY = image.y + image.vy;
        let newVx = image.vx;
        let newVy = image.vy;

        // Bounce off horizontal walls
        if (newX + image.width > windowDimensions.value.width || newX < 0) {
            newVx *= -1; // Reverse X velocity
            // Adjust position to prevent sticking
            if (newX < 0) newX = 0;
            if (newX + image.width > windowDimensions.value.width) newX = windowDimensions.value.width - image.width;
        }
        // Bounce off vertical walls
        if (newY + image.height > windowDimensions.value.height || newY < 0) {
            newVy *= -1; // Reverse Y velocity
            // Adjust position to prevent sticking
            if (newY < 0) newY = 0;
            if (newY + image.height > windowDimensions.value.height) newY = windowDimensions.value.height - image.height;
        }

        return {
            ...image,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
        };
    });
    animationFrameId = requestAnimationFrame(animate); // Continue animation
};

// Function to handle window resize
const handleResize = () => {
    windowDimensions.value = {
        width: window.innerWidth,
        height: window.innerHeight,
    };
    // Adjust image positions if they go out of bounds on resize
    images.value = images.value.map(image => {
        let newX = image.x;
        let newY = image.y;
        if (image.x + image.width > window.innerWidth) {
            newX = window.innerWidth - image.width;
        }
        if (image.y + image.height > window.innerHeight) {
            newY = window.innerHeight - image.height;
        }
        return { ...image, x: newX, y: newY };
    });
};

// Lifecycle hook: runs after component is mounted
onMounted(() => {
    initializeImages(); // Initialize images
    animate(); // Start animation loop
    window.addEventListener('resize', handleResize); // Add resize listener
});

// Lifecycle hook: runs before component is unmounted
onUnmounted(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Cancel animation
    }
    window.removeEventListener('resize', handleResize); // Remove resize listener
});

// Watch for changes in images.length or windowDimensions to restart animation if needed
// (Though in this specific setup, `animate` is called continuously,
// this watch is more for re-triggering effects if these dependencies were to
// directly influence the animation's start/stop conditions, similar to React's useEffect dependencies.)
watch([() => images.value.length, windowDimensions], () => {
    // No explicit action needed here for this specific animation,
    // as `animate` is continuously running and `images.value` is updated within it.
    // This watch serves as a conceptual placeholder for dependency tracking.
});
</script>

<style scoped>
.image-container {
    position: absolute;
    top: 50px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #2d3748;
    overflow: hidden;
    cursor: crosshair;
    z-index: 0;
}

.flying-image {
    position: absolute;
    /* Rounded corners for images */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* Subtle shadow */
    object-fit: contain;
    /* Ensure images cover their area */
    transition: transform 0.05s linear;
    /* Smooth movement */
    will-change: transform;
    /* Optimize for animation */
}
.glass-card {
    position: absolute;
    top: 50%;
    right: 50px;
    z-index: 40;
    padding: 20px;

    width: 240px;
    height: 360px;
    background: rgba(255, 255, 255, 0.09);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.5),
        inset 0 -1px 0 rgba(255, 255, 255, 0.1),
        inset 0 0 0px 0px rgba(255, 255, 255, 0);
    overflow: hidden;
}

.glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.8),
            transparent);
}

.glass-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg,
            rgba(255, 255, 255, 0.8),
            transparent,
            rgba(255, 255, 255, 0.3));
}

.volume-btn {
    background: linear-gradient(0deg, #fffb00, #00ff15);
    color: black;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
</style>