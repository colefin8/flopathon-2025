<script setup>
import { ref, nextTick, onMounted } from 'vue';
import debounce from 'lodash.debounce';
import MESSAGE_TYPE from './messageType.js';
import chatBubble from './chatBubble.vue';
import chatInput from './chatInput.vue';

// import { getResponse } from '../messageResponseUtils.js';
import { getResponse, getResponseFromVolumeChange } from './messageResponseUtils.js';

// dummy data for the chat bubbles
const chatBubbles = ref([
    {
        messageType: MESSAGE_TYPE.BOT,
        message: "I'm here to help with your volume! Try asking me to mute, turn up, or turn down the sound. Just no flirting please."
    }
]);

const isLoading = ref(false);
const chatContainerRef = ref(null);
const volumeLevel = ref(100);
const audioPlayer = ref(null);
const firstInteraction = ref(true);

const scrollToBottom = () => {
    nextTick(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
};

const startMusic = () => {
    if (audioPlayer.value && firstInteraction.value) {
        audioPlayer.value.play();
        isLoading.value = true; // Set loading state
        setTimeout(() => {
            chatBubbles.value.push({
                messageType: MESSAGE_TYPE.BOT,
                message: "Hmm, you have an interesting taste in music...",
            });
            isLoading.value = false; // Reset loading state
        }, 2000);
        firstInteraction.value = false; // Prevent auto-play on subsequent interactions
    }
};

const onSendMessage = (message) => {
    if (isLoading.value) {
        return;
    }

    isLoading.value = true; // Set loading state
    chatBubbles.value.push({
        messageType: MESSAGE_TYPE.USER,
        message,
    });
    scrollToBottom();

    // Simulate bot response
    let response = getResponse(message, volumeLevel.value);
    volumeLevel.value = response.newVolumeLevel; // Update volume level if provided

    setTimeout(() => {
        chatBubbles.value.push({
            messageType: MESSAGE_TYPE.THINKING,
            message: ''
        });
        scrollToBottom();
    }, 200);

    setTimeout(() => {
        chatBubbles.value.pop(); // Remove the thinking bubble
        setTimeout(() => {
            // Add the bot response after a delay
            chatBubbles.value.push({
                messageType: MESSAGE_TYPE.BOT,
                message: response.response,
            });
            scrollToBottom();
            // set the new volume level for the audio player
            if (audioPlayer.value) {
                audioPlayer.value.volume = response.newVolumeLevel / 100; // Assuming volume level is between 0 and 100
            }
            isLoading.value = false; // Reset loading state
        }, 200);
    }, Math.random() * 1000 + 2000); // Random delay between 500ms and 1500ms
};

onMounted(() => {
    scrollToBottom();
    if (audioPlayer.value) {
        audioPlayer.value.volume = volumeLevel.value / 100; // Set initial volume level
    }

    document.addEventListener('keydown', debounce((event) => {
        const randomResponse = getResponseFromVolumeChange(event);
        if (!randomResponse || firstInteraction.value || isLoading.value) {
            return;
        }

        chatBubbles.value.push({
            messageType: MESSAGE_TYPE.BOT,
            message: randomResponse,
        });
        scrollToBottom();
    }, 1000));
});
</script>

<template>
    <div ref="chatContainerRef" class="chat-container">
        <transition-group name="bubble-fade">
            <chat-bubble
                v-for="(bubble, i) in chatBubbles"
                :key="i + '-' + bubble.message"
                :message-type="bubble.messageType"
                :message="bubble.message"
            />
        </transition-group>
        <div class="chat-cover"></div>
        <chat-input
            v-model="isLoading"
            @sendMessage="onSendMessage"
            @click="startMusic"
        />
        <audio
            ref="audioPlayer"
            preload="auto"
            loop
        >
            <source src="https://res.cloudinary.com/dluurxst5/video/upload/v1752810863/comedy-347537_epnp7v.mp3" type="audio/mpeg">
            <!-- <source src="https://res.cloudinary.com/dluurxst5/video/upload/v1752814744/stylish-deep-electronic-262632_qdxl1r.mp3" type="audio/mpeg"> -->
        </audio>
    </div>
</template>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    margin: auto;
    margin-top: 16px;
    margin-bottom: 136px;
    height: 100%;
    width: 100%;
    max-width: 600px;
}

.chat-cover {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 82px;
    background-color: rgb(33, 33, 33);
}

.bubble-fade-enter-active {
    transition: all 0.35s cubic-bezier(0.4, 0.2, 0.2, 1);
}
.bubble-fade-leave-active {
    transition: all 0.2s cubic-bezier(0.4, 0.2, 0.2, 1);
}
.bubble-fade-enter-from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
}
.bubble-fade-enter-to {
    opacity: 1;
    transform: translateY(0) scale(1);
}
.bubble-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
.bubble-fade-leave-to {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
}

</style>