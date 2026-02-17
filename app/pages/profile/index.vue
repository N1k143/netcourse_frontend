<template>
  <main class="min-h-screen bg-slate-950 pt-32 pb-20 px-6 relative overflow-hidden">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div class="text-emerald-500 font-mono text-xl mt-4">$ loading_profile...</div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error && !userData" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="text-red-500 font-mono text-xl mb-4">$ error: {{ error }}</div>
        <button 
          @click="loadProfileData"
          class="px-6 py-3 bg-emerald-500 text-slate-950 rounded-lg font-mono font-bold hover:bg-emerald-400 transition-all"
        >
          $ retry.sh
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div v-else>
      <div class="absolute inset-0 opacity-30 pointer-events-none">
        <NetworkBackground />
      </div>
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="text-center mb-8 md:mb-12">            
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            <span class="text-emerald-500 font-mono text-xl sm:text-3xl lg:text-4xl">$ whoami</span>
            <br/>
            <span class="font-sans bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Профиль пользователя
            </span>
          </h1>
          
          <div v-if="error" class="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg max-w-md mx-auto">
            <div class="text-yellow-400 font-mono text-xs sm:text-sm break-words">
              <span class="text-yellow-500">⚠</span> {{ error }}
            </div>
          </div>

          <button 
            @click="loadProfileData"
            class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-mono text-sm hover:bg-slate-700 transition-all border border-slate-600 mb-4"
          >
            $ refresh.sh
          </button>
        </div>

        <div class="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-6 lg:sticky lg:top-32">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-slate-500 font-mono text-sm">user_info</span>
              </div>

              <div class="text-center mb-6">
                <div class="relative group mx-auto mb-4 w-16 h-16 sm:w-20 sm:h-20">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      v-if="userData?.avatarUrl"
                      :src="userData.avatarUrl" 
                      alt="Аватар"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-xl sm:text-2xl text-emerald-500 font-mono">
                      {{ userData?.username?.charAt(0).toUpperCase() || 'U' }}
                    </span>
                  </div>
                  
                  <button
                    @click="$refs.fileInput?.click()"
                    :disabled="avatarLoading"
                    class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <div v-if="avatarLoading" class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <svg v-else class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </button>
                  
                  <input
                    ref="fileInput"
                    type="file"
                    @change="handleAvatarChange"
                    accept="image/*"
                    class="hidden"
                  />
                </div>

                <h2 class="text-lg sm:text-xl font-bold text-white font-mono break-words">{{ userData?.username }}</h2>
                <p class="text-slate-400 text-xs sm:text-sm mt-1 break-all">{{ userData?.email }}</p>
              </div>

              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400 font-mono text-sm">Уровень:</span>
                  <span class="text-emerald-500 font-mono text-sm">{{ userData?.level }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400 font-mono text-sm">В системе:</span>
                  <span class="text-slate-300 font-mono text-sm">{{ userData?.joinDate }}</span>
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-emerald-500/20">
                <div class="flex justify-between text-slate-400 font-mono text-xs mb-2">
                  <span>Общий прогресс</span>
                  <span>{{ userData?.progress || 0 }}%</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-2 mb-2">
                  <div 
                    class="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                    :style="{ width: `${userData?.progress || 0}%` }"
                  ></div>
                </div>
              </div>

              <div class="mt-6 space-y-3">
                <NuxtLink to="/profile/edit">
                  <button class="w-full px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-mono hover:bg-slate-700 transition-all border border-slate-600 hover:border-emerald-500/50 text-sm">
                    $ edit_profile.sh
                  </button>
                </NuxtLink>
                
                <button 
                  @click="handleLogout"
                  class="w-full mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-mono hover:bg-red-500/30 transition-all border border-red-500/30 text-sm"
                >
                  $ logout.sh
                </button>
              </div>
            </div>
          </div>

          <!-- Main content -->
          <div class="lg:col-span-2">
            <div class="space-y-6 lg:space-y-8">
              <!-- Active Courses -->
              <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-6">
                <div class="flex items-center gap-2 mb-6">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-slate-500 font-mono text-sm">active_courses</span>
                </div>

                <h3 class="text-lg sm:text-xl font-bold text-white mb-4 font-mono">
                  Активные курсы ({{ currentCourses.length }})
                </h3>
                
                <div v-if="currentCourses.length > 0" class="space-y-4">
                  <div v-for="course in currentCourses" :key="course.id" class="bg-slate-800 border border-slate-600 rounded-lg p-3 sm:p-4">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <h4 class="text-white font-medium text-sm sm:text-base break-words">{{ course.title }}</h4>
                      <span class="text-slate-400 text-xs sm:text-sm whitespace-nowrap">
                        Прогресс: {{ course.progress || 0 }}%
                      </span>
                    </div>
                    <div class="w-full bg-slate-700 rounded-full h-2 mb-3">
                      <div 
                        class="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                        :style="{ width: `${course.progress || 0}%` }"
                      ></div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2">
                      <NuxtLink 
                        :to="`/courses/${course.id}`"
                        class="flex-1 px-3 sm:px-4 py-2 bg-emerald-500 text-slate-950 rounded-lg font-mono font-bold text-xs sm:text-sm hover:bg-emerald-400 transition-all text-center flex items-center justify-center gap-2"
                      >
                        <span v-if="course.status === 'completed'" class="w-2 h-2 bg-slate-950 rounded-full"></span>
                        <span v-else-if="course.status === 'in_progress'" class="w-2 h-2 bg-slate-950 rounded-full animate-pulse"></span>
                        <span v-else class="w-2 h-2 bg-slate-950 rounded-full"></span>
                        {{ course.status === 'completed' ? '> review_course.sh' : course.status === 'in_progress' ? '> continue.sh' : '> start.sh' }}
                      </NuxtLink>
                      <button
                        @click="handleUnenroll(course.id)"
                        :disabled="unenrollingCourseId === course.id"
                        class="px-3 sm:px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-mono text-xs sm:text-sm hover:bg-red-500/30 transition-all border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <div v-if="unenrollingCourseId === course.id" class="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        <span v-else>$ unenroll.sh</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-center py-8">
                  <div class="text-slate-400 font-mono mb-4 text-sm sm:text-base">Нет активных курсов</div>
                  <NuxtLink 
                    to="/courses"
                    class="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-slate-950 rounded-lg font-mono font-bold text-sm sm:text-base hover:bg-emerald-400 transition-all"
                  >
                    $ browse_courses.sh
                  </NuxtLink>
                </div>
              </div>

              <!-- Completed Courses -->
              <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-6">
                <div class="flex items-center gap-2 mb-6">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-slate-500 font-mono text-sm">completed_courses</span>
                </div>

                <h3 class="text-lg sm:text-xl font-bold text-white mb-4 font-mono">
                  Завершенные курсы ({{ completedCourses.length }})
                </h3>
                
                <div v-if="completedCourses.length > 0" class="space-y-3">
                  <div v-for="course in completedCourses" :key="course.id" class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3 sm:p-4">
                    <div>
                      <h4 class="text-white font-medium text-sm sm:text-base break-words">{{ course.title }}</h4>
                    </div>
                    <div class="text-left sm:text-right">
                      <div class="text-emerald-500 font-mono text-base sm:text-lg">
                        {{ course.progress || 100 }}%
                      </div>
                      <div class="text-slate-400 text-xs">Результат</div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-center py-8">
                  <div class="text-slate-400 font-mono text-sm sm:text-base">Пока нет завершенных курсов</div>
                </div>
              </div>
            </div>
          </div>
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
const { logout, updateUser } = useAuth()
const { userAPI, coursesAPI, progressAPI, enrollmentsAPI, handleApiError, authAPI } = useApi()

const loading = ref(true)
const error = ref('')
const avatarLoading = ref(false)
const unenrollingCourseId = ref(null)
const userData = ref(null)
const userCourses = ref([])

const currentCourses = computed(() => userCourses.value.filter(c => c.progress < 100))
const completedCourses = computed(() => userCourses.value.filter(c => c.progress >= 100))

const calculateLevel = (progress) => {
  if (progress >= 80) return "Продвинутый"
  if (progress >= 50) return "Средний"
  return "Начинающий"
}

const formatJoinDate = (dateString) => {
  if (!dateString) return new Date().toLocaleDateString('ru-RU')
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const loadProfileData = async () => {
  if (!authAPI.isAuthenticated()) {
    router.push('/login')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const currentUser = authAPI.getCurrentUser()
    if (!currentUser) throw new Error('Пользователь не найден')

    // Загружаем актуальные данные пользователя
    const user = await userAPI.getById(currentUser.id)

    // Обновляем данные в localStorage
    authAPI.saveAuthData(localStorage.getItem('authToken'), user)

    // Загружаем все курсы
    const allCourses = await coursesAPI.getAll()

    // Загружаем прогресс для каждого курса
    const coursesWithProgressPromises = allCourses.map(async (course) => {
      try {
        const progressData = await progressAPI.getByCourse(course.id)

        let progressPercentage = 0
        if (progressData.status === 'completed') {
          progressPercentage = 100
        } else if (progressData.status === 'in_progress') {
          progressPercentage = 50
        } else {
          progressPercentage = 0
        }
        
        return { 
          ...course, 
          progress: progressPercentage,
          status: progressData.status 
        }
      } catch (err) {
        return { 
          ...course, 
          progress: 0,
          status: 'not_started' 
        }
      }
    })
    
    const coursesWithProgress = await Promise.all(coursesWithProgressPromises)

    // Фильтруем только курсы, на которые записан пользователь
    const enrolledCourseIds = user.enrollments?.map(e => e.courseId) || []
    const userEnrolledCourses = coursesWithProgress.filter(course =>
      enrolledCourseIds.includes(course.id)
    )

    // Вычисляем статистику
    const completedCoursesCount = userEnrolledCourses.filter(course => course.progress >= 100).length
    const activeCoursesCount = userEnrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length
    
    const totalProgress = userEnrolledCourses.length > 0 
      ? Math.round(userEnrolledCourses.reduce((sum, course) => sum + course.progress, 0) / userEnrolledCourses.length)
      : 0

    userData.value = {
      username: user.username || 'Пользователь',
      email: user.email,
      joinDate: formatJoinDate(user.createdAt),
      level: calculateLevel(totalProgress),
      progress: totalProgress,
      completedCourses: completedCoursesCount,
      activeCourses: activeCoursesCount,
      avatarUrl: user.avatarUrl, 
      id: user.id 
    }

    userCourses.value = userEnrolledCourses

  } catch (err) {
    console.error('Ошибка загрузки профиля:', err)
    const errorMsg = handleApiError(err, 'Не удалось загрузить данные профиля')
    error.value = errorMsg

    // Fallback данные
    const currentUser = authAPI.getCurrentUser()
    if (currentUser) {
      userData.value = {
        username: currentUser.username || 'Пользователь',
        email: currentUser.email,
        joinDate: new Date().toLocaleDateString('ru-RU'),
        level: 'Начинающий',
        progress: 0,
        completedCourses: 0,
        activeCourses: 0,
        avatarUrl: currentUser.avatarUrl, 
        id: currentUser.id 
      }
      userCourses.value = []
    }
  } finally {
    loading.value = false
  }
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    error.value = 'Пожалуйста, выберите изображение'
    return
  }

  avatarLoading.value = true
  error.value = ''

  try {
    const reader = new FileReader()
    
    reader.onloadend = async () => {
      const avatarUrl = reader.result
      
      const currentUser = authAPI.getCurrentUser()
      if (!currentUser) throw new Error('Пользователь не найден')

      // Обновляем аватар на сервере
      await userAPI.update(currentUser.id, { avatarUrl })

      // Обновляем локальные данные
      const updatedUser = { ...currentUser, avatarUrl }
      authAPI.saveAuthData(localStorage.getItem('authToken'), updatedUser)
      
      // Обновляем composable useAuth
      updateUser({ avatarUrl })

      userData.value.avatarUrl = avatarUrl
      avatarLoading.value = false
    }
    
    reader.readAsDataURL(file)
    
  } catch (err) {
    console.error('Ошибка загрузки или обновления аватара:', err)
    error.value = handleApiError(err, 'Не удалось обновить аватар')
    avatarLoading.value = false
  }
}

const handleUnenroll = async (courseId) => {
  unenrollingCourseId.value = courseId
  error.value = ''

  try {
    const currentUser = authAPI.getCurrentUser()
    if (!currentUser) throw new Error('Пользователь не найден')

    const enrollment = currentUser.enrollments?.find(e => e.courseId === courseId)
    if (!enrollment) throw new Error('Запись на курс не найдена')

    await enrollmentsAPI.unenroll(courseId, enrollment.id)

    // Перезагружаем данные профиля
    await loadProfileData()
    
  } catch (err) {
    console.error('Ошибка отписки от курса:', err)
    error.value = handleApiError(err, 'Не удалось отписаться от курса')
  } finally {
    unenrollingCourseId.value = null
  }
}

const handleLogout = async () => {
  await logout()
}

// Загружаем данные при монтировании
onMounted(() => {
  loadProfileData()
})
</script>