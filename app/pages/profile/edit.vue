<template>
  <main class="min-h-screen bg-slate-950 pt-24 sm:pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">

    <!-- ===== МОДАЛКА ПОДТВЕРЖДЕНИЯ ПАРОЛЕМ ===== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showConfirmModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeConfirmModal"
        >
          <div class="absolute inset-0 bg-slate-950/90 backdrop-blur-md"></div>

          <Transition name="modal-scale">
            <div
              v-if="showConfirmModal"
              class="relative w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-500/10 overflow-hidden"
            >
              <!-- Декор -->
              <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

              <!-- Кнопка закрыть -->
              <button
                @click="closeConfirmModal"
                class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all"
              >
                <Icon name="mdi:close" class="w-4 h-4" />
              </button>

              <div class="relative p-6 sm:p-8">
                <!-- Иконка -->
                <div class="flex items-center gap-2 mb-1">
                  <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-slate-500 font-mono text-xs ml-1">confirm_identity</span>
                </div>

                <div class="mt-5 mb-6">
                  <h3 class="text-xl font-bold text-white font-mono mb-1">Подтверждение изменений</h3>
                  <p class="text-slate-400 font-mono text-xs">Введите текущий пароль для сохранения</p>
                </div>

                <!-- Инпут пароля -->
                <div class="mb-5">
                  <label class="block text-emerald-500 font-mono text-xs mb-2">$ current_password:</label>
                  <div class="relative">
                    <input
                      ref="confirmPasswordInput"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      v-model="confirmPassword"
                      @keydown.enter="submitWithPassword"
                      class="w-full bg-slate-800 border rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none transition-colors pr-10"
                      :class="confirmError ? 'border-red-500/60 focus:border-red-500' : 'border-emerald-500/30 focus:border-emerald-500'"
                      placeholder="Введите пароль..."
                      autocomplete="current-password"
                    />
                    <button
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <Icon :name="showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-4 h-4" />
                    </button>
                  </div>
                  <div v-if="confirmError" class="mt-2 text-red-400 font-mono text-xs">{{ confirmError }}</div>
                </div>

                <!-- Кнопки -->
                <div class="flex gap-3">
                  <button
                    @click="closeConfirmModal"
                    class="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl font-mono text-sm transition-all"
                  >
                    $ cancel.sh
                  </button>
                  <button
                    @click="submitWithPassword"
                    :disabled="saving || !confirmPassword"
                    class="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-mono font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <div v-if="saving" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>{{ saving ? 'Сохранение...' : '$ confirm.sh' }}</span>
                  </button>
                </div>
              </div>

              <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
    <!-- ===== КОНЕЦ МОДАЛКИ ===== -->

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div class="text-emerald-500 font-mono text-xl mt-4">$ loading_edit-page...</div>
      </div>
    </div>

    <!-- Main content -->
    <div v-else>
      <div class="absolute inset-0 opacity-30 pointer-events-none"><NetworkBackground /></div>
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      <div class="max-w-3xl mx-auto relative z-10">
        <div class="text-center mb-8 sm:mb-12">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            <span class="text-emerald-500 font-mono text-xl sm:text-3xl lg:text-4xl">$ edit</span>
            <br/>
            <span class="font-sans bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">Редактирование профиля</span>
          </h1>
          <p class="text-slate-400 font-mono text-xs sm:text-sm max-w-2xl mx-auto px-4">Измените данные вашего профиля</p>
        </div>

        <!-- ===== PROFILE FORM ===== -->
        <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-6 lg:p-8 mb-6">
          <div class="flex items-center gap-2 mb-6 sm:mb-8">
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            <span class="text-slate-500 font-mono text-xs sm:text-sm">profile_editor</span>
          </div>

          <div v-if="error" class="mb-4 sm:mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <div class="text-red-400 font-mono text-xs sm:text-sm break-words">{{ error }}</div>
          </div>
          <div v-if="success" class="mb-4 sm:mb-6 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
            <div class="text-emerald-400 font-mono text-xs sm:text-sm break-words">{{ success }}</div>
          </div>

          <form @submit.prevent="openConfirmModal" class="space-y-6 sm:space-y-8">
            <!-- Basic Info -->
            <div class="space-y-4 sm:space-y-5">
              <h3 class="text-lg sm:text-xl font-bold text-white font-mono">Основная информация</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label class="block text-emerald-500 font-mono text-xs sm:text-sm mb-2">$ username:</label>
                  <input
                    type="text"
                    v-model="formData.username"
                    class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Введите имя пользователя"
                    required
                  />
                </div>
                <div>
                  <label class="block text-emerald-500 font-mono text-xs sm:text-sm mb-2">$ email:</label>
                  <input
                    type="email"
                    v-model="formData.email"
                    class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>

              <!-- Bio -->
              <div>
                <label class="block text-emerald-500 font-mono text-xs sm:text-sm mb-2">$ bio:</label>
                <textarea
                  v-model="formData.bio"
                  rows="3"
                  class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                  placeholder="Расскажите о себе..."
                  maxlength="300"
                ></textarea>
                <div class="text-slate-500 font-mono text-xs mt-1 text-right">{{ formData.bio?.length || 0 }}/300</div>
              </div>
            </div>

            <!-- Password Change -->
            <div class="border-t border-emerald-500/20 pt-6 sm:pt-8">
              <h3 class="text-lg sm:text-xl font-bold text-white mb-1 font-mono">Смена пароля</h3>
              <p class="text-slate-500 font-mono text-xs mb-4 sm:mb-5">Оставьте поля пустыми, если не хотите менять пароль</p>

              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-emerald-500 font-mono text-xs sm:text-sm mb-2">$ new_password:</label>
                    <input
                      type="password"
                      v-model="formData.newPassword"
                      class="w-full bg-slate-800 border border-emerald-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Новый пароль"
                    />
                  </div>
                  <div>
                    <label class="block text-emerald-500 font-mono text-xs sm:text-sm mb-2">$ confirm_password:</label>
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
              <NuxtLink to="/profile" class="w-full sm:w-auto text-center px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800 text-slate-300 rounded-lg font-mono hover:bg-slate-700 transition-all border border-slate-600 hover:border-emerald-500/50 text-xs sm:text-sm">$ cancel.sh</NuxtLink>
              <button
                type="submit"
                class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-500 text-slate-950 rounded-lg font-bold hover:bg-emerald-400 transition-all hover:shadow-lg hover:shadow-emerald-500/50 font-mono text-xs sm:text-sm"
              >
                $ save_profile.sh
              </button>
            </div>
          </form>
        </div>

        <!-- ===== SOCIAL LINKS ===== -->
        <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-6 lg:p-8">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            <span class="text-slate-500 font-mono text-xs sm:text-sm">social_links</span>
          </div>

          <h3 class="text-lg sm:text-xl font-bold text-white mb-1 font-mono">Социальные ссылки</h3>
          <p class="text-slate-400 font-mono text-xs mb-6">Добавьте ссылки на ваши профили в социальных сетях</p>

          <div v-if="socialError" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <div class="text-red-400 font-mono text-xs sm:text-sm break-words">{{ socialError }}</div>
          </div>

          <!-- Existing links -->
          <div v-if="socialLinks.length > 0" class="space-y-3 mb-6">
            <div
              v-for="link in socialLinks"
              :key="link.id"
              class="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3"
            >
              <!-- View mode -->
              <template v-if="editingLinkId !== link.id">
                <div class="flex items-center gap-2.5 flex-1 min-w-0">
                  <div class="shrink-0 w-6 h-6 flex items-center justify-center">
                    <img v-if="link.platform === 'github'" src="https://cdn-icons-png.flaticon.com/256/25/25231.png" alt="GitHub" class="w-5 h-5 object-contain brightness-0 invert" />
                    <img v-else-if="link.platform === 'twitter'" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ3X0LHh-DqOD8MPrmr8K0XtCnIH6ftjqFQw&s" alt="X" class="w-5 h-5 object-contain rounded-sm" />
                    <img v-else-if="link.platform === 'youtube'" src="https://static.vecteezy.com/system/resources/thumbnails/018/930/572/small_2x/youtube-logo-youtube-icon-transparent-free-png.png" alt="YouTube" class="w-5 h-5 object-contain" />
                    <Icon v-else-if="link.platform === 'website'" name="mdi:web" class="w-5 h-5 text-slate-300" />
                    <Icon v-else name="mdi:link-variant" class="w-5 h-5 text-slate-300" />
                  </div>
                  <div class="min-w-0">
                    <div class="text-emerald-400 font-mono text-xs font-semibold">{{ link.platform }}</div>
                    <a :href="link.url" target="_blank" rel="noopener noreferrer" class="text-slate-300 text-xs hover:text-emerald-400 transition-colors break-all">{{ link.url }}</a>
                  </div>
                </div>
                <div class="flex gap-2 shrink-0">
                  <button @click="startEditLink(link)" class="px-3 py-1.5 bg-slate-700 text-slate-300 rounded font-mono text-xs hover:bg-slate-600 hover:text-white transition-all border border-slate-500">$ edit</button>
                  <button @click="handleDeleteLink(link.id)" :disabled="deletingLinkId === link.id" class="px-3 py-1.5 bg-red-500/20 text-red-400 rounded font-mono text-xs hover:bg-red-500/30 transition-all border border-red-500/30 disabled:opacity-50 flex items-center gap-1">
                    <div v-if="deletingLinkId === link.id" class="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    <span v-else>$ rm</span>
                  </button>
                </div>
              </template>

              <!-- Edit mode -->
              <template v-else>
                <div class="flex flex-col sm:flex-row gap-2 flex-1">
                  <select v-model="editLinkData.platform" class="bg-slate-700 border border-emerald-500/30 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none transition-colors">
                    <option v-for="p in platformOptions" :key="p.value" :value="p.value">{{ p.label }}</option>
                  </select>
                  <input type="url" v-model="editLinkData.url" class="flex-1 bg-slate-700 border border-emerald-500/30 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none transition-colors" placeholder="https://..." />
                </div>
                <div class="flex gap-2 shrink-0">
                  <button @click="handleUpdateLink(link.id)" :disabled="savingLink" class="px-3 py-1.5 bg-emerald-500 text-slate-950 rounded font-mono text-xs hover:bg-emerald-400 transition-all font-bold disabled:opacity-50 flex items-center gap-1">
                    <div v-if="savingLink" class="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span v-else>$ save</span>
                  </button>
                  <button @click="cancelEditLink" class="px-3 py-1.5 bg-slate-700 text-slate-300 rounded font-mono text-xs hover:bg-slate-600 transition-all border border-slate-500">$ esc</button>
                </div>
              </template>
            </div>
          </div>

          <!-- Add new link -->
          <div class="border-t border-emerald-500/20 pt-5">
            <h4 class="text-sm font-bold text-slate-300 font-mono mb-3">$ add_new_link</h4>
            <div class="flex flex-col sm:flex-row gap-3">
              <select v-model="newLink.platform" class="bg-slate-800 border border-emerald-500/30 rounded-lg px-3 py-2.5 text-white font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors">
                <option value="" disabled>Платформа</option>
                <option v-for="p in platformOptions" :key="p.value" :value="p.value">{{ p.label }}</option>
              </select>
              <input type="url" v-model="newLink.url" class="flex-1 bg-slate-800 border border-emerald-500/30 rounded-lg px-3 py-2.5 text-white font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition-colors" placeholder="https://..." />
              <button
                @click="handleAddLink"
                :disabled="addingLink || !newLink.platform || !newLink.url"
                class="px-4 py-2.5 bg-emerald-500 text-slate-950 rounded-lg font-mono text-xs sm:text-sm font-bold hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <div v-if="addingLink" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span v-else>$ add.sh</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const router = useRouter()
const { updateUser } = useAuth()
const { userAPI, authAPI, socialLinksAPI, handleApiError } = useApi()

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')

// Модалка подтверждения
const showConfirmModal = ref(false)
const confirmPassword = ref('')
const confirmError = ref('')
const showConfirmPassword = ref(false)
const confirmPasswordInput = ref(null)

const socialLinks = ref([])
const socialError = ref('')
const addingLink = ref(false)
const savingLink = ref(false)
const deletingLinkId = ref(null)
const editingLinkId = ref(null)

const newLink = reactive({ platform: '', url: '' })
const editLinkData = reactive({ platform: '', url: '' })

const platformOptions = [
  { value: 'github', label: 'GitHub' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Other' }
]

const formData = reactive({
  username: "",
  email: "",
  bio: "",
  newPassword: "",
  confirmPassword: ""
})

const openConfirmModal = () => {
  // Валидация перед открытием модалки
  if (formData.newPassword) {
    if (formData.newPassword.length < 6) {
      error.value = 'Новый пароль должен содержать минимум 6 символов'
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      error.value = 'Новые пароли не совпадают'
      return
    }
  }
  error.value = ''
  confirmPassword.value = ''
  confirmError.value = ''
  showConfirmPassword.value = false
  showConfirmModal.value = true
  nextTick(() => { confirmPasswordInput.value?.focus() })
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmPassword.value = ''
  confirmError.value = ''
  showConfirmPassword.value = false
  document.body.style.overflow = ''
}

watch(showConfirmModal, (val) => {
  if (process.client) document.body.style.overflow = val ? 'hidden' : ''
})

// Закрытие по Escape
onMounted(() => {
  const onKeydown = (e) => { if (e.key === 'Escape' && showConfirmModal.value) closeConfirmModal() }
  window.addEventListener('keydown', onKeydown)
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
  loadUserData()
})

const submitWithPassword = async () => {
  if (!confirmPassword.value) {
    confirmError.value = 'Введите пароль для подтверждения'
    return
  }
  confirmError.value = ''
  saving.value = true

  try {
    const currentUser = authAPI.getCurrentUser()
    if (!currentUser) throw new Error('Пользователь не найден')

    const updateData = {}
    if (formData.username !== currentUser.username) updateData.username = formData.username
    if (formData.email !== currentUser.email) updateData.email = formData.email
    if (formData.bio !== (currentUser.bio || '')) updateData.bio = formData.bio

    // Текущий пароль всегда передаём для подтверждения
    updateData.currentPassword = confirmPassword.value

    if (formData.newPassword) {
      updateData.password = formData.newPassword
    }

    if (Object.keys(updateData).length > 1) { // > 1 потому что currentPassword всегда есть
      const updatedUser = await userAPI.update(currentUser.id, updateData)
      const token = authAPI.getToken()
      authAPI.saveAuthData(token, updatedUser)
      updateUser(updatedUser)
      closeConfirmModal()
      success.value = 'Профиль успешно обновлен!'
      formData.newPassword = ""
      formData.confirmPassword = ""
      setTimeout(() => { router.push('/profile') }, 1500)
    } else {
      closeConfirmModal()
      success.value = 'Нет изменений для сохранения.'
    }
  } catch (err) {
    console.error('Ошибка сохранения:', err)
    const msg = handleApiError(err, err.message || 'Не удалось сохранить изменения')
    // Если ошибка связана с паролем — показываем в модалке
    if (msg.toLowerCase().includes('пароль') || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('неверн')) {
      confirmError.value = 'Неверный пароль'
    } else {
      closeConfirmModal()
      error.value = msg
    }
  } finally {
    saving.value = false
  }
}

const loadUserData = async () => {
  loading.value = true
  error.value = ''
  try {
    if (!authAPI.isAuthenticated()) { router.push('/login'); return }
    const currentUser = authAPI.getCurrentUser()
    if (!currentUser) { router.push('/login'); return }

    const [userResult, linksResult] = await Promise.allSettled([
      userAPI.getById(currentUser.id),
      socialLinksAPI.getAll()
    ])

    if (userResult.status === 'fulfilled') {
      const user = userResult.value
      formData.username = user.username || ""
      formData.email = user.email || ""
      formData.bio = user.bio || ""
    }

    formData.newPassword = ""
    formData.confirmPassword = ""

    socialLinks.value = linksResult.status === 'fulfilled' ? (linksResult.value || []) : []
  } catch (err) {
    console.error('Ошибка загрузки данных:', err)
    error.value = handleApiError(err, 'Не удалось загрузить данные профиля')
  } finally {
    loading.value = false
  }
}

// Social links
const handleAddLink = async () => {
  if (!newLink.platform || !newLink.url) return
  addingLink.value = true
  socialError.value = ''
  try {
    const created = await socialLinksAPI.create({ platform: newLink.platform, url: newLink.url })
    socialLinks.value.push(created)
    newLink.platform = ''
    newLink.url = ''
  } catch (err) {
    socialError.value = handleApiError(err, 'Не удалось добавить ссылку')
  } finally {
    addingLink.value = false
  }
}

const startEditLink = (link) => {
  editingLinkId.value = link.id
  editLinkData.platform = link.platform
  editLinkData.url = link.url
}

const cancelEditLink = () => {
  editingLinkId.value = null
  editLinkData.platform = ''
  editLinkData.url = ''
}

const handleUpdateLink = async (id) => {
  savingLink.value = true
  socialError.value = ''
  try {
    const updated = await socialLinksAPI.update(id, { platform: editLinkData.platform, url: editLinkData.url })
    const idx = socialLinks.value.findIndex(l => l.id === id)
    if (idx !== -1) socialLinks.value[idx] = updated
    cancelEditLink()
  } catch (err) {
    socialError.value = handleApiError(err, 'Не удалось обновить ссылку')
  } finally {
    savingLink.value = false
  }
}

const handleDeleteLink = async (id) => {
  deletingLinkId.value = id
  socialError.value = ''
  try {
    await socialLinksAPI.delete(id)
    socialLinks.value = socialLinks.value.filter(l => l.id !== id)
  } catch (err) {
    socialError.value = handleApiError(err, 'Не удалось удалить ссылку')
  } finally {
    deletingLinkId.value = null
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-scale-leave-active {
  transition: all 0.15s ease;
}
.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(12px);
}
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(6px);
}
</style>