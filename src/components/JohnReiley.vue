<script setup>
import chatContainer from './JohnReiley/chatContainer.vue';
</script>

<template>
    <div class="container">
        <div class="background"></div>
        <div class="logo-header">
        <img class="logo-header__logo" src="@/assets/volume-intelligence-logo-2.png" alt="Logo" />
        </div>
        <div class="contents">
            <chat-container />
        </div>
    </div>
</template>

<style>
body {
    margin: 0;
}

.container {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.background {
    background: rgb(33, 33, 33);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1; /* Ensure it stays behind other content */
}

.logo-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 64px;
    background-color: rgb(33, 33, 33);
    border-bottom: solid 1px rgb(61, 61, 61);
    box-shadow: 0 4px 32px rgba(0,0,0,0.25);

    display: flex;
    align-items: center;
    color: white;
    font-size: 24px;
}
.logo-header__logo {
    max-height: 48px;
    margin-left: 16px;
}

.contents {
    padding-top: 64px; /* to avoid overlap with the header */
    height: 100%;
}
</style>