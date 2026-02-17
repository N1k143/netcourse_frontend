// middleware/auth.ts
/**
 * Middleware для проверки авторизации
 * Используется для защиты страниц, требующих авторизации
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // Проверяем авторизацию только на клиенте
  if (process.client) {
    const token = localStorage.getItem('authToken')
    
    // Если пользователь не авторизован и пытается зайти на защищенную страницу
    if (!token) {
      // Перенаправляем на страницу логина
      return navigateTo({
        path: '/login',
        query: {
          redirect: to.fullPath, // Сохраняем URL для редиректа после логина
          message: 'Для доступа к этой странице необходима авторизация'
        }
      })
    }
  }
})