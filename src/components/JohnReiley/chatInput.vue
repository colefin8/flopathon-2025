<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['sendMessage']);
const model = defineModel('isLoading', {
    type: Boolean,
    default: false
});
const message = ref('');

const sendMessage = () => {
    if (message.value.trim()) {
        emit('sendMessage', message.value);
        message.value = ''; // Clear the input after sending
    }
};
</script>

<template>
    <div class="chat-input-floating">
        <input
            v-model="message"
            class="chat-input__input"
            type="text"
            placeholder="Type your message here..."
            @keydown.enter="sendMessage"
        />
        <button class="chat-input__send" @click="sendMessage" aria-label="Send">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
            </svg>
        </button>
    </div>
</template>

<style scoped>

.chat-input-floating {
    position: fixed;
    left: 50%;
    bottom: 16px;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    background: rgb(49, 49, 49);
    border: solid 1px rgb(61, 61, 61);
    box-shadow: 0 4px 32px rgba(0,0,0,0.25);
    border-radius: 24px;
    padding: 16px 16px;
    max-width: 600px;
    width: calc(100% - 32px);
    z-index: 1000;
    gap: 8px;
    transition: all 0.4s;
}
.chat-input-floating:focus-within {
    box-shadow: 0 4px 32px rgba(0,0,0,0.25), 0 1.5px 32px #6f21dbe1;
    bottom: 48px;
    animation: pulse-shadow 3s infinite ease-in-out;
}

@keyframes pulse-shadow {
    0%, 100% {
        box-shadow: 0 4px 32px rgba(0,0,0,0.25), 0 1.5px 32px #6f21dbe1;
    }
    50% {
        box-shadow: 0 4px 32px rgba(0,0,0,0.25), 0 1.5px 48px #6f21dbe1;
    }
}

.chat-input__input {
    flex: 1;
    padding: 10px 14px;
    border: none;
    border-radius: 14px;
    background-color: rgba(255,255,255,0.08);
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    outline: none;
    margin-right: 8px;
    transition: background-color 0.2s;
}
.chat-input__input:focus {
    background-color: rgb(70, 70, 70);
}

.chat-input__send {
    padding: 8px;
    background: white;
    color: rgb(55, 55, 55);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s;
}
.chat-input__send:hover {
    background: #6f21db;
    color: white;
}
</style>
