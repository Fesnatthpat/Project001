// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  css: [ '~/assets/css/main.css' ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      postUrlAPI: 'http://localhost:3000/api'
      // postUrlAPI: process.env.NUXT_POST_URL_API || 'http://localhost:3000/api'
    }
  },

  nitro: {
    serveStatic: true,
    prerender: {
      routes: [ '/' ], // รวมเส้นทางสำคัญทั้งหมด
    },
  },
  app: {
    baseURL: '/', // ตรวจสอบว่า baseURL ถูกต้อง
  },



  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
