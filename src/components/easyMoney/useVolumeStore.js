import {defineStore} from 'pinia'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useVolumeStore = defineStore('volumeStore',() => {
  const route = useRoute();

  const router = useRouter()
  const userIsPremium = ref(false);
  const isViewingAd = ref(false);
  const volume = ref(0);
  const isTimerActive = ref(false);
  const currentTimer = ref(null);

  watch(isViewingAd, (newValue) => {
    if (isViewingAd.value) {
      console.log(route)
      if (route.path !== '/easy-money/ad') {

    console.log('redirecting')
      router.push({ path: '/easy-money/ad/' })
      }
    }
  })

  const isFlipped = ref(false);
  const selectedCardInfo = ref(null);

  function setAdTimeout() {
    const timerAmount = userIsPremium.value ? 15000 : 10000;
    currentTimer.value = timerAmount;
    isTimerActive.value = true;
    setTimeout(() => {
      volume.value = 0;
      isTimerActive.value = false;
    }, timerAmount);
  }

  const clickThreshold = ref(2);

  return {
    userIsPremium,
    isFlipped,
    selectedCardInfo,
    isViewingAd,
    volume,
    setAdTimeout,
    isTimerActive,
    currentTimer,
    clickThreshold,
  }
});