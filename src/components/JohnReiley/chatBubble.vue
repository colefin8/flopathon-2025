<template>
    <div :class="styling">
        <span v-if="messageType === 'thinking'" class="bubble-thinking">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </span>
        <span v-else>{{ message }}</span>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import MESSAGE_TYPE from './messageType.js';

// create a prop to determine if the message is from the user or the bot
const props = defineProps({
    messageType: {
        type: String,
        required: true,
        validate: value => Object.values(MESSAGE_TYPE).includes(value),
    },
    message: {
        type: String,
        required: true,
    }
});

const styling = computed(() => {
    switch (props.messageType) {
        case MESSAGE_TYPE.USER:
            return 'chat-bubble chat-bubble--user';
        case MESSAGE_TYPE.BOT:
            return 'chat-bubble chat-bubble--bot';
        case MESSAGE_TYPE.THINKING:
            return 'chat-bubble chat-bubble--thinking';
        default:
            return '';
    }
});

</script>

<style scoped>
.chat-bubble {
    color: white;
    background-color: #f1f1f1;
    border-radius: 12px;
    padding: 12px;
    margin: 8px 0;
    max-width: 80%;
    align-self: flex-start;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.chat-bubble--user {
    background-color: #6f21db;
    align-self: flex-end;
}
.chat-bubble--bot, .chat-bubble--thinking {
    background-color: transparent;
    box-shadow: none;
    align-self: flex-start;
}

.bubble-thinking {
    display: flex;
    align-items: center;
    height: 20px;
    gap: 6px;
}
.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #bbb;
    opacity: 0.7;
    animation: bounce 1.2s infinite;
}
.dot:nth-child(2) {
    animation-delay: 0.2s;
}
.dot:nth-child(3) {
    animation-delay: 0.4s;
}
@keyframes bounce {
    0%, 80%, 100% {
        transform: translateY(0);
        opacity: 0.7;
    }
    40% {
        transform: translateY(-8px);
        opacity: 1;
    }
}
</style>