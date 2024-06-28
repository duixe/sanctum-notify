// stores/auth.ts
import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

function getCookie(name: string | undefined): any {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
        return parts.pop().split(';').shift()
    }
    return undefined
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        authenticated: false,
        errors: null,
        authMode: 'token', // token or cookie
    }),
    actions: {
        async login(credentials: { email: string; password: string; device_name?: string }) {
            if (this.authMode === 'cookie') {
                return this.cookieLogin(credentials)
            }
            return this.tokenLogin(credentials)
        },
        async cookieLogin(credentials: { email: string; password: string }) {
            try {
                const nuxtApp = useNuxtApp()
                const axios = nuxtApp.$axios

                await axios.get('/sanctum/csrf-cookie')
                const csrfToken = getCookie('XSRF-TOKEN')
                if (csrfToken) {
                    axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken
                }

                await axios.post('/auth/login', credentials)
                this.authenticated = true

                // Fetch user data after login
                await this.fetchUser()
            } catch (error: any) {
                console.log(error)
                this.errors = error.response?.data || error
            }
        },
        async tokenLogin(credentials: { email: string; password: string; device_name?: string }) {
            try {
                const nuxtApp = useNuxtApp()
                const axios = nuxtApp.$axios
                const response = await axios.post('/api/auth/mobile/token', credentials)

                this.authenticated = true
                this.user = response.data.user
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data?.access_token}` || `Bearer ${response.data?.token}`

                // Persist user data
                localStorage.setItem('authenticated', 'true')
                localStorage.setItem('user', JSON.stringify(this.user))
                localStorage.setItem('token', response.data?.access_token || response.data?.token)
            } catch (error: any) {
                console.log(error)
                this.errors = error.response?.data || error
            }
        },
        async logout() {
            try {
                const nuxtApp = useNuxtApp()
                const axios = nuxtApp.$axios

                await axios.post('/auth/logout')
                this.user = null
                this.authenticated = false

                // Remove user data from localStorage
                localStorage.removeItem('authenticated')
                localStorage.removeItem('user')
                localStorage.removeItem('token')
            } catch (error: any) {
                this.errors = error.response?.data || error
            }
        },
        async fetchUser() {
            if (this.user) {
                // User data is already in the store, no need to fetch again
                return
            }

            try {
                const nuxtApp = useNuxtApp()
                const axios = nuxtApp.$axios

                const response = await axios.get('/api/auth/user')
                this.user = response.data
                this.authenticated = true
            } catch (error: any) {
                this.user = null
                this.authenticated = false
            }
        },
        getStoredUser() {
            const authenticated = localStorage.getItem('authenticated') === 'true'
            const user = localStorage.getItem('user')
            const token = localStorage.getItem('token')

            if (authenticated && user && token) {
                this.authenticated = true
                this.user = JSON.parse(user)

                const nuxtApp = useNuxtApp()
                const axios = nuxtApp.$axios
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }
        },
    },
})
