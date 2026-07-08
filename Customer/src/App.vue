<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AIChatWidget from '@/components/AIChatWidget.vue'

import AppToast from '@/components/AppToast.vue'

const route = useRoute()
const showChat = computed(() => !['landing', 'login'].includes(route.name))
</script>

<template>
  <RouterView />
  <AIChatWidget v-if="showChat" />
  <AppToast />
</template>

<style scoped></style>
