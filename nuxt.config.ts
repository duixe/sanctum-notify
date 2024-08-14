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
  runtimeConfig: {
    public: {
      ReverbAppKey: process.env.REVERB_APP_KEY,
      ReverbHost: process.env.REVERB_HOST,
      ReverbPort: process.env.REVERB_PORT,
      ReverbScheme: process.env.REVERB_SCHEME
    }
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
    redirectIfUnauthenticated: false,
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
        keepRequestedRoute: true,
        onLogin: '/dashboard',
        onLogout: '/auth',
        onAuthOnly: '/auth',
        onGuestOnly: '/dashboard',
    },
    globalMiddleware: {
        enabled: false,
        allow404WithoutAuth: true,
    },
    logLevel: 3,
  },
  ssr: false
});
