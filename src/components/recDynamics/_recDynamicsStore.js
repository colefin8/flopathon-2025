import { ref } from 'vue';
import { defineStore } from 'pinia';

const useRecDynamicsStore = defineStore('recDynamics', () => {
    const standardCountVal = 60;
    const timerCountdownValue = ref(standardCountVal);
    const loudestVolume = ref(0);
    const defeatedTheProgram = ref(false);
    const startRecordingTrigger = ref(0);
    const stopRecordingTrigger = ref(0);
    const volumeLowestAllowed = 20;


    return {
        timerCountdownValue,
        loudestVolume,
        volumeLowestAllowed,
        defeatedTheProgram,
        standardCountVal,
        startRecordingTrigger,
        stopRecordingTrigger
    }

});
export default useRecDynamicsStore;