<template>
    <div class="maze__page">
        <h1>A-MAZE-ingly Frustrating</h1>
        <p>Drag the blue square to the volume you want! It might prove more difficult than you think...</p>
        <div ref="volumeContainer" class="volume__container">
            <div
                id="volume-handle"
                ref="volumeHandle"
                class="volume__handle"
                :style="positionStyle"
                @mousedown="handleMouseDown"
            />

            <div
                v-for="({ top, left, height, width, volume }, index) in volumeSections"
                :key="index"
                class="volume-section"
                :style="{ top: `${top}px`, left: `${left}px`, height: `${height}px`, width: `${width}px` }"
            >
                {{ volume }}
            </div>

            <div
                v-for="({ top, left, height, width }, index) in mazeWalls"
                :key="index"
                class="maze-wall"
                :style="{ top: `${top}px`, left: `${left}px`, height: `${height}px`, width: `${width}px` }"
            />
        </div>

        <div class="info-box">
            <div>{{ message }}</div>
            <div class="volumeMessage">{{ currentVolume }}</div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

const INITIAL_TOP = 10;
const INITIAL_LEFT = 10;
const HANDLE_SIZE = 30;

const volumeHandle = ref(null);
const volumeContainer = ref(null);
const volumeHandleTop = ref(INITIAL_TOP);
const volumeHandleLeft = ref(INITIAL_LEFT);

const mazeWalls = ref([]);
const volumeSections = ref([]);

const generateMazeWalls = (containerWidth, containerHeight, numWalls = 180) => {
    const walls = [];
    const minWallLength = 50;
    const maxWallLength = 150;
    const wallThickness = 15; // Thinner walls for more paths
    const maxAttemptsPerWall = 500; // Limit attempts to place a single wall

    for (let i = 0; i < numWalls; i++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < maxAttemptsPerWall) {
            const isHorizontal = Math.random() > 0.5;
            let x, y, width, height;

            if (isHorizontal) {
                width = Math.floor(Math.random() * (maxWallLength - minWallLength + 1)) + minWallLength;
                height = wallThickness;
                x = Math.floor(Math.random() * (containerWidth - width));
                y = Math.floor(Math.random() * (containerHeight - height));
            } else {
                width = wallThickness;
                height = Math.floor(Math.random() * (maxWallLength - minWallLength + 1)) + minWallLength;
                x = Math.floor(Math.random() * (containerWidth - width));
                y = Math.floor(Math.random() * (containerHeight - height));
            }

            const newWallRect = { x, y, width, height };

            // Define a safe zone around the initial handle position to avoid blocking it
            const safeZone = {
                x: INITIAL_LEFT - HANDLE_SIZE, // Extend slightly left
                y: INITIAL_TOP - HANDLE_SIZE,  // Extend slightly up
                width: HANDLE_SIZE * 3, // Make it a bit larger than handle
                height: HANDLE_SIZE * 3,
            };

            let overlaps = false;
            // Ensure new wall doesn't overlap with the safe zone
            if (isColliding(newWallRect, safeZone)) {
                overlaps = true;
            }

            // Ensure it doesn't overlap with existing walls
            if (!overlaps) {
                for (const existingWall of walls) {
                    // IMPORTANT FIX: Convert existingWall to x/y for collision check
                    const existingWallRect = { x: existingWall.left, y: existingWall.top, width: existingWall.width, height: existingWall.height };
                    if (isColliding(newWallRect, existingWallRect)) {
                        overlaps = true;
                        break;
                    }
                }
            }

            if (!overlaps) {
                walls.push({ top: y, left: x, height, width }); // Store as top/left for Vue style binding
                placed = true;
            }
            attempts++;
        }
        if (!placed) {
            console.warn(`Could not place wall ${i + 1} after ${maxAttemptsPerWall} attempts. Skipping.`);
        }
    }
    return walls;
}

const generateVolumeSections = (containerWidth, containerHeight, numAreas = 100) => {
    const areas = [];
    const areaSize = 25; // Slightly larger areas for 100 targets
    const maxAttemptsPerArea = 500; // Prevent infinite loop for impossible layouts

    for (let i = 1; i <= numAreas; i++) { // Volumes from 1 to 100
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < maxAttemptsPerArea) {
            const x = Math.floor(Math.random() * (containerWidth - areaSize));
            const y = Math.floor(Math.random() * (containerHeight - areaSize));
            const newArea = { x, y, width: areaSize, height: areaSize, volume: i };

            let overlaps = false;
            // Check overlap with existing walls
            for (const wall of mazeWalls.value) {
                // Important: wall objects are stored as {top, left, height, width}, convert to x/y for collision
                const wallRect = { x: wall.left, y: wall.top, width: wall.width, height: wall.height };
                if (isColliding(newArea, wallRect)) {
                    overlaps = true;
                    break;
                }
            }
            // Check overlap with already placed volume areas
            if (!overlaps) {
                for (const existingArea of areas) {
                    if (isColliding(newArea, existingArea)) {
                        overlaps = true;
                        break;
                    }
                }
            }

            // Ensure new area doesn't overlap with the handle's initial position
            const startArea = {
                x: INITIAL_LEFT,
                y: INITIAL_TOP,
                width: HANDLE_SIZE,
                height: HANDLE_SIZE
            };
            if (isColliding(newArea, startArea)) {
                overlaps = true;
            }

            if (!overlaps) {
                areas.push({ top: y, left: x, height: areaSize, width: areaSize, volume: i }); // Store as top/left for Vue style binding
                placed = true;
            }
            attempts++;
        }
        if (!placed) {
            console.warn(`Could not place volume area ${i} after ${maxAttemptsPerArea} attempts. Consider adjusting maze/area parameters.`);
        }
    }
    return areas;
}

onMounted(() => {
    const containerRect = volumeContainer.value.getBoundingClientRect();
    const { width, height } = containerRect;

    mazeWalls.value = generateMazeWalls(width, height);
    volumeSections.value = generateVolumeSections(width, height);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
});

const message = ref('Drag the handle to the volume you want!');

const positionStyle = computed(() => ({
    left: `${volumeHandleLeft.value}px`,
    top: `${volumeHandleTop.value}px`,
}));

const setVolume = ref(null);
const currentVolume = computed(() => `Current Volume: ${setVolume.value ?? 'N/A'}`);

const isColliding = (a, b) => {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

const isDragging = ref(false);
const resetHandlePosition = () => {
    volumeHandleLeft.value = INITIAL_LEFT;
    volumeHandleTop.value = INITIAL_TOP;
    isDragging.value = false;
    setVolume.value = null;
}

const offsetX = ref(0);
const offsetY = ref(0);
// const handleBoundingRect = ref(null);
const handleMouseDown = (e) => {
    isDragging.value = true;
    const handleRect = volumeHandle.value.getBoundingClientRect();
    offsetX.value = e.clientX - handleRect.left;
    offsetY.value = e.clientY - handleRect.top;
    message.value = 'Dragging...';
}

const handleMouseMove = (e) => {
    if (!isDragging.value) return;

    const containerRect = volumeContainer.value.getBoundingClientRect();
    const newLeft = e.clientX - containerRect.left - offsetX.value;
    const newTop = e.clientY - containerRect.top - offsetY.value;

    // Ensure the handle stays within the container bounds
    const constrainedLeft = Math.max(0, Math.min(newLeft, containerRect.width - HANDLE_SIZE));
    const constrainedTop = Math.max(0, Math.min(newTop, containerRect.height - HANDLE_SIZE));

    // Check for collisions with maze walls
    const newHandleRect = {
        x: newLeft,
        y: newTop,
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
    };

    let hasHitWall = false;
    for (const wall of mazeWalls.value) {
        const wallRect = {
            x: wall.left,
            y: wall.top,
            width: wall.width,
            height: wall.height,
        };
        if (isColliding(newHandleRect, wallRect)) {
            hasHitWall = true;
            break;
        }
    }

    if (hasHitWall) {
        message.value = 'You hit a wall! Resetting handle position.';
        resetHandlePosition();
    } else {
        volumeHandleLeft.value = constrainedLeft;
        volumeHandleTop.value = constrainedTop;
    }
}

const handleMouseUp = (e) => {
    if (!isDragging.value) return;
    isDragging.value = false;

    const finalHandleRect = {
        x: volumeHandleLeft.value,
        y: volumeHandleTop.value,
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
    };

    for (const section of volumeSections.value) {
        const sectionRect = {
            x: section.left,
            y: section.top,
            width: section.width,
            height: section.height,
        };
        if (isColliding(finalHandleRect, sectionRect)) {
            setVolume.value = section.volume;
            message.value = `Great job! But is that the volume you wanted?`;
            return;
        }
    }

    message.value = 'Blargh';
}
</script>

<style scoped>
h1 {
    margin: 16px 0;
}

.maze__page {
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    margin-top: 32px;
    height: calc(100vh - 40px);
}

.volume__container {
    position: relative;
    flex: 1;
    width: 100%;
    background-color: #f0f0f0;
    box-sizing: border-box;
    border-radius: 8px;
    border: 2px solid #ccc;
}

.volume__handle {
    position: absolute;
    width: 30px; /* Size of the draggable handle */
    height: 30px;
    background-color: #3b82f6; /* Blue color for the handle */
    border-radius: 8px; /* Make it circular */
    cursor: grab; /* Indicate it's draggable */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    user-select: none; /* Prevent text selection during drag */
    z-index: 1;

    &:active {
        cursor: grabbing; /* Change cursor when dragging */
    }
}

.info-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16px 0;
}

.maze-wall {
    position: absolute;
    background-color: rgba(255, 0, 0, 0.3);
    z-index: 2;
    visibility: hidden; /* change for debugging */
}

.volume-section {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid black;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    color: white;
    z-index: 0;
}
</style>