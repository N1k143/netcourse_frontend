<template>
  <main class="min-h-screen bg-slate-950 pt-32 pb-20 px-6">
    <!-- Фоновая анимация -->
    <div class="absolute inset-0 opacity-30">
      <NetworkBackground />
    </div>
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
    
    <div class="max-w-md mx-auto relative z-10">
      <!-- Заголовок -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">
          <span class="text-emerald-500 font-mono">$</span>
          <span class="font-sans"> user_register</span>
        </h1>
        <p class="text-slate-400 font-mono text-sm">
          Создайте учетную запись для доступа к системе
        </p>
      </div>

      <!-- Форма -->
      <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-8">
        <!-- Декоративный хедер -->
        <div class="flex items-center gap-2 mb-6">
          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          <span class="text-slate-500 ml-2 font-mono text-sm">register_terminal</span>
        </div>

        <!-- Сообщение об ошибке -->
        <div v-if="error" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <div class="text-red-400 font-mono text-sm">
            Error: {{ error }}
          </div>
        </div>

        <!-- Форма регистрации -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Username -->
          <div>
            <label for="username" class="block text-emerald-500 font-mono text-sm mb-2">
              $ username:
            </label>
            <input 
              v-model="formData.username"
              type="text"
              id="username"
              name="username"
              class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="Введите имя пользователя"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-emerald-500 font-mono text-sm mb-2">
              $ email:
            </label>
            <input 
              v-model="formData.email"
              type="email"
              id="email"
              name="email"
              class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="user@example.com"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Пароль -->
          <div>
            <label for="password" class="block text-emerald-500 font-mono text-sm mb-2">
              $ password:
            </label>
            <input 
              v-model="formData.password"
              type="password"
              id="password"
              name="password"
              class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="Минимум 6 символов"
              required
              :disabled="isLoading"
              minlength="6"
            />
          </div>

          <!-- Подтверждение пароля -->
          <div>
            <label for="confirmPassword" class="block text-emerald-500 font-mono text-sm mb-2">
              $ confirm_password:
            </label>
            <input 
              v-model="formData.confirmPassword"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="Повторите пароль"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Кнопка регистрации -->
          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full bg-emerald-500 text-slate-950 rounded-lg font-bold hover:bg-emerald-400 transition-all hover:shadow-lg hover:shadow-emerald-500/50 font-mono py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? '$ Creating Account...' : '$ ./register.sh' }}
          </button>
        </form>

        <!-- Разделитель -->
        <div class="flex items-center my-6">
          <div class="flex-1 h-px bg-emerald-500/30"></div>
          <span class="px-3 text-slate-500 font-mono text-sm">OR</span>
          <div class="flex-1 h-px bg-emerald-500/30"></div>
        </div>

        <!-- Ссылка на логин -->
        <div class="text-center">
          <p class="text-slate-400 font-mono text-sm mb-3">
            Уже есть аккаунт?
          </p>
          <NuxtLink 
            to="/login" 
            class="inline-block px-6 py-2 bg-transparent text-emerald-500 rounded-lg font-bold border-2 border-emerald-500/50 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all font-mono text-sm"
          >
            $ ./login.sh
          </NuxtLink>
        </div>
      </div>

      <!-- Информация -->
      <div class="mt-8 text-center">
        <div class="bg-slate-900 border border-emerald-500/30 rounded-lg p-4 font-mono text-xs">
          <div class="text-emerald-500 mb-2">Requirements:</div>
          <div class="text-slate-400 space-y-1">
            <div>• Уникальное имя пользователя</div>
            <div>• Действительный email адрес</div>
            <div>• Пароль минимум 6 символов</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: 'default'
})

const { register } = useAuth()
const { handleApiError } = useApi()

// Состояние формы
const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')
const isLoading = ref(false)

const validateForm = (): boolean => {
  if (!formData.value.username) {
    error.value = 'Имя пользователя обязательно для заполнения'
    return false
  }

  if (formData.value.username.length < 3) {
    error.value = 'Имя пользователя должно содержать минимум 3 символа'
    return false
  }

  if (!formData.value.email) {
    error.value = 'Email обязателен для заполнения'
    return false
  }

  if (!formData.value.email.includes('@')) {
    error.value = 'Введите корректный email адрес'
    return false
  }

  if (!formData.value.password) {
    error.value = 'Пароль обязателен для заполнения'
    return false
  }

  if (formData.value.password.length < 6) {
    error.value = 'Пароль должен содержать минимум 6 символов'
    return false
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Пароли не совпадают'
    return false
  }

  return true
}

const handleSubmit = async () => {
  error.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    await register({
      username: formData.value.username,
      email: formData.value.email,
      password: formData.value.password
    })

  } catch (err: any) {
    error.value = handleApiError(err, 'Ошибка при регистрации')
  } finally {
    isLoading.value = false
  }
}
</script>