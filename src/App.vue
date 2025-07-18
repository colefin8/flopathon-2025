<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';

const router = useRouter();
const routes = router.options.routes;
const showCode = ref(false);

const toggleCode = () => {
    showCode.value = !showCode.value;
};
</script>

<template>
    <!-- Add a dedicated hover trigger area at the top of the screen -->
    <div class="header-trigger"></div>

    <header>
        <nav class="main-nav">
            <div class="left-nav">
                <div v-for="route in routes" :key="route.name">
                    <RouterLink :to="route.path" class="link">
                        {{ route.meta?.displayName || route.name }} </RouterLink
                    >|
                </div>
            </div>
            <button @click="toggleCode">QR Code</button>
        </nav>
    </header>

    <RouterView />
    <img class="qr" v-if="showCode" src="@/assets/peopleschoice.png" />
</template>

<style scoped>
header {
    position: fixed;
    top: -60px; /* Initially off-screen */
    left: 0;
    right: 0;
    width: 100%;
    height: 60px;
    max-height: 60px;
    transition: top 0.3s ease; /* Smooth transition when sliding down */
    z-index: 100; /* Ensure it's above other content */
}
/* Creating a dedicated hover trigger area */
.header-trigger {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 20px; /* Slightly larger hover area */
    z-index: 99;
}
.header-trigger:hover + header,
header:hover {
    top: 0; /* Slide down when hovered */
}
.link:hover {
    color: lime;
}
.link {
    padding: 0 5px;
    white-space: nowrap;
}
.main-nav {
    max-height: 60px;
    background-color: #666666;
    font-size: 1.8em;
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.left-nav {
    max-height: 60px;
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: thin;
    padding-bottom: 5px;
}
.qr {
    position: fixed;
    height: 200px;
    width: 200px;
    bottom: 20px;
    right: 20px;
}
</style>
