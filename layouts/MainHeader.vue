<template>
    <header>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink v-if="!authStore.authenticated" to="/login">Login</NuxtLink>
      <NuxtLink v-else @click="logout">Logout</NuxtLink>

      <NuxtLink v-if="authStore.authenticated" to="/profile">Profile</NuxtLink>
    </header>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const logout = async () => {
  authStore.logout()
}
</script>
<style scoped>
</style>
