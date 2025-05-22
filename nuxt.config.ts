// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/test-utils",
    "@nuxtjs/i18n"
  ],
  imports: {
    autoImport: false
  },
  build: {
    transpile: ['quill'],
  },
  vite: {
    optimizeDeps: {
      exclude: ['quill']
    }
  },
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true
    }
  }
})