<script setup>
import { computed, ref, useTemplateRef } from 'vue';
import { onKeyStroke, useAnimate, useCountdown } from '@vueuse/core';

const TYPING_TEST_WORDS = "Bacon ipsum dolor amet short loin landjaeger pork loin, beef sirloin burgdoggen hamburger pig doner. Ground round jerky tail buffalo, pastrami tongue sausage turducken pig chuck t-bone capicola shankle tri-tip. Tenderloin alcatra jerky turkey t-bone. Sausage andouille porchetta kevin drumstick beef. Strip steak swine jerky ribeye cow chicken pig meatloaf boudin ground round sausage turkey beef ribs pastrami. Biltong boudin bacon drumstick, andouille beef ribs beef shoulder. Tail shoulder turducken, chicken frankfurter tri-tip turkey beef ribs. Shankle doner brisket jowl boudin filet mignon. Boudin pork loin brisket spare ribs frankfurter rump. Tongue sausage turkey chislic pork chop chuck beef ribeye turducken. Cow doner jowl sirloin, short loin pork chop rump ground round buffalo venison turducken pork loin. Bresaola beef filet mignon shankle tri-tip hamburger corned beef shoulder chicken picanha ground round bacon jerky pork. Pig tail prosciutto kielbasa beef pork, jerky short ribs meatloaf ground round fatback ham salami. Drumstick tail ball tip, chicken pork loin tenderloin fatback jerky swine alcatra corned beef pastrami short ribs."

const userTypedWords = ref('');
const typingTestStarted = ref(false);

const typingTestContainer = useTemplateRef('typingTestContainer');

const { play, pause } = useAnimate(
    typingTestContainer,
    [
        { transform: 'translate(0, 0)' },
        { transform: 'translate(-50%, 0)' },
        { transform: 'translate(0, 0)' },
        { transform: 'translate(50%, 0)' },
        { transform: 'translate(0, 0)' },
        { transform: 'translate(-50%, 0) rotate(-360deg)' },
        { transform: 'translate(0, 0) rotate(0deg)' },
        { transform: 'translate(50%, 0) rotate(360deg)' },
        { transform: 'translate(0, 0) rotate(0deg)' },
    ],
    {
        duration: 60000,
        easing: 'linear',
        iterations: Infinity,
        immediate: false,
        commitStyles: true,
    },
);

const { remaining, start, reset } = useCountdown(60, {
    onComplete: () => {
        typingTestStarted.value = false;
        alert('Your volume was set to ' + wordsPerMinute.value + '%');
        stop();
        pause();
    },
});

const correctWords = computed(() => {
    return userTypedWords.value.split(' ').filter((word, index) => {
        return word === TYPING_TEST_WORDS.split(' ')[index];
    }).length;
});

const  wordsPerMinute = computed(() => {
    if (!correctWords.value) return 0;

    const wordsPerSecond = (correctWords.value / 60 - remaining.value);

    if ((wordsPerSecond * 60) > 100) {
        return 100; // Cap the value at 100%
    }

    return Math.floor(wordsPerSecond * 60);
});

const retryTest = () => {
    userTypedWords.value = '';
    reset();
};

onKeyStroke((e) => {
    if (remaining === 0) {
        return;
    }

    if (!typingTestStarted.value && !userTypedWords.value) {
        typingTestStarted.value = true;
        start();
        play();
    }

    if (e.key === 'Enter' || e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt') {
        return;
    }

    if (e.key === 'Backspace') {
        userTypedWords.value = userTypedWords.value.slice(0, -1);
        return;
    } else {
        userTypedWords.value += e.key;
    }
});
</script>

<template>
    <div class="typing-powered-volume-slider">
        <h2>Type the prompt below for one minute at the WPM you would like your volume to be </h2>
        <div class="slider-container">
            <div class="slider">
                <label>Volume {{ !typingTestStarted && userTypedWords.length > 0 ? `${wordsPerMinute}%` : '' }}</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    :value="!typingTestStarted && userTypedWords.length > 0 ? wordsPerMinute : 0"
                    class="slider"
                    disabled
                />
                <button v-if="!typingTestStarted && userTypedWords.length > 0" @click="retryTest">Reset</button>
            </div>
        </div>
        <div ref="typingTestContainer" class="typing-test">
            <p>
                <span
                    v-for="(word, index) in TYPING_TEST_WORDS.split(' ')"
                    :key="index"
                    :class="{
                        'correct-word': userTypedWords.split(' ')[index] === word,
                        'incorrect-word': userTypedWords.split(' ')[index] && userTypedWords.split(' ')[index] !== word && index !== userTypedWords.split(' ').length - 1,
                        'current-word': index === userTypedWords.split(' ').length - 1,
                        'not-typed': !userTypedWords.split(' ')[index]
                    }"
                >
                    {{ word + ' ' }}
                </span>
            </p>
        </div>
    </div>
</template>

<style scoped>
.typing-powered-volume-slider {
    height: 100vh;
    width: 100%;
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .typing-test {
        width: 50%;
        margin-top: 40px;
        padding: 20px;
        font-family: fantasy;
        background-color: rgba(0, 0, 0, .4)
    }

    .current-word {
        color: black;
    }

    .not-typed {
        color: gray;
    }

    .correct-word {
        color: green;
    }

    .incorrect-word {
        color: red;
    }

    .slider-container {
        width: 50%;
        margin-top: 40px;
        display: flex;
        justify-content: center;
        align-items: center;

        .slider {
            width: 200px;
            padding: 20px;
            input {
                padding: 0px;
                cursor: not-allowed
            }
        }
    }
}
</style>
