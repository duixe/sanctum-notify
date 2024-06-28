import { defineNuxtPlugin } from '#app'
import axios from 'axios'

export default defineNuxtPlugin(nuxtApp => {
    const api = axios.create({
        baseURL: nuxtApp.$config.public.axiosBaseURL,
        withCredentials: true
    })

    nuxtApp.provide('axios', api)
})
