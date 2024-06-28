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
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    const response = await authStore.login( {
      email: email.value,
      password: password.value,
      device_name: 'test'
    })

    if (response.data?.access_token || response.data?.user) {
      await router.push('/profile')
    } else {
      console.error('Authentication failed')
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}

onMounted(() => {
  if(authStore.authenticated) {
    router.push('/profile')
  }
})
</script>
