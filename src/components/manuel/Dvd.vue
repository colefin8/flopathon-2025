<template>
    <div id="black">
        <div
            id="dvd"
            ref="dvd"
            :style="{
                left: x + 'px',
                top: y + 'px',
                backgroundColor: backgroundColor
            }"
        ></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const x = ref(0)
const y = ref(0)
const dirX = ref(.75)
const dirY = ref(1)
const speed = 8
const pallete = ["#ff8800", "#e124ff", "#6a19ff", "#ff2188"]
const prevColorChoiceIndex = ref(0)
const dvd = ref(null)
const dvdWidth = ref(100)
const dvdHeight = ref(50)
const backgroundColor = ref(pallete[0])
const emit = defineEmits(['hover'])

function getNewRandomColor() {
    const currentPallete = [...pallete]
    currentPallete.splice(prevColorChoiceIndex.value, 1)
    const colorChoiceIndex = Math.floor(Math.random() * currentPallete.length)
    prevColorChoiceIndex.value = colorChoiceIndex < prevColorChoiceIndex.value ? colorChoiceIndex : colorChoiceIndex + 1
    return currentPallete[colorChoiceIndex]
}

function animate() {
    const screenHeight = window.innerHeight
    const screenWidth = window.innerWidth

    if (y.value + dvdHeight.value >= screenHeight || y.value < 0) {
        dirY.value *= -1
        backgroundColor.value = getNewRandomColor()
    }
    if (x.value + dvdWidth.value >= screenWidth || x.value < 0) {
        dirX.value *= -1
        backgroundColor.value = getNewRandomColor()
    }
    x.value += dirX.value * speed
    y.value += dirY.value * speed
    window.requestAnimationFrame(animate)
}

onMounted(() => {
    window.requestAnimationFrame(animate)
    if (dvd.value) {
        dvd.value.addEventListener('mouseover', () => {
            emit('hover')
        })
    }
})

</script>



<style>
body {
    margin: 0;
    box-sizing: border-box;
    overflow: hidden;
}

#black {
    height: 100vh;
    width: 100vw;
    background-color: #111;
}

#dvd {
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100px;
    width: 200px;
    mask: url("https://upload.wikimedia.org/wikipedia/commons/9/9b/DVD_logo.svg");
    -webkit-mask: url("https://upload.wikimedia.org/wikipedia/commons/9/9b/DVD_logo.svg");
    background-repeat: no-repeat;
    background-size: 75px;
    background-position: center;
    z-index: 25;
}
</style>