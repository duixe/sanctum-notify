import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(nuxtApp => {
    const authStore = useAuthStore(nuxtApp.$pinia)

    if (process.client) {
        authStore.getStoredUser()
    }
})
