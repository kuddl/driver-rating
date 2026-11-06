// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      titleTemplate: '%s · Johannas Fahrt-Check',
      htmlAttrs: { lang: 'de' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap' },
      ],
    },
  },
  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      dev: {
        configPath: 'wrangler.jsonc',
        persistDir: '.wrangler/state/v3',
      },
    },
  }
})
