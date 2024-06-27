import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],
  build: {
    transpile: ['vee-validate'],
  },
  tailwindcss: {},
  image: {},
  plugins: ['~/plugins/vee-validate.ts']
})
