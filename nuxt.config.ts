export default defineNuxtConfig({
  compatibilityDate: '2025-02-01',
  devtools: { enabled: true },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/mdc'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  mdc: {
    highlight: {
      theme: {
        default: 'github-dark',
        dark: 'github-dark'
      },
      wrapperStyle: false,
      langs: [
        'javascript',
        'typescript',
        'python',
        'bash',
        'shell',
        'json',
        'css',
        'scss',
        'html',
        'xml',
        'markdown',
        'yaml',
        'sql',
      ]
    },
    headings: {
      anchorLinks: false
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api'
    }
  },

  app: {
    head: {
      title: 'NetLearn - Образовательная платформа',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Современная образовательная платформа'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/netlearn.png' }
      ]
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js'
  },

  build: {
    transpile: ['lucide-vue-next']
  }
})