<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'

const router = useRouter()
const routes = router.options.routes
const showCode = ref(false)

const toggleCode = () => {
  showCode.value = !showCode.value
}
</script>

<template>
  <header>
    <nav class="main-nav">
      <div class="left-nav">
        <div v-for="route in routes" :key="route.name">
          <RouterLink  :to="route.path" class="link">
            {{ route.meta?.displayName || route.name }}
          </RouterLink>|
        </div>
      </div>
      <button @click="toggleCode">QR Code</button>
    </nav>
  </header>

  <RouterView />
  <img class="qr" v-if="showCode" src="@/assets/peopleschoice.png"/>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 60px;
}
.link:hover {
  color: lime;
}
.main-nav {
  background-color: #666666;
  font-size: 1.8em;
  display: flex;
  justify-content: space-between;
}
.left-nav {
  display: flex;
}
.qr {
  position: fixed;
  height: 200px;
  width: 200px;
  bottom: 20px;
  right: 20px;
}
</style>