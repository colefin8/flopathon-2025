<template>
    <component :is="isViewingAd ? WatchAd : LootBox"></component>
</template>

<script setup lang="ts">
import WatchAd from './WatchAd.vue'
import LootBox from './LootBox.vue'
import { useVolumeStore } from './useVolumeStore';
import { storeToRefs } from 'pinia'

const { isViewingAd } = storeToRefs(useVolumeStore())
</script>

<style scoped>
</style>