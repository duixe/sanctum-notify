<template>
  <div>
    <h1 v-if="authStore.authenticated">Welcome, {{ authStore?.user?.first_name }}</h1>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
</style>
