<template>
<div class="relative flex w-full touch-none items-center select-none" :class="[disabled ? 'opacity-50' : '', className]">
    <div class="bg-muted relative grow overflow-hidden rounded-full h-4 w-full">
      <div class="bg-primary absolute h-full" :style="{ width: `${(value[0] / max) * 100}%` }"></div>
    </div>
    <div
        class="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        :style="{ left: `${(value[0] / max) * 100}%`, position: 'absolute' }"
    ></div>
</div>
</template>

<script setup>

const props = defineProps({
    value: {
        type: Array,
        default: () => [0]
    },
    max: {
        type: Number,
        default: 100
    },
    min: {
        type: Number,
        default: 0
    },
    step: {
        type: Number,
        default: 1
    },
    disabled: {
        type: Boolean,
        default: false
    },
    className: {
        type: String,
        default: ''
    }
});
</script>