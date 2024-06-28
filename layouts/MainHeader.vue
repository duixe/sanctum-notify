<template>
    <header>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink v-if="!authStore.authenticated" to="/login">Login</NuxtLink>
      <NuxtLink v-else to="/logout">Logout</NuxtLink>
      <NuxtLink to="/profile">Profile</NuxtLink>
    </header>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

</script>
<style scoped>
</style>
