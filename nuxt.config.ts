import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: {
    enabled: true
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image'
  ],
  router: {
    middleware: ['auth']
  },
  axios: {
    baseURL: 'http://localhost:8000', // Replace with your Laravel API URL
    withCredentials: true // To include credentials in requests
  },
  runtimeConfig: {
    public: {
      axiosBaseURL: process.env.AXIOS_BASE_URL || 'http://localhost:8000',
    }
  },
  build: {
    transpile: ['vee-validate'],
  },
  tailwindcss: {},
  image: {},
  plugins: ['~/plugins/vee-validate.ts', '~/plugins/axios.ts']
})
