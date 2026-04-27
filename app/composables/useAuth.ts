// composables/useAuth.ts
export interface User {
  id?: number
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatarUrl?: string  // Изменено с avatar на avatarUrl согласно Prisma схеме
  role?: string
  createdAt?: string
  updatedAt?: string
  enrollments?: any[]
}

export interface AuthResponse {
  token?: string
  user?: User
  message?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
}

export const useAuth = () => {
  const router = useRouter()
  const { authAPI, handleApiError, sanitizeData } = useApi()
  
  const user = useState<User | null>('auth:user', () => null)
  const token = useState<string | null>('auth:token', () => null)
  const loading = useState<boolean>('auth:loading', () => false)

  // Инициализация - загрузка данных из localStorage
  const initialize = () => {
    if (process.client) {
      const savedToken = localStorage.getItem('authToken')
      const savedUser = localStorage.getItem('userData')

      if (savedToken && savedUser) {
        try {
          token.value = savedToken
          user.value = JSON.parse(savedUser)
        } catch (error) {
          console.error('Error parsing saved user data:', error)
          logout()
        }
      }
    }
  }

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  const login = async (credentials: LoginCredentials, redirectPath = '/courses'): Promise<void> => {
    loading.value = true
    
    try {
      const cleanCredentials = sanitizeData(credentials)
      const response = await authAPI.login(cleanCredentials)

      console.log('Login response:', response)

      // Проверяем разные форматы ответа от сервера
      let authToken = response.token || response.accessToken || response.data?.token
      let userData = response.user || response.data?.user || response

      if (!authToken) {
        throw new Error('Сервер не вернул токен авторизации')
      }

      // Если user не пришел отдельно, берем из основного объекта
      if (!userData || !userData.email) {
        userData = {
          id: response.id,
          email: response.email || credentials.email,
          username: response.username || response.name,
          role: response.role,
          avatarUrl: response.avatarUrl || response.avatar_url
        }
      }

      token.value = authToken
      user.value = userData
      
      authAPI.saveAuthData(authToken, userData)

      await navigateTo(redirectPath)

    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterData, redirectPath = '/login'): Promise<void> => {
    loading.value = true
    try {
      const cleanData = sanitizeData(data)
      const response = await authAPI.register(cleanData)

      let authToken = response.token || response.accessToken || response.data?.token

      // Если токена нет – делаем автоматический вход
      if (!authToken) {
        const loginResponse = await authAPI.login({ email: data.email, password: data.password })
        authToken = loginResponse.token || loginResponse.accessToken || loginResponse.data?.token
        if (!authToken) throw new Error('Не удалось получить токен авторизации после регистрации')
        const userData = loginResponse.user || loginResponse.data?.user || response.user
        token.value = authToken
        user.value = userData || {
          id: response.user?.id,
          email: data.email,
          username: data.username,
          role: response.user?.role,
          avatarUrl: response.user?.avatarUrl
        }
        authAPI.saveAuthData(authToken, user.value)
      } else {
        let userData = response.user || response.data?.user || response
        if (!userData || !userData.email) {
          userData = {
            id: response.id,
            email: response.email || data.email,
            username: response.username || data.username,
            role: response.role,
            avatarUrl: response.avatarUrl || response.avatar_url
          }
        }
        token.value = authToken
        user.value = userData
        authAPI.saveAuthData(authToken, userData)
      }

      // ФЛАГ ДЛЯ МОДАЛКИ
      if (process.client) {
        localStorage.setItem('justRegistered', 'true')
      }

      // Перенаправляем на главную, чтобы показать InterestModal
      await navigateTo('/')
    } catch (error: any) {
      console.error('Register error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async (redirectToLogin = true) => {
    try {
      token.value = null
      user.value = null
      
      authAPI.logout()

      if (redirectToLogin) {
        await navigateTo('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getCurrentUser = (): User | null => {
    return user.value
  }

  const getToken = (): string | null => {
    return token.value
  }

  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      
      if (process.client) {
        localStorage.setItem('userData', JSON.stringify(user.value))
      }
    }
  }

  const isAdmin = computed(() => {
    return user.value?.role === 'admin' || user.value?.role === 'administrator' || user.value?.role === 'ADMIN'
  })

  return {
    user,  
    token, 
    loading: readonly(loading),
    isAuthenticated,
    isAdmin,
    
    initialize,
    login,
    register,
    logout,
    getCurrentUser,
    getToken,
    updateUser
  }
}