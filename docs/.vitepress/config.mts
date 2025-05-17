import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Документация Areal HR",
  description: "Документация HR-системы для управления персоналом",
  base: '/docs/',
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Руководство', link: '/guide/getting-started' }
    ],

    sidebar: [
      {
        text: 'Введение',
        items: [
          { text: 'О проекте', link: '/guide/about' },
          { text: 'Начало работы', link: '/guide/getting-started' }
        ]
      },
      {
        text: 'Архитектура',
        items: [
          { text: 'Структура проекта', link: '/architecture/project-structure' },
          { text: 'База данных', link: '/architecture/database' },
          { text: 'Безопасность', link: '/architecture/security' }
        ]
      },
      {
        text: 'API',
        items: [
          { text: 'Основные маршруты', link: '/api/routes' }
        ]
      },
      {
        text: 'Руководство пользователя',
        items: [
          { text: 'Основные функции', link: '/user-guide/features' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/NekitBST/areal-hr-test-2025' }
    ]
  }
})
