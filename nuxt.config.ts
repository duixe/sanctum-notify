// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    "shadcn-nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-auth-sanctum"
  ],
  colorMode: {
    classSuffix: ''
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  sanctum: {
    baseUrl: 'http://localhost:8000',
    mode: 'cookie',
    userStateKey: 'sanctum.user.identity',
    redirectIfAuthenticated: false,
    redirectIfUnauthenticated: true,
    endpoints: {
        csrf: '/sanctum/csrf-cookie',
        login: '/auth/login',
        logout: '/auth/logout',
        user: '/api/auth/user',
    },
    csrf: {
        cookie: 'XSRF-TOKEN',
        header: 'X-XSRF-TOKEN',
    },
    client: {
        retry: false,
    },
    redirect: {
        keepRequestedRoute: false,
        onLogin: '/dashboard',
        onLogout: '/',
        onAuthOnly: '/',
        onGuestOnly: '/dashboard',
    },
    globalMiddleware: {
        enabled: true,
        allow404WithoutAuth: true,
    },
    logLevel: 3,
  }
});
