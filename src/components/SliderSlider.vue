<script setup>
import { computed, ref, onMounted } from 'vue';

// Reactive state for the ingredients in the palette
const ingredients = ref([
    { id: 'bun-bottom', src: '/assets/bun-bottom.png', height: 80, width: 150, alt: 'Bun Bottom', weight: 40 }, // grams
    { id: 'burger-patty', src: '/assets/burger-patty.png', height: 100, width: 150, alt: 'Burger Patty', weight: 113 }, // grams (quarter-pound)
    { id: 'cheese', src: '/assets/cheese.png', height: 100, width: 150, alt: 'Cheese', weight: 28 }, // grams (slice)
    { id: 'lettuce', src: '/assets/lettuce.png', height: 120, width: 120, alt: 'Lettuce', weight: 10 }, // grams (leafy portion)
    { id: 'ketchup', src: '/assets/ketchup.png', height: 100, width: 100, alt: 'Ketchup', weight: 15 }, // grams (typical serving)
    { id: 'mayonnaise', src: '/assets/mayonnaise.png', height: 100, width: 100, alt: 'Mayonnaise', weight: 15 }, // grams (typical serving)
    { id: 'mustard', src: '/assets/mustard.png', height: 100, width: 100, alt: 'Mustard', weight: 10 }, // grams (typical serving)
    { id: 'pickle', src: '/assets/pickle.png', height: 40, width: 80, alt: 'Pickle', weight: 5 }, // grams (slice)
    { id: 'tomato-slice', src: '/assets/tomato-slice.png', height: 120, width: 120, alt: 'Tomato Slice', weight: 20 }, // grams (slice)
    { id: 'top-bun', src: '/assets/top-bun.png', height: 100, width: 150, alt: 'Top Bun', weight: 40 }, // grams
]);

// Reactive state for ingredients dropped into the assembly area
const droppedIngredients = ref([]);
const burgerAssemblyArea = ref(null); // Ref for the assembly area DOM element
let draggedIngredientData = null; // Stores data of the ingredient being dragged from the palette
let zIndexCounter = 1; // Manages stacking order for dropped ingredients

// State for dragging an already dropped item
let isDraggingDroppedItem = false;
let currentDraggedDroppedItem = null;
let offsetX = 0;
let offsetY = 0;

/**
 * Handles the start of a drag operation from the ingredient palette.
 * Stores the data of the ingredient being dragged.
 * @param {DragEvent} e - The drag event.
 * @param {Object} ingredient - The ingredient object being dragged.
 */
const handleDragStart = (e, ingredient) => {
    draggedIngredientData = ingredient;
    e.dataTransfer.setData('text/plain', ingredient.id); // Set data for compatibility
    // Set a custom drag image (optional, but good for visual feedback)
    const img = e.target.cloneNode(true);
    img.style.opacity = '0.5';
    img.style.position = 'absolute';
    img.style.left = '-9999px'; // Move off-screen
    document.body.appendChild(img);
    e.dataTransfer.setDragImage(img, e.offsetX, e.offsetY);
    // Clean up the temporary image after a short delay
    setTimeout(() => document.body.removeChild(img), 0);
};

/**
 * Prevents default behavior for dragover to allow dropping.
 * Adds a visual feedback class.
 * @param {DragEvent} e - The drag event.
 */
const handleDragOver = (e) => {
    e.preventDefault();
    if (burgerAssemblyArea.value) {
        burgerAssemblyArea.value.classList.add('drag-over');
    }
};

/**
 * Removes the visual feedback class when a dragged item leaves the area.
 */
const handleDragLeave = () => {
    if (burgerAssemblyArea.value) {
        burgerAssemblyArea.value.classList.remove('drag-over');
    }
};

/**
 * Handles the drop event, cloning the ingredient and adding it to the assembly area.
 * @param {DragEvent} e - The drop event.
 */
const handleDrop = (e) => {
    e.preventDefault();
    if (burgerAssemblyArea.value) {
        burgerAssemblyArea.value.classList.remove('drag-over');
    }

    if (draggedIngredientData) {
        const dropAreaRect = burgerAssemblyArea.value.getBoundingClientRect();
        const newDroppedIngredient = {
            ...draggedIngredientData,
            id: `${draggedIngredientData.id}-${Date.now()}`, // Unique ID for each dropped instance
            x: e.clientX - dropAreaRect.left - (draggedIngredientData.width / 2),
            y: e.clientY - dropAreaRect.top - (draggedIngredientData.width / (300/100)), // Adjust for height if width is the only given dimension
            zIndex: zIndexCounter++,
        };
        if (totalVolume.value < 100) {
            droppedIngredients.value.push(newDroppedIngredient);
        }
        draggedIngredientData = null; // Reset dragged data
    }
};

/**
 * Initiates dragging for an already dropped ingredient.
 * @param {MouseEvent | TouchEvent} e - The mouse or touch event.
 * @param {Object} item - The dropped ingredient item.
 */
const startDragDroppedItem = (e, item) => {
    isDraggingDroppedItem = true;
    currentDraggedDroppedItem = item;
    currentDraggedDroppedItem.zIndex = zIndexCounter++; // Bring to front

    const targetElement = e.target;
    const itemRect = targetElement.getBoundingClientRect();

    if (e.type === 'mousedown') {
        offsetX = e.clientX - itemRect.left;
        offsetY = e.clientY - itemRect.top;
    } else if (e.type === 'touchstart') {
        const touch = e.touches[0];
        offsetX = touch.clientX - itemRect.left;
        offsetY = touch.clientY - itemRect.top;
    }
};

/**
 * Handles the movement of a dragged dropped ingredient.
 * @param {MouseEvent | TouchEvent} e - The mouse or touch event.
 */
const dragDroppedItem = (e) => {
    if (!isDraggingDroppedItem || !currentDraggedDroppedItem) return;

    e.preventDefault(); // Prevent scrolling on touch devices

    const dropAreaRect = burgerAssemblyArea.value.getBoundingClientRect();
    let clientX, clientY;

    if (e.type === 'mousemove') {
        clientX = e.clientX;
        clientY = e.clientY;
    } else if (e.type === 'touchmove') {
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    }

    let newX = clientX - dropAreaRect.left - offsetX;
    let newY = clientY - dropAreaRect.top - offsetY;

    // Constrain movement within the burger assembly area
    const itemWidth = currentDraggedDroppedItem.width;
    const itemHeight = currentDraggedDroppedItem.width / (300/100); // Approximate height based on original ratio

    newX = Math.max(0, Math.min(newX, dropAreaRect.width - itemWidth));
    newY = Math.max(0, Math.min(newY, dropAreaRect.height - itemHeight));

    // Find the index of the currentDraggedDroppedItem in the array
    const index = droppedIngredients.value.findIndex(item => item.id === currentDraggedDroppedItem.id);
    if (index !== -1) {
        // Update the x and y properties reactively
        droppedIngredients.value[index].x = newX;
        droppedIngredients.value[index].y = newY;
    }
};

/**
 * Ends the dragging of a dropped ingredient.
 */
const endDragDroppedItem = () => {
    isDraggingDroppedItem = false;
    currentDraggedDroppedItem = null;
};

// Add global event listeners for mouse/touch up to ensure drag ends even if outside assembly area
onMounted(() => {
    document.addEventListener('mouseup', endDragDroppedItem);
    document.addEventListener('touchend', endDragDroppedItem);
});

const totalVolume = computed(() => {
    const weightGrams = droppedIngredients.value.reduce((prev, curr) => prev + curr.weight, 0);
    const weightOz = weightGrams / 26;
    if (weightOz > 100) {
        return 100;
    }
    return (weightOz).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    });
})

/**
 * Clears all dropped ingredients from the assembly area.
 */
const discardBurger = () => {
    droppedIngredients.value = [];
    zIndexCounter = 1; // Reset z-index counter
};
</script>

<template>
    <div class="main-container">
        <h1 class="header-title">Volume of a Slider</h1>

        <div class="ingredient-palette">
            <img
                v-for="ingredient in ingredients"
                :key="ingredient.id"
                :src="ingredient.src"
                :width="ingredient.width"
                :alt="ingredient.alt"
                draggable="true"
                @dragstart="handleDragStart($event, ingredient)"
                class="palette-item"
                :style="`max-height: ${ingredient.height}px;`"
            />
        </div>

        <div
            ref="burgerAssemblyArea"
            class="burger-assembly-area"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
            @mousemove="dragDroppedItem"
            @touchmove="dragDroppedItem"
        >
            <p v-if="droppedIngredients.length === 0" class="placeholder-text">
                Drag ingredients here to build your burger!
            </p>

            <img
                v-for="item in droppedIngredients"
                :key="item.id"
                :src="item.src"
                :width="item.width"
                :alt="item.alt"
                :style="{ left: `${item.x}px`, top: `${item.y}px`, zIndex: item.zIndex }"
                class="dropped-item"
                @mousedown="startDragDroppedItem($event, item)"
                @touchstart="startDragDroppedItem($event, item)"
            />

            
        </div>
        
        

        <div class="bottom-menu">
            <button @click="discardBurger" class="discard-button">
                Discard Burger
            </button>
            <p class="volume-label">Total Volume: {{ totalVolume }}oz</p>
        </div>
    </div>
</template>

<style scoped>
/* Scoped styles for the Vue component */
.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    max-width: 64rem;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 60px;
    margin-bottom: 32px;
}

.header-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 16px;
}

.volume-label {
    font-size: 1.25rem;
    font-weight: 500;
    color: #1f2937;
}

.ingredient-palette {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    padding: 16px;
    background-color: #f9fafb;
    border-radius: 12px;
    width: 100%;
}

.palette-item {
    cursor: grab;
    transition-property: transform, box-shadow;
    transition-duration: 100ms;
    transition-timing-function: ease-in-out;
    border-radius: 8px;
    box-shadow: none;
}
.palette-item:hover {
    transform: scale(1.05);
}
.palette-item:active {
    cursor: grabbing;
    transform: scale(1.05);
}

.burger-assembly-area {
    position: relative;
    min-height: 384px;
    width: 100%;
    max-width: 48rem;
    border: 4px dashed #cbd5e1;
    border-radius: 16px;
    background-color: #e2e8f0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition-property: background-color, border-color;
    transition-duration: 300ms;
}

.burger-assembly-area.drag-over {
    background-color: #dbeafe;
    border-color: #60a5fa;
}

.dropped-item {
    position: absolute;
    border-radius: 8px;
    transition-property: transform;
    transition-duration: 100ms;
    transition-timing-function: ease-out;
    pointer-events: auto;
    cursor: grab;
}
.dropped-item:active {
    cursor: grabbing;
}

.placeholder-text {
    color: #64748b;
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
}

.discard-button {
    background-color: #ef4444;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: background-color 0.2s ease, transform 0.1s ease;
}

.discard-button:hover {
    background-color: #dc2626;
    transform: translateY(-2px);
}

.discard-button:active {
    background-color: #b91c1c;
    transform: translateY(0);
    box-shadow: none;
}

.bottom-menu {
    margin-top: 1rem;
    width: 48rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
