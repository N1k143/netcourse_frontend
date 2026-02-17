// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Проверяем только на клиенте, так как localStorage доступен только там
  if (process.client) {
    const token = localStorage.getItem('authToken')
    
    // Если пользователь уже авторизован, перенаправляем на главную
    if (token) {
      return navigateTo('/courses')
    }
  }
})