<template>
  <div>
    <StartButton @start="showTyping = true" v-if="!showTyping" />
    <TypingTest v-if="showTyping" @complete="onTypingComplete" :typing-audio="typingAudio" />
    <ConfirmationDialog v-if="showConfirmation" :volume="finalWPM" @success="saveVolume" @fail="resetGame"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StartButton from '../components/screaming-fingers/StartButton.vue';
import TypingTest from '../components/screaming-fingers/TypingTest.vue';
import ConfirmationDialog from '../components/screaming-fingers/ConfirmationDialog.vue';

const typingAudio = [
  '../../../public/sounds/typing/big-hit.mp3',
  '../../../public/sounds/typing/censor.mp3',
  '../../../public/sounds/typing/click.mp3',
  '../../../public/sounds/typing/creaking.mp3',
  '../../../public/sounds/typing/glass.mp3',
  '../../../public/sounds/typing/hit.mp3',
  '../../../public/sounds/typing/horn.mp3',
  '../../../public/sounds/typing/needle.mp3',
  '../../../public/sounds/typing/pipe.mp3',
  '../../../public/sounds/typing/pop.mp3',
  '../../../public/sounds/typing/rise.mp3',
  '../../../public/sounds/typing/snap.mp3',
  '../../../public/sounds/typing/surprise.mp3',
  '../../../public/sounds/typing/thriller.mp3',
  '../../../public/sounds/typing/violin.mp3',
  '../../../public/sounds/typing/whistle.mp3',
]

const showTyping = ref(false)
const showConfirmation = ref(false)
const finalWPM = ref(0)

function onTypingComplete(WPM) {
	finalWPM.value = WPM
	showTyping.value = false
	showConfirmation.value = true
}
const resetGame = () => {
  showTyping.value = true;
  showConfirmation.value = false;
  finalWPM.value = 0;
}

function saveVolume() {
  console.log('Final Volume Set To:', finalWPM.value)
  alert(`Volume saved at ${finalWPM.value} WPM!`);
}
</script>

