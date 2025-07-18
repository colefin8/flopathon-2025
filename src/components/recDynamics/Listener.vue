<template>
    <span
        class="sneaky-microphone"
        @mousedown="startRecording"
        @mouseup="stopRecording"
    >
        🗣
</span>
    <div :class="['snackbar', { show: (showSnackbar && defeatedTheProgram) }]">
        {{ snackMessage }}
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import useRecDynamicsStore from './_recDynamicsStore.js';
const recDynamicsStore = useRecDynamicsStore();
const { loudestVolume, defeatedTheProgram, startRecordingTrigger, stopRecordingTrigger } = storeToRefs(recDynamicsStore);

const recording = ref(false);
const volumeLevel = ref(0);
const showSnackbar = ref(false);
const snackTimeout = ref(null);
const volumeLowestAllowed = 20;

const snackMessage = computed(() => {
    // if(defeatedTheProgram.value && loudestVolume.value <= 10) {
    //     return 'You need to be louder!! Start over!!';
    // }
    // else if(loudestVolume.value >= volumeLowestAllowed){
        return `Congrats, you've set the volume to  ${loudestVolume.value}!`;
    // }
});

const startRecording  = async () => {
    recording.value = true;
    loudestVolume.value = 0;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioContext = new AudioContext();
        const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
        const analyserNode = audioContext.createAnalyser();
        mediaStreamAudioSourceNode.connect(analyserNode);
        const pcmData = new Float32Array(analyserNode.fftSize);
        const onFrame = () => {
            if(recording.value) {
                analyserNode.getFloatTimeDomainData(pcmData);
                let sumSquares = 0.0;
                for (const amplitude of pcmData) { sumSquares += amplitude*amplitude; }
                volumeLevel.value = Math.sqrt(sumSquares / pcmData.length) * 100;
                if (volumeLevel.value <= 1) {
                    volumeLevel.value = 0;
                }
                if (volumeLevel.value > volumeLowestAllowed) {
                    loudestVolume.value = Math.min(volumeLevel.value.toFixed(), 100);
                    defeatedTheProgram.value = true;
                    recording.value = false;
                    if(defeatedTheProgram.value) {
                        showSnackbar.value = true;
                        stopRecording();
                        return;
                    }
                }
                window.requestAnimationFrame(onFrame);
            }
        };
        window.requestAnimationFrame(onFrame);
    } catch (err) {
        alert('We need access to your microphone, silly goose!');
        recording.value = false;
    }
}

const stopRecording = () => {
    recording.value = false;
    if (snackTimeout.value) {
        clearTimeout(snackTimeout.value);
    }
    snackTimeout.value = setTimeout(() => {
        showSnackbar.value = false;
    }, 3000);
}

watch(startRecordingTrigger, () => {
    if(!recording.value) {
        startRecording();
    }
});

watch(stopRecordingTrigger, () => {
    if(recording.value) {
        stopRecording();
    }
});

watch(loudestVolume, (newValue) => {
    if(recording.value){
        defeatedTheProgram.value = loudestVolume.value >= volumeLowestAllowed;
        if(defeatedTheProgram.value) {
            showSnackbar.value = true;
            stopRecording();
        }
    }
});
</script>

<style scoped>
.sneaky-microphone{
    cursor: pointer;
    position: fixed;
    bottom: 0;
    left: 40px;
    opacity: 0.1;
    z-index: 1000;

}
.snackbar {
    visibility: hidden;
    min-width: 250px;
    margin-left: -125px;
    background-color: #0b835b;
    color: #fff;
    border: 6px dashed #fff;
    text-align: center;
    border-radius: 4px;
    padding: 12px;
    position: fixed;
    z-index: 1;
    right: 0;
    bottom: 30px;
    &.danger {
        background-color: #991b1b;
        border-color: #fff;
    }
}

.snackbar.show {
    z-index: 1000;
    visibility: visible;
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fade-in 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}

</style>