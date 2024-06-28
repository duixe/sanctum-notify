import {useAuthStore} from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()
    if (!authStore.authenticated && to.name !== 'login') {
        return navigateTo('/login')
    }
})

