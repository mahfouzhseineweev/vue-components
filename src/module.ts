import { defineNuxtModule, addComponentsDir, installModule, createResolver } from '@nuxt/kit'
import { join } from 'path'

export default defineNuxtModule({
  meta: {
    name: '@geeks.solutions/vue-components',
    configKey: 'geeksComponents',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    // Module default options
    tailwindcss: true,
  },
  async setup(options, nuxt) {
    // @ts-ignore
    const { resolve } = createResolver(import.meta.url)

    // Register components with prefix
    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: 'g',
      global: true
    })

    await installModule('@nuxtjs/i18n', {
      vueI18n: resolve('./runtime/i18n.config.ts'),
      langDir: resolve('./runtime/lang'),
      locales: [
        {
          code: 'en',
          file: resolve('./runtime/lang/en.json'),
        },
        {
          code: 'fr',
          file: resolve('./runtime/lang/fr.json'),
        },
      ]
    })

  }
})
