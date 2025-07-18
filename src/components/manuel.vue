<template>
    <div>
        <flying-images
            v-if="!showModal"
            :volume
            @open-modal="showModal = true"
        />

        <Modal :is-open="showModal" @close="showModal = false">
            <template #header>
                <h3>Choose your volume</h3>
                <img class="modal-img" src="https://i.pinimg.com/originals/02/6c/5d/026c5dab9176700ffd06beb7db7da674.gif" alt="">
            </template>
            <template #body>
                <div class="maze-wrapper">
                    <maze-generator @new-volume="volume = $event" @hit-wall="onHitWall" @hit-end="volume++" />
                </div>
            </template>
            <template #footer>
                <button class="btn-submit" @click="showModal = false">Done</button>
            </template>
        </Modal>
        <spooky v-if="showModal" />
        <dvd v-if="showModal" @hover="onHitWall" />
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import Modal from './manuel/Modal.vue';
import MazeGenerator from './manuel/MazeGenerator.vue';
import Dvd from './manuel/Dvd.vue';
import Spooky from './manuel/Spooky.vue';
import FlyingImages from './manuel/FlyingImages.vue';

const showModal = ref(false);

const onHitWall = () => {
    showModal.value = false;
    volume.value = 0; // Reset volume when hitting a wall
    didHitWall.value = true; // Indicate that a wall was hit
    setTimeout(() => {
        didHitWall.value = false; // Reset the hit wall indicator after a short delay
    }, 3000); // Adjust the delay as needed
}

const volume = ref(0);
const didHitWall = ref(false);




const imageUrls = [
    "https://placehold.co/150x100/FF5733/FFFFFF?text=Image+1",
    "https://placehold.co/200x150/33FF57/FFFFFF?text=Image+2",
    "https://placehold.co/100x80/3357FF/FFFFFF?text=Image+3",
    "https://placehold.co/250x180/FF33A1/FFFFFF?text=Image+4",
    "https://placehold.co/120x90/A1FF33/FFFFFF?text=Image+5",
    "https://placehold.co/180x120/5733FF/FFFFFF?text=Image+6",
    "https://placehold.co/90x70/FF8C33/FFFFFF?text=Image+7",
    "https://placehold.co/220x160/33FF8C/FFFFFF?text=Image+8",
    "https://placehold.co/130x110/8C33FF/FFFFFF?text=Image+9",
    "https://placehold.co/160x100/FF3333/FFFFFF?text=Image+10"
];

const numImages = 20;
const images = [];
const imageContainerRef = ref(null);

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function initializeImages(container) {
    for (let i = 0; i < numImages; i++) {
        const img = document.createElement('img');
        img.src = imageUrls[Math.floor(getRandom(0, imageUrls.length))];
        img.classList.add('flying-image');

        const width = getRandom(50, 200);
        const height = getRandom(50, 150);
        img.style.width = `${width}px`;
        img.style.height = `${height}px`;

        const x = getRandom(0, window.innerWidth - width);
        const y = getRandom(0, window.innerHeight - height);
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;

        const vx = getRandom(-2, 2);
        const vy = getRandom(-2, 2);

        images.push({
            element: img,
            x,
            y,
            vx,
            vy,
            width,
            height
        });

        container.appendChild(img);
    }
}

let animationFrameId;

function animate() {
    images.forEach(image => {
        image.x += image.vx;
        image.y += image.vy;

        if (image.x + image.width > window.innerWidth || image.x < 0) {
            image.vx *= -1;
            if (image.x < 0) image.x = 0;
            if (image.x + image.width > window.innerWidth) image.x = window.innerWidth - image.width;
        }
        if (image.y + image.height > window.innerHeight || image.y < 0) {
            image.vy *= -1;
            if (image.y < 0) image.y = 0;
            if (image.y + image.height > window.innerHeight) image.y = window.innerHeight - image.height;
        }

        image.element.style.transform = `translate(${image.x}px, ${image.y}px)`;
    });

    animationFrameId = requestAnimationFrame(animate);
}

function handleResize() {
    images.forEach(image => {
        if (image.x + image.width > window.innerWidth) {
            image.x = window.innerWidth - image.width;
        }
        if (image.y + image.height > window.innerHeight) {
            image.y = window.innerHeight - image.height;
        }
        image.element.style.left = `${image.x}px`;
        image.element.style.top = `${image.y}px`;
    });
}

onMounted(() => {
    const container = imageContainerRef.value;
    if (container) {
        initializeImages(container);
        animate();
        window.addEventListener('resize', handleResize);
    }
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
    // Clean up images from DOM
    images.forEach(imgObj => {
        if (imgObj.element.parentNode) {
            imgObj.element.parentNode.removeChild(imgObj.element);
        }
    });
    images.length = 0;
});
</script>
<style scoped>
body {
    font-family: sans-serif;
    margin: 20px;
    background-color: #f0f2f5;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

h1 {
    color: #333;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}

.maze-wrapper {
    background: url('https://i.pinimg.com/originals/02/6c/5d/026c5dab9176700ffd06beb7db7da674.gif');
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.image-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #2d3748;
    /* Slightly lighter dark background */
    border-radius: 0.5rem;
    /* Rounded corners for the container */
}

.flying-image {
    position: absolute;
    border-radius: 0.5rem;
    /* Rounded corners for images */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* Subtle shadow */
    object-fit: cover;
    /* Ensure images cover their area */
    transition: transform 0.05s linear;
    /* Smooth movement */
    will-change: transform;
    /* Optimize for animation */
}

.modal-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-left: 10px;
    object-fit: cover;
}
</style>