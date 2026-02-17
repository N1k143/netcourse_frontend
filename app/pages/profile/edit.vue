<template>
  <main class="min-h-screen bg-slate-950 pt-24 sm:pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div class="text-emerald-500 font-mono text-xl mt-4">$ loading_edit-page...</div>
      </div>
    </div>

    <!-- Main content -->
    <div v-else>
      <div class="absolute inset-0 opacity-30 pointer-events-none">
        <NetworkBackground />
      </div>
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      <div class="max-w-3xl mx-auto relative z-10">
        <div class="text-center mb-8 sm:mb-12">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            <span class="text-emerald-500 font-mono text-xl sm:text-3xl lg:text-4xl">$ edit</span>
            <br/>
            <span class="font-sans bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Редактирование профиля
            </span>
          </h1>

          <p class="text-slate-400 font-mono text-xs sm:text-sm max-w-2xl mx-auto px-4">
            Измените данные вашего профиля
          </p>
        </div>

        <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-6 lg:p-8">
          <div class="flex items-center gap-2 mb-6 sm:mb-8">
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            <span class="text-slate-500 font-mono text-xs sm:text-sm">profile_editor</span>
          </div>

          <!-- Error message -->
          <div v-if="error" class="mb-4 sm:mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <div class="text-red-400 font-mono text-xs sm:text-sm break-words">
              {{ error }}
            </div>
          </div>

          <!-- Success message -->
          <div v-if="success" class="mb-4 sm:mb-6 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
            <div class="text-emerald-400 font-mono text-xs sm:text-sm break-words">
              {{ success }}
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
            <!-- Basic Info -->
            <div class="space-y-4 sm:space-y-6">
              <h3 class="text-lg sm:text-xl font-bold text-white mb-2 font-mono">Основная информация</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label class="block text-emerald-500 font-mono text-xs sm:text-sm mb-2">
                    $ username:
                  </label>
                  <input 
                    type="text"
                    v-model="formData.username"
                    class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Введите имя пользователя"
                    required
                  />
                </div>

                <div>
                  <label class="block text-emerald-500 font-mono text-xs sm:text-sm mb-2">
                    $ email:
                  </label>
                  <input 
                    type="email"
                    v-model="formData.email"
                    class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Password Change -->
            <div class="border-t border-emerald-500/20 pt-6 sm:pt-8">
              <h3 class="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 font-mono">Смена пароля</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-emerald-500 font-mono text-xs sm:text-sm mb-2">
                    $ current_password:
                  </label>
                  <input 
                    type="password"
                    v-model="formData.currentPassword"
                    class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Текущий пароль"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-emerald-500 font-mono text-xs sm:text-sm mb-2">
                      $ new_password:
                    </label>
                    <input 
                      type="password"
                      v-model="formData.newPassword"
                      class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Новый пароль"
                    />
                  </div>

                  <div>
                    <label class="block text-emerald-500 font-mono text-xs sm:text-sm mb-2">
                      $ confirm_password:
                    </label>
                    <input 
                      type="password"
                      v-model="formData.confirmPassword"
                      class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Подтвердите пароль"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end pt-4 sm:pt-6 border-t border-emerald-500/20">
              <NuxtLink 
                to="/profile" 
                class="w-full sm:w-auto text-center px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800 text-slate-300 rounded-lg font-mono hover:bg-slate-700 transition-all border border-slate-600 hover:border-emerald-500/50 text-xs sm:text-sm"
              >
                $ cancel.sh
              </NuxtLink>
              
              <button 
                type="submit"
                :disabled="saving"
                class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-500 text-slate-950 rounded-lg font-bold hover:bg-emerald-400 transition-all hover:shadow-lg hover:shadow-emerald-500/50 font-mono text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ saving ? 'Сохранение...' : '$ save_profile.sh' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const { updateUser } = useAuth()
const { userAPI, authAPI, handleApiError } = useApi()

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')

const formData = reactive({
  username: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
})

const loadUserData = async () => {
  loading.value = true
  error.value = ''

  try {
    if (!authAPI.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authAPI.getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }

    // Загружаем актуальные данные с сервера
    const user = await userAPI.getById(currentUser.id)
    
    formData.username = user.username || ""
    formData.email = user.email || ""
    formData.currentPassword = ""
    formData.newPassword = ""
    formData.confirmPassword = ""

  } catch (err) {
    console.error('Ошибка загрузки данных:', err)
    error.value = handleApiError(err, 'Не удалось загрузить данные профиля')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = ''
  success.value = ''

  try {
    const currentUser = authAPI.getCurrentUser()
    if (!currentUser) throw new Error('Пользователь не найден')

    const updateData = {}

    // Проверяем изменения базовой информации
    if (formData.username !== currentUser.username) {
      updateData.username = formData.username
    }
    if (formData.email !== currentUser.email) {
      updateData.email = formData.email
    }

    // Проверка смены пароля
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        throw new Error('Новый пароль должен содержать минимум 6 символов')
      }
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('Новые пароли не совпадают')
      }
      if (!formData.currentPassword) {
        throw new Error('Введите текущий пароль для смены пароля')
      }
      
      updateData.password = formData.newPassword
      updateData.currentPassword = formData.currentPassword
    }

    if (Object.keys(updateData).length > 0) {
      // Отправляем обновления на сервер
      const updatedUser = await userAPI.update(currentUser.id, updateData)

      // Обновляем данные в localStorage
      const token = authAPI.getToken()
      authAPI.saveAuthData(token, updatedUser)
      
      // Обновляем в useAuth composable
      updateUser(updatedUser)
      
      success.value = 'Профиль успешно обновлен!'
      
      // Очищаем поля пароля
      formData.currentPassword = ""
      formData.newPassword = ""
      formData.confirmPassword = ""

      // Через 2 секунды перенаправляем на профиль
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    } else {
      success.value = 'Нет изменений для сохранения.'
    }

  } catch (err) {
    console.error('Ошибка сохранения профиля:', err)
    error.value = handleApiError(err, err.message || 'Не удалось сохранить изменения')
  } finally {
    saving.value = false
  }
}

// Загружаем данные при монтировании
onMounted(() => {
  loadUserData()
})
</script>