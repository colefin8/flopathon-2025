<template>

    <div class="maze-container" @mouseleave="handleMouseLeave">
        <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="maze-row">
            <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`" class="maze-cell" :class="{
                'wall-top': cell.walls.top,
                'wall-right': cell.walls.right,
                'wall-bottom': cell.walls.bottom,
                'wall-left': cell.walls.left,
                'bg-default': !cell.visited && !cell.isEnd, /* Default background, no isStart check */
                'bg-visited': cell.visited && !cell.isEnd, /* Visited during generation, no isStart check */
                /* No bg-start class */
                'bg-end': cell.isEnd,      /* End point color (green) */
                'hovered': hoveredCell.row === rowIndex && hoveredCell.col === colIndex && !isMouseOnEdge && !isMouseOnWall && !isMouseOnEnd, /* Hovered but not edge, wall, or end */
                'edge-hovered': hoveredCell.row === rowIndex && hoveredCell.col === colIndex && isMouseOnEdge && !isMouseOnWall && !isMouseOnEnd, /* Hovered and on edge, but not wall or end */
                'wall-hit': hoveredCell.row === rowIndex && hoveredCell.col === colIndex && isMouseOnWall, /* Hovered and on wall */
                /* No start-hovered class */
                'end-hovered': hoveredCell.row === rowIndex && hoveredCell.col === colIndex && isMouseOnEnd /* Hovered and on end point */
            }" @mousemove="handleMouseOver(rowIndex, colIndex, $event)"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

const emit = defineEmits(['hit-wall', 'hit-end', 'new-volume']);

// #region Maze Generation Logic

const mazeRows = ref(20); // Number of rows in the maze
const mazeCols = ref(20); // Number of columns in the maze
// Reactive grid to store maze cells
const grid = reactive([]);

// Reactive state for start and end points
const startPoint = reactive({ row: 0, col: 0 });
const endPoint = reactive({ row: 0, col: 0 });

// Reactive state to track the currently hovered cell
const hoveredCell = reactive({ row: -1, col: -1 });
// Reactive state to indicate if a wall is being hovered over
const isMouseOnWall = ref(false);
// Reactive state to indicate if the mouse is on the start point
// This will still be used internally for opening logic, but not for message/color
const isMouseOnStart = ref(false);
// Reactive state to indicate if the mouse is on the end point
const isMouseOnEnd = ref(false);

// State to control swapping of start/end points
const swapState = ref(false); // false: (0,0) start, (max-1,max-1) end; true: (max,max) start, (0,0) end

// Volume state for maze completions
const volume = ref(0);

// Define cell dimensions for wall detection
const CELL_SIZE = 20; // Must match the width/height in CSS
const BORDER_THICKNESS = 2; // Must match the border-width of .maze-container and .maze-cell.wall-* in CSS

// Computed property to determine if the hovered cell is on an outer edge of the maze
const isMouseOnEdge = computed(() => {
    const r = hoveredCell.row;
    const c = hoveredCell.col;
    return (r === 0 || r === mazeRows.value - 1 || c === 0 || c === mazeCols.value - 1) && (r !== -1 && c !== -1);
});

// Cell class to represent each individual cell in the maze
class Cell {
    constructor(row, col) {
        this.row = row; // Row index of the cell
        this.col = col; // Column index of the cell
        this.walls = {
            top: true,    // Does the cell have a top wall?
            right: true,  // Does the cell have a right wall?
            bottom: true, // Does the cell have a bottom wall?
            left: true,   // Does the cell have a left wall?
        };
        this.visited = false; // Has this cell been visited by the algorithm?
        // isStart is no longer a visual flag on the cell itself
        this.isEnd = false;   // Is this the ending cell?
    }
}

/**
 * Initializes the maze grid with new Cell objects and sets start/end points.
 * Clears any existing grid data.
 */
const initializeGrid = () => {
    grid.splice(0); // Clear the reactive array while maintaining reactivity
    for (let r = 0; r < mazeRows.value; r++) {
        const row = [];
        for (let c = 0; c < mazeCols.value; c++) {
            row.push(new Cell(r, c));
        }
        grid.push(row);
    }

    // Reset all cells' start/end flags before setting new ones
    grid.forEach(row => row.forEach(cell => {
        // cell.isStart = false; // No longer used for visual marking
        cell.isEnd = false;
        // Reset walls to true for a fresh maze generation
        cell.walls = { top: true, right: true, bottom: true, left: true };
    }));


    // Determine current start and end based on swapState
    let currentStartRow, currentStartCol, currentEndRow, currentEndCol;
    if (!swapState.value) { // Default: Top-left (inset) is start, Bottom-right (inset) is end
        currentStartRow = 1; // One row in from top
        currentStartCol = 1; // One col in from left
        currentEndRow = mazeRows.value - 2; // One row in from bottom
        currentEndCol = mazeCols.value - 2; // One col in from right
    } else { // Swapped: Bottom-right (inset) is start, Top-left (inset) is end
        currentStartRow = mazeRows.value - 2; // One row in from bottom
        currentStartCol = mazeCols.value - 2; // One col in from right
        currentEndRow = 1; // One row in from top
        currentEndCol = 1; // One col in from left
    }

    // Update startPoint and endPoint reactive objects
    startPoint.row = currentStartRow;
    startPoint.col = currentStartCol;
    endPoint.row = currentEndRow;
    endPoint.col = currentEndCol;

    // Mark the end cell in the grid
    grid[endPoint.row][endPoint.col].isEnd = true;

    // Create a wider opening on the outer wall aligned with the logical start point
    let outerOpeningRow, outerOpeningCol1, outerOpeningCol2;

    if (!swapState.value) { // Start is top-left (logical start at 1,1)
        outerOpeningRow = 0; // Top row for opening
        outerOpeningCol1 = startPoint.col; // Column of logical start point
        outerOpeningCol2 = startPoint.col + 1; // Adjacent column
        // Open top walls of these two outer cells
        grid[outerOpeningRow][outerOpeningCol1].walls.top = false;
        if (outerOpeningCol2 < mazeCols.value) {
            grid[outerOpeningRow][outerOpeningCol2].walls.top = false;
        }
    } else { // Start is bottom-right (logical start at max-2, max-2)
        outerOpeningRow = mazeRows.value - 1; // Bottom row for opening
        outerOpeningCol1 = startPoint.col; // Column of logical start point
        outerOpeningCol2 = startPoint.col - 1; // Adjacent column
        // Open bottom walls of these two outer cells
        grid[outerOpeningRow][outerOpeningCol1].walls.bottom = false;
        if (outerOpeningCol2 >= 0) {
            grid[outerOpeningRow][outerOpeningCol2].walls.bottom = false;
        }
    }
};

/**
 * Finds all unvisited neighbors of a given cell.
 * @param {Cell} cell - The current cell.
 * @returns {Array<Cell>} An array of unvisited neighbor cells.
 */
const getUnvisitedNeighbors = (cell) => {
    const neighbors = [];
    const { row, col } = cell;

    // Check top neighbor
    if (row > 0 && !grid[row - 1][col].visited) {
        neighbors.push(grid[row - 1][col]);
    }
    // Check right neighbor
    if (col < mazeCols.value - 1 && !grid[row][col + 1].visited) {
        neighbors.push(grid[row][col + 1]);
    }
    // Check bottom neighbor
    if (row < mazeRows.value - 1 && !grid[row + 1][col].visited) {
        neighbors.push(grid[row + 1][col]);
    }
    // Check left neighbor
    if (col > 0 && !grid[row][col - 1].visited) {
        neighbors.push(grid[row][col - 1]);
    }

    return neighbors;
};

/**
 * Removes the wall between two adjacent cells.
 * @param {Cell} cell1 - The first cell.
 * @param {Cell} cell2 - The second cell.
 */
const removeWalls = (cell1, cell2) => {
    const xDiff = cell1.col - cell2.col;
    const yDiff = cell1.row - cell2.row;

    if (xDiff === 1) { // cell2 is to the left of cell1
        cell1.walls.left = false;
        cell2.walls.right = false;
    } else if (xDiff === -1) { // cell2 is to the right of cell1
        cell1.walls.right = false;
        cell2.walls.left = false;
    }

    if (yDiff === 1) { // cell2 is above cell1
        cell1.walls.top = false;
        cell2.walls.bottom = false;
    } else if (yDiff === -1) { // cell2 is below cell1
        cell1.walls.bottom = false;
        cell2.walls.top = false;
    }
};

/**
 * Generates a new maze using the Recursive Backtracker (Depth-First Search) algorithm.
 * This function also handles swapping start/end points.
 */
const generateMaze = () => {
    // Toggle swapState before initializing the grid for the new maze
    swapState.value = !swapState.value;
    initializeGrid(); // Start with a fresh grid of all walls and updated start/end points

    const stack = []; // Stack to keep track of visited cells for backtracking

    // Start the algorithm from the current start point (which is now inset)
    let current = grid[startPoint.row][startPoint.col];
    current.visited = true; // Mark the starting cell as visited
    stack.push(current); // Push it onto the stack

    // Loop while there are cells in the stack
    while (stack.length > 0) {
        const unvisitedNeighbors = getUnvisitedNeighbors(current);

        if (unvisitedNeighbors.length > 0) {
            // Pick a random unvisited neighbor
            const next = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
            removeWalls(current, next); // Remove the wall between current and next
            next.visited = true; // Mark the next cell as visited
            stack.push(current); // Push the current cell onto the stack (for backtracking)
            current = next; // Move to the next cell
        } else {
            // If no unvisited neighbors, backtrack by popping from the stack
            current = stack.pop();
        }
    }
    // Set hoveredCell to the current endPoint after maze generation
    // This ensures the message box reflects the end point immediately after generation.
    hoveredCell.row = endPoint.row;
    hoveredCell.col = endPoint.col;

    // Manually update the hover flags based on the new hoveredCell
    isMouseOnWall.value = false; // Initial hover is not on a wall
    isMouseOnStart.value = (hoveredCell.row === startPoint.row && hoveredCell.col === startPoint.col);
    isMouseOnEnd.value = (hoveredCell.row === endPoint.row && hoveredCell.col === endPoint.col);
};

/**
 * Checks if the mouse coordinates are on a wall of the given cell.
 * This checks internal walls.
 * @param {Cell} cell - The cell object.
 * @param {number} offsetX - Mouse X coordinate relative to the cell.
 * @param {number} offsetY - Mouse Y coordinate relative to the cell.
 * @returns {boolean} True if the mouse is on an internal wall, false otherwise.
 */
const isMouseOnInternalWall = (cell, offsetX, offsetY) => {
    const onTopBorder = cell.walls.top && offsetY <= BORDER_THICKNESS;
    const onBottomBorder = cell.walls.bottom && offsetY >= CELL_SIZE - BORDER_THICKNESS;
    const onLeftBorder = cell.walls.left && offsetX <= BORDER_THICKNESS;
    const onRightBorder = cell.walls.right && offsetX >= CELL_SIZE - BORDER_THICKNESS;

    // Check for corners to avoid false positives on adjacent walls
    const isCorner = (offsetX <= BORDER_THICKNESS && offsetY <= BORDER_THICKNESS) || // Top-left
        (offsetX >= CELL_SIZE - BORDER_THICKNESS && offsetY <= BORDER_THICKNESS) || // Top-right
        (offsetX <= BORDER_THICKNESS && offsetY >= CELL_SIZE - BORDER_THICKNESS) || // Bottom-left
        (offsetX >= CELL_SIZE - BORDER_THICKNESS && offsetY >= CELL_SIZE - BORDER_THICKNESS); // Bottom-right

    if (isCorner) {
        if (onTopBorder && onLeftBorder) return cell.walls.top && cell.walls.left;
        if (onTopBorder && onRightBorder) return cell.walls.top && cell.walls.right;
        if (onBottomBorder && onLeftBorder) return cell.walls.bottom && cell.walls.left;
        if (onBottomBorder && onRightBorder) return cell.walls.bottom && cell.walls.right;
    }

    const isEdge = onTopBorder || onBottomBorder || onLeftBorder || onRightBorder;

    if (isEdge) emit('hit-wall'); // Emit wall hit event if on an edge

    return isEdge; // Return true if on any wall edge
};

/**
 * Checks if the mouse coordinates are on an outer wall of the maze.
 * This includes the maze container's border, with an exception for the start point's opening.
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @param {number} offsetX - Mouse X coordinate relative to the cell.
 * @param {number} offsetY - Mouse Y coordinate relative to the cell.
 * @returns {boolean} True if the mouse is on an outer wall (excluding start opening), false otherwise.
 */
const isMouseOnOuterWall = (row, col, offsetX, offsetY) => {
    // Only check if the cell is on the outer perimeter
    if (!isMouseOnEdge.value) return false;

    const cell = grid[row][col];

    // Check if the current cell is part of the two-cell wide opening
    let isCurrentCellPartOfOpening = false;
    if (!swapState.value) { // Start is top-left (logical start at 1,1), opening at (0,1) and (0,2)
        if (row === 0 && (col === startPoint.col || col === startPoint.col + 1)) {
            // Check if mouse is within the open part of the top wall
            if (offsetY <= BORDER_THICKNESS && !grid[0][startPoint.col].walls.top) {
                isCurrentCellPartOfOpening = true;
            }
        }
    } else { // Start is bottom-right (logical start at max-2, max-2), opening at (max-1, max-2) and (max-1, max-3)
        if (row === mazeRows.value - 1 && (col === startPoint.col || col === startPoint.col - 1)) {
            // Check if mouse is within the open part of the bottom wall
            if (offsetY >= CELL_SIZE - BORDER_THICKNESS && !grid[mazeRows.value - 1][startPoint.col].walls.bottom) {
                isCurrentCellPartOfOpening = true;
            }
        }
    }

    if (isCurrentCellPartOfOpening) {
        return false; // It's part of the opening, so not a wall hit
    }

    // For all other edge cells, if mouse is on the border, it's a wall hit
    // Check top outer wall
    if (row === 0 && offsetY <= BORDER_THICKNESS) return true;
    // Check bottom outer wall
    if (row === mazeRows.value - 1 && offsetY >= CELL_SIZE - BORDER_THICKNESS) return true;
    // Check left outer wall
    if (col === 0 && offsetX <= BORDER_THICKNESS) return true;
    // Check right outer wall
    if (col === mazeCols.value - 1 && offsetX >= CELL_SIZE - BORDER_THICKNESS) return true;

    return false; // Not hitting any specific outer wall
};


/**
 * Updates the hovered cell state and wall hit state when the mouse enters a cell.
 * Also handles maze completion logic.
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @param {MouseEvent} event - The mouse event object.
 */
const handleMouseOver = (row, col, event) => {
    // Store previous state to detect transitions
    const prevIsMouseOnEnd = isMouseOnEnd.value;

    hoveredCell.row = row;
    hoveredCell.col = col;

    const cell = grid[row][col];

    // Determine if it's an internal wall hit OR an outer wall hit (excluding start opening)
    isMouseOnWall.value = isMouseOnInternalWall(cell, event.offsetX, event.offsetY) ||
        isMouseOnOuterWall(row, col, event.offsetX, event.offsetY);
    
    if (isMouseOnWall.value) {
        emit('hit-wall'); // Emit wall hit event if on a wall
    }

    // Update start/end hover states
    // isMouseOnStart.value is no longer used for message, but can be kept for internal logic if needed
    isMouseOnStart.value = (row === startPoint.row && col === startPoint.col);
    isMouseOnEnd.value = (row === endPoint.row && col === endPoint.col);

    // Maze completion logic: If mouse just entered the end cell
    if (isMouseOnEnd.value && !prevIsMouseOnEnd) {
        volume.value++; // Increment volume
        emit('new-volume', volume.value); // Emit new volume event
        // Generate a new maze with swapped start/end points
        // A small timeout ensures the UI updates for the current completion before regenerating
        setTimeout(() => {
            generateMaze();
        }, 150); // Short delay for visual feedback
    }
};

/**
 * Resets the hovered cell state and wall hit state when the mouse leaves the maze.
 */
const handleMouseLeave = () => {
    hoveredCell.row = -1;
    hoveredCell.col = -1;
    isMouseOnWall.value = false;
    isMouseOnStart.value = false; // Resetting this too
    isMouseOnEnd.value = false;
};

// Generate a maze when the component is first mounted
// onMounted(generateMaze);

const initiateMaze = () => generateMaze();
initiateMaze();
// #endregion Maze Generation Logic
</script>

<style>
/* Ensure Inter font is used for the entire application */
body {
    cursor: crosshair;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background-color: #f3f4f6;
    /* Light gray background */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    /* Padding around the content */
    margin: 0;
    /* Reset default body margin */
}

/* Styles for the button section */
.button-section {
    background-color: #ffffff;
    /* White background */
    padding: 1.5rem;
    /* Padding */
    border-radius: 0.5rem;
    /* Rounded corners */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    /* Shadow */
    margin-bottom: 1.5rem;
    /* Margin bottom */
    text-align: center;
    width: 100%;
    /* Take full width of its container */
    max-width: 800px;
    /* Max width for better presentation */
    box-sizing: border-box;
    /* Include padding in width */
}

h1 {
    font-size: 1.875rem;
    /* 3xl font size */
    line-height: 2.25rem;
    font-weight: 700;
    /* Bold font weight */
    color: #1f2937;
    /* Dark gray text color */
    margin-bottom: 1rem;
    /* Margin bottom */
}

.generate-button {
    background-color: #2563eb;
    /* Blue background */
    color: #ffffff;
    /* White text */
    font-weight: 600;
    /* Semi-bold font weight */
    padding: 0.75rem 1.5rem;
    /* Vertical and horizontal padding */
    border-radius: 0.5rem;
    /* Rounded corners */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    /* Shadow */
    transition: all 0.3s ease-in-out;
    /* Smooth transition for hover effects */
    border: none;
    /* Remove default button border */
    cursor: pointer;
    /* Pointer cursor on hover */
}

.generate-button:hover {
    background-color: #1d4ed8;
    /* Darker blue on hover */
    transform: scale(1.05);
    /* Slightly enlarge on hover */
}

.generate-button:focus {
    outline: none;
    /* Remove outline on focus */
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
    /* Blue ring on focus */
}

/* Styles for the maze container */
.maze-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid #374151;
    /* Thinner Dark gray border */
    border-radius: 0.5rem;
    /* Rounded corners */
    overflow: hidden;
    /* Hide overflow for sharp corners */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    /* Shadow */
    margin-top: 1rem;
    /* Added margin for separation */
}

.maze-row {
    display: flex;
}

.maze-cell {
    width: 20px;
    /* Fixed width for each cell */
    height: 20px;
    /* Fixed height for each cell */
    box-sizing: border-box;
    /* Include padding and border in the element's total width and height */
    flex-shrink: 0;
    /* Prevent cells from shrinking */
    border-color: #374151;
    /* Border color for walls */
    border-style: solid;
    border-width: 0;
    /* Default no border, will be overridden by wall classes */
    transition: background-color 0.1s ease;
    /* Smooth transition for hover effects */
}

/* Wall classes - apply 2px border for all walls */
.maze-cell.wall-top {
    border-top-width: 2px;
}

.maze-cell.wall-right {
    border-right-width: 2px;
}

.maze-cell.wall-bottom {
    border-bottom-width: 2px;
}

.maze-cell.wall-left {
    border-left-width: 2px;
}

/* Background colors for cells */
.maze-cell.bg-default {
    background-color: #ffffff;
    /* White background for unvisited cells */
}

.maze-cell.bg-visited {
    background-color: #f9fafb;
    /* Light gray for visited cells (during generation visualization) */
}

/* No bg-start class anymore as start cell is not visually marked */
.maze-cell.bg-end {
    background-color: #4ade80;
    /* Green for the end point */
}

.maze-cell.hovered {
    background-color: #bfdbfe;
    /* Light blue for hovered cell */
}

.maze-cell.edge-hovered {
    background-color: #fca5a5;
    /* Light red for hovered edge cell */
}

.maze-cell.wall-hit {
    background-color: #ef4444;
    /* Red for hitting a wall */
}

/* No start-hovered class anymore */
.maze-cell.end-hovered {
    background-color: #22c55e;
    /* Darker green for end point hover */
}

.message-box {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    font-weight: 500;
    color: #4b5563;
    /* gray-700 */
    text-align: center;
    min-height: 3rem;
    /* Ensure consistent height to prevent jumps */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    /* Take full width */
    max-width: 800px;
    /* Match button section width */
    box-sizing: border-box;
}

.message-box.edge-message {
    background-color: #fee2e2;
    /* red-100 */
    color: #b91c1c;
    /* red-700 */
    font-weight: 700;
}

.message-box.wall-hit-message {
    background-color: #fef2f2;
    /* red-50 */
    color: #dc2626;
    /* red-600 */
    font-weight: 700;
}

.message-box.congrats-message {
    background-color: #dcfce7;
    /* green-100 */
    color: #16a34a;
    /* green-700 */
    font-weight: 700;
}

/* No start-message class anymore */
.volume-display {
    margin-top: 0.5rem;
    font-size: 1.125rem;
    /* text-lg */
    font-weight: 600;
    /* font-semibold */
    color: #374151;
    /* gray-700 */
}
</style>
