<template>
    <div
        class="knob-control"
        @mousedown="startDrag"
    >
        <!-- Amp-style knob SVG -->
        <svg
            class="knob-indicator"
            width="70"
            height="70"
            viewBox="0 0 70 70"
        >
            <!-- Outer metallic ring -->
            <circle
                cx="35"
                cy="35"
                r="32"
                fill="url(#metal)"
                stroke="#888"
                stroke-width="3"
            />
            <!-- Inner face -->
            <circle
                cx="35"
                cy="35"
                r="25"
                fill="#e0cda9"
                stroke="#bfa76a"
                stroke-width="2"
            />
            <!-- Tick marks -->
            <g>
                <template v-for="i in 11" :key="i">
                    <rect
                        :x="34"
                        :y="7"
                        width="2"
                        height="8"
                        :fill="i === 6 ? '#d9534f' : '#888'"
                        :transform="`rotate(${(i-1)*27-135} 35 35)`"
                    />
                </template>
            </g>
            <!-- Knob indicator (pointer) -->
            <g :style="{ transform: `rotate(${angle}deg)`, transformOrigin: '35px 35px' }">
                <rect x="33" y="13" width="4" height="18" rx="2" fill="#222" />
                <!-- Small circle at the tip for amp style -->
                <circle cx="35" cy="13" r="3" fill="#d9534f" stroke="#222" stroke-width="1"/>
            </g>
            <!-- Center screw -->
            <circle
                cx="35"
                cy="35"
                r="3"
                fill="#888"
                stroke="#555"
                stroke-width="1"
            />
            <defs>
                <radialGradient id="metal" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#fff"/>
                    <stop offset="100%" stop-color="#bbb"/>
                </radialGradient>
            </defs>
        </svg>
        <slot />
    </div>
</template>

<script>
export default {
    name: 'Knob',
    props: {
        sensitivity: {
            type: Number,
            default: 1
        },
        maxChange: {
            type: Number,
            default: 100
        },
        modelValue: {
            type: Number,
            required: true
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            dragging: false,
            lastX: 0,
            dragStartValue: 0,
            totalChanged: 0 // Track cumulative change
        };
    },
    computed: {
        // Dial visual rotation matches drag direction
        angle() {
            if (this.maxChange === 0) return 0;
            const percent = Math.max(-1, Math.min(1, this.totalChanged / this.maxChange));
            return percent * 135;
        }
    },
    methods: {
        startDrag(event) {
            this.dragging = true;
            this.lastX = event.clientX;
            this.dragStartValue = this.modelValue;
            window.addEventListener('mousemove', this.onDrag);
            window.addEventListener('mouseup', this.stopDrag);
        },
        onDrag(event) {
            if (!this.dragging) return;
            const deltaX = event.clientX - this.lastX;
            if (Math.abs(deltaX) > Math.abs(this.sensitivity)) {
                // For negative sensitivity, turning right (positive deltaX) decreases value
                let modelChange = Math.trunc(deltaX) * (this.sensitivity > 0 ? 1 : -1);

                // Calculate allowed positive and negative changes
                const maxPos = Math.max(0, this.maxChange - this.totalChanged);
                const maxNeg = Math.min(0, -this.maxChange - this.totalChanged);

                // Clamp change so totalChanged does not exceed maxChange in either direction
                if (modelChange > 0 && modelChange > maxPos) modelChange = maxPos;
                if (modelChange < 0 && modelChange < maxNeg) modelChange = maxNeg;

                // If no change is allowed in this direction, return
                if ((modelChange > 0 && maxPos === 0) || (modelChange < 0 && maxNeg === 0) || modelChange === 0) return;

                let newValue = this.modelValue + modelChange;
                this.totalChanged += modelChange;
                this.$emit('update:modelValue', Math.round(newValue));
                this.lastX = event.clientX;
            }
        },
        stopDrag() {
            this.dragging = false;
            window.removeEventListener('mousemove', this.onDrag);
            window.removeEventListener('mouseup', this.stopDrag);
        }
    }
};
</script>

<style scoped>
.knob-control {
    width: 100px;
    height: 100px;
    background-color: transparent;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    user-select: none;
    cursor: ew-resize;
    position: relative;
    flex-direction: column;
}
.knob-indicator {
    display: block;
    margin-bottom: 4px;
}
</style>