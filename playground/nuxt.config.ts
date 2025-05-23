export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '../src/module'],
  geeksComponents: {},
  compatibilityDate: '2025-04-08',
  devtools: { enabled: true },
  tailwindcss: {
    exposeConfig: true,
  }
})
