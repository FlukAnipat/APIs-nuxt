import colors from 'vuetify/es5/util/colors'

export default {
  head: {
    titleTemplate: '%s - APIs',
    title: 'APIs',
    htmlAttrs: {
      lang: 'th'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'ระบบรวม API และข่าวสาร' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/img/icon.jpg' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap' },
    ]
  },

  css: [
    '~/assets/global.css'
  ],

  plugins: [],

  components: true,

  buildModules: [
    '@nuxtjs/vuetify',
  ],

  modules: [],

   axios: {
      baseURL: process.env.API_BASE_URL || 'http://localhost:3001'
    },

    publicRuntimeConfig: {
      axios: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:3001'
      }
    },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: { icons: 'mdi' },
    theme: {
      dark: true,
      themes: {
        dark: {
          primary:   colors.blue.darken2,
          accent:    colors.grey.darken3,
          secondary: colors.amber.darken3,
          info:      colors.teal.lighten1,
          warning:   colors.amber.base,
          error:     colors.deepOrange.accent4,
          success:   colors.green.accent3
        }
      }
    }
  },

  build: {}
}