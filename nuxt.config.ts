// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      postUrlAPI: process.env.NUXT_POST_URL_API || 'http://localhost:3000/api'
    }
  },

//   nitro: {
//     publicAssets: [
//         {
//             dir: 'public',
//             baseURL: '/uploads', // เส้นทาง URL สำหรับไฟล์ static
//         },
//     ],
// },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
