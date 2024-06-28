<template>
  <div>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie')

    const response = await axios.post('http://localhost:8000/api/auth/mobile/token', {
      email: email.value,
      password: password.value,
      device_name: 'test'
    })

    if (response?.data?.access_token) {
      await router.push('/')
    } else {
      console.error('Authentication failed')
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}

onMounted(() => {
  if(authStore.authenticated) {
    router.push('/')
  }
})
</script>
