<template>
  <button @click="logout">Logout Now</button>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
}
</script>
