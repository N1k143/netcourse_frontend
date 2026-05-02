<!-- pages/courses.vue -->
<template>
  <main class="min-h-screen bg-slate-950 pt-32 pb-20 px-6">
    <div class="absolute inset-0 opacity-30 pointer-events-none">
      <NetworkBackground />
    </div>
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
    
    <div class="max-w-7xl mx-auto relative z-10">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg mb-6 font-mono group hover:border-emerald-500/50 transition-all duration-300">
          <div class="flex gap-1">
            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <span class="text-sm text-emerald-400">$ ./load_courses.sh</span>
        </div>
        
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          <span class="text-emerald-500 font-mono">root@courses:~#</span>
          <br/>
          <span class="font-sans bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
            Каталог курсов
          </span>
        </h1>
        
        <div class="bg-slate-900 border border-emerald-500/30 rounded-lg p-4 max-w-2xl mx-auto font-mono text-sm">
          <div v-if="loading" class="text-emerald-500">// Загрузка данных с сервера...</div>
          <div v-else-if="error" class="text-red-500">// Ошибка: {{ error }}</div>
          <template v-else>
            <div class="text-emerald-500 mb-2">// Available modules: {{ stats.total }}</div>
            <div class="text-slate-400">Выберите курс для загрузки в систему обучения</div>
          </template>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 justify-center mb-12">
        <button 
          @click="filter = 'all'"
          :class="[
            'group cursor-pointer px-5 py-2.5 rounded-lg font-bold transition-all duration-300 font-mono text-sm flex items-center gap-2',
            filter === 'all' 
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50' 
              : 'bg-slate-900 text-slate-300 border border-emerald-500/30 hover:border-emerald-500 hover:bg-slate-800/80'
          ]"
        >
          <span class="w-2 h-2 bg-current rounded-full animate-pulse"></span>
          $ ls -la courses/
        </button>
        <button 
          @click="filter = 'programming'"
          :class="[
            'group cursor-pointer px-5 py-2.5 rounded-lg font-bold transition-all duration-300 font-mono text-sm flex items-center gap-2',
            filter === 'programming' 
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50' 
              : 'bg-slate-900 text-slate-300 border border-emerald-500/30 hover:border-emerald-500 hover:bg-slate-800/80'
          ]"
        >
          <Code2 class="w-4 h-4" />
          programming ({{ stats.programming }})
        </button>
        <button 
          @click="filter = 'networking'"
          :class="[
            'group cursor-pointer px-5 py-2.5 rounded-lg font-bold transition-all duration-300 font-mono text-sm flex items-center gap-2',
            filter === 'networking' 
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50' 
              : 'bg-slate-900 text-slate-300 border border-emerald-500/30 hover:border-emerald-500 hover:bg-slate-800/80'
          ]"
        >
          <Network class="w-4 h-4" />
          networking ({{ stats.networking }})
        </button>
        <button 
          @click="filter = 'cybersecurity'"
          :class="[
            'group cursor-pointer px-5 py-2.5 rounded-lg font-bold transition-all duration-300 font-mono text-sm flex items-center gap-2',
            filter === 'cybersecurity' 
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50' 
              : 'bg-slate-900 text-slate-300 border border-emerald-500/30 hover:border-emerald-500 hover:bg-slate-800/80'
          ]"
        >
          <ShieldCheck class="w-4 h-4" />
          cybersecurity ({{ stats.cybersecurity }})
        </button>
      </div>

      <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div class="text-emerald-500 font-mono text-xl mt-4">$ loading_courses...</div>
        </div>
      </div>

      <div v-else-if="error && courses.length === 0" class="text-center py-20">
        <div class="text-red-500 font-mono text-lg mb-4">Ошибка загрузки</div>
        <div class="text-slate-300 font-mono mb-6">{{ error }}</div>
        <button 
          @click="loadCoursesWithEnrollment"
          class="px-6 py-3 bg-emerald-500 text-slate-950 rounded-lg font-bold hover:bg-emerald-400 transition-all font-mono"
        >
          $ ./retry.sh
        </button>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="course in filteredCourses"
            :key="course.id"
            class="group relative bg-slate-900 border border-emerald-500/20 rounded-xl p-5 hover:border-emerald-500 hover:bg-slate-900/90 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 flex flex-col"
          >
            <div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500/50 rounded-tr-xl group-hover:border-emerald-500 transition-all duration-300"></div>
            <div class="flex items-start justify-between mb-4">
              <component :is="getIconComponent(course.category)" :class="['w-8 h-8', getIconColor(course.category)]" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2 font-mono group-hover:text-emerald-400 transition-colors duration-300">
              {{ course.title }}
            </h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
              {{ course.description }}
            </p>

            <!-- Рейтинг курса -->
            <div v-if="course.averageRating !== null" class="flex items-center gap-1.5 mb-3">
              <div class="flex items-center gap-0.5">
                <template v-for="i in 5" :key="i">
                  <svg
                    class="w-3.5 h-3.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 1l1.85 3.75L14 5.5l-3 2.92.7 4.08L8 10.4l-3.7 2.1.7-4.08L2 5.5l4.15-.75L8 1z"
                      :fill="i <= Math.round(course.averageRating) ? '#f59e0b' : 'transparent'"
                      :stroke="i <= Math.round(course.averageRating) ? '#f59e0b' : '#64748b'"
                      stroke-width="1"
                    />
                  </svg>
                </template>
              </div>
              <span class="text-amber-400 font-mono text-xs font-bold">
                {{ course.averageRating.toFixed(1) }}
              </span>
              <span class="text-slate-500 font-mono text-xs">
                ({{ course.ratingsCount }})
              </span>
            </div>
            <div v-else class="mb-3">
              <span class="text-slate-600 font-mono text-xs">// нет оценок</span>
            </div>

            <div v-if="course.isEnrolled" class="mb-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div :class="[
                    'w-2 h-2 rounded-full',
                    course.progress === 'completed' ? 'bg-green-500 animate-pulse' :
                    course.progress === 'in_progress' ? 'bg-emerald-500 animate-pulse' :
                    'bg-slate-600'
                  ]"></div>
                  <span :class="[
                    'text-xs font-mono font-bold',
                    course.progress === 'completed' ? 'text-green-500' :
                    course.progress === 'in_progress' ? 'text-emerald-400' :
                    'text-slate-400'
                  ]">
                    {{ course.progress === 'completed' ? 'COMPLETED' : course.progress === 'in_progress' ? 'IN PROGRESS' : 'NOT STARTED' }}
                  </span>
                </div>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                <div 
                  :class="[
                    'h-1 rounded-full transition-all duration-1000 ease-out group-hover:animate-pulse',
                    course.progress === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    course.progress === 'in_progress' ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500' :
                    'bg-gradient-to-r from-slate-600 to-slate-500'
                  ]"
                  :style="{ width: `${mapProgressValue(course.progress)}%` }"
                ></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
                <span>NOT STARTED</span>
                <span>IN PROGRESS</span>
                <span>COMPLETED</span>
              </div>
            </div>

            <div class="flex items-center justify-between mb-4 text-xs text-slate-500 font-mono">
              <div :class="[
                'px-2 py-1 rounded border',
                course.category === 'programming' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                course.category === 'networking' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                course.category === 'cybersecurity' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                'bg-purple-500/10 text-purple-400 border-purple-500/30'
              ]">
                {{ getCategoryName(course.category) }}
              </div>
            </div>

            <button
              @click="handleCourseAction(course)"
              :disabled="loading || enrollingCourseId === course.id"
              :class="[
                'w-full px-4 py-2.5 rounded-lg font-bold transition-all duration-300 hover:shadow-lg font-mono text-sm group/btn relative overflow-hidden',
                course.isEnrolled
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 hover:from-emerald-500 hover:to-emerald-400 hover:shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/30'
              ]"
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <template v-if="enrollingCourseId === course.id">
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Загрузка...
                </template>
                <template v-else-if="course.isEnrolled">
                  <template v-if="course.progress === 'completed'">
                    <span class="w-2 h-2 bg-slate-950 rounded-full"></span>
                    {'> '}review_course.sh
                  </template>
                  <template v-else-if="course.progress === 'in_progress'">
                    <span class="w-2 h-2 bg-slate-950 rounded-full animate-pulse"></span>
                    {'> '}continue.sh
                  </template>
                  <template v-else>
                    <span class="w-2 h-2 bg-slate-950 rounded-full"></span>
                    {'> '}start.sh
                  </template>
                </template>
                <template v-else>
                  <span class="w-2 h-2 bg-white rounded-full"></span>
                  {'> '}enroll.sh
                </template>
              </span>
              <div :class="[
                'absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300',
                course.isEnrolled
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-300'
                  : 'bg-gradient-to-r from-blue-500 to-blue-300'
              ]"></div>
            </button>
          </div>
        </div>

        <div v-if="filteredCourses.length === 0" class="text-center py-20">
          <div class="text-slate-400 font-mono text-lg mb-4">// No courses found</div>
        </div>

        <div class="mt-16 text-center">
          <div class="inline-grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 bg-slate-900 border border-emerald-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 font-mono text-xs sm:text-sm w-full max-w-4xl">
            <div class="p-2 sm:p-0">
              <div class="text-xl sm:text-2xl font-bold text-emerald-500">{{ stats.total }}</div>
              <div class="text-slate-400 text-[10px] sm:text-sm">TOTAL</div>
            </div>
            <div class="p-2 sm:p-0">
              <div class="text-xl sm:text-2xl font-bold text-green-500">{{ stats.completed }}</div>
              <div class="text-slate-400 text-[10px] sm:text-sm">PASSED</div>
            </div>
            <div class="p-2 sm:p-0">
              <div class="text-xl sm:text-2xl font-bold text-cyan-500">{{ stats.inProgress }}</div>
              <div class="text-slate-400 text-[10px] sm:text-sm">IN PROGRESS</div>
            </div>
            <div class="p-2 sm:p-0">
              <div class="text-xl sm:text-2xl font-bold text-blue-500">{{ stats.enrolled }}</div>
              <div class="text-slate-400 text-[10px] sm:text-sm">ENROLLED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer :toasts="toasts" @remove="removeToast" />
  </main>
</template>

<script setup>
import { Network, ShieldCheck, Code2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { toasts, success, error: showError, removeToast } = useToast()
const { coursesAPI, enrollmentsAPI, userAPI, progressAPI, handleApiError } = useApi()
const { user, isAuthenticated, initialize } = useAuth()

const courses = ref([])
const enrolledCourseIds = ref([])
const loading = ref(true)
const error = ref('')
const filter = ref('all')
const enrollingCourseId = ref(null)

const filteredCourses = computed(() => {
  if (filter.value === 'all') return courses.value
  return courses.value.filter(c => c.category === filter.value)
})

const stats = computed(() => ({
  total: courses.value.length,
  enrolled: courses.value.filter(c => c.isEnrolled).length,
  inProgress: courses.value.filter(c => c.progress === 'in_progress').length,
  completed: courses.value.filter(c => c.progress === 'completed').length,
  programming: courses.value.filter(c => c.category === 'programming').length,
  networking: courses.value.filter(c => c.category === 'networking').length,
  cybersecurity: courses.value.filter(c => c.category === 'cybersecurity').length
}))

const getIconComponent = (category) => {
  const icons = {
    programming: Code2,
    networking: Network,
    cybersecurity: ShieldCheck,
    other: Code2
  }
  return icons[category] || icons.other
}

const getIconColor = (category) => {
  const colors = {
    programming: 'text-emerald-500',
    networking: 'text-cyan-500',
    cybersecurity: 'text-red-500',
    other: 'text-slate-500'
  }
  return colors[category] || colors.other
}

const getCategoryName = (category) => {
  const names = {
    programming: 'programming',
    networking: 'networking',
    cybersecurity: 'cybersecurity',
    other: 'Другое'
  }
  return names[category] || names.other
}

const mapProgressValue = (progress) => {
  if (progress === 'completed') return 100
  if (progress === 'in_progress') return 50
  return 0
}

const loadCoursesWithEnrollment = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const allCourses = await coursesAPI.getAll()
    let userEnrolledIds = []
    let coursesWithProgress = []

    if (isAuthenticated.value && user.value) {
      try {
        const userData = await userAPI.getById(user.value.id)
        userEnrolledIds = userData.enrollments?.map(e => e.courseId) || []
        enrolledCourseIds.value = userEnrolledIds

        const coursesWithProgressPromises = allCourses.map(async (course) => {
          const isEnrolled = userEnrolledIds.includes(course.id)
          if (isEnrolled) {
            try {
              const progressData = await progressAPI.getByCourse(course.id)
              return {
                ...course,
                isEnrolled: true,
                progress: progressData.status,
                progressPercentage: progressData.status === 'completed' ? 100 : 
                                   progressData.status === 'in_progress' ? 50 : 0
              }
            } catch (err) {
              return { ...course, isEnrolled: true, progress: 'not_started', progressPercentage: 0 }
            }
          } else {
            return { ...course, isEnrolled: false, progress: 'not_started', progressPercentage: 0 }
          }
        })
        coursesWithProgress = await Promise.all(coursesWithProgressPromises)
      } catch (err) {
        console.error('Ошибка загрузки данных пользователя:', err)
        coursesWithProgress = allCourses.map(course => ({ ...course, isEnrolled: false, progress: 'not_started', progressPercentage: 0 }))
      }
    } else {
      coursesWithProgress = allCourses.map(course => ({ ...course, isEnrolled: false, progress: 'not_started', progressPercentage: 0 }))
    }

    courses.value = coursesWithProgress.map(course => ({
      id: course.id || course._id,
      title: course.title || 'Без названия',
      description: course.description || 'Описание отсутствует',
      progress: course.progress,
      progressPercentage: course.progressPercentage,
      isEnrolled: course.isEnrolled,
      category: course.category || 'other',
      averageRating: course.averageRating ?? null,
      ratingsCount: course.ratingsCount ?? 0,
    }))
  } catch (err) {
    console.error('Error loading courses:', err)
    error.value = handleApiError(err, 'Не удалось загрузить курсы. Попробуйте позже.')
  } finally {
    loading.value = false
  }
}

const handleEnroll = async (courseId) => {
  if (!isAuthenticated.value || !user.value) {
    showError('Пожалуйста, войдите в систему, чтобы записаться на курс.')
    return
  }
  enrollingCourseId.value = courseId
  try {
    await enrollmentsAPI.enroll(courseId, user.value.id)
    success('Вы успешно записаны на курс!')
    await loadCoursesWithEnrollment()
  } catch (err) {
    showError(handleApiError(err, 'Не удалось записаться на курс.'))
  } finally {
    enrollingCourseId.value = null
  }
}

const handleCourseAction = async (course) => {
  if (!course.isEnrolled) {
    await handleEnroll(course.id)
  } else {
    if (course.progress === 'not_started') {
      try {
        await progressAPI.update(course.id, { status: 'in_progress', completedLessons: [] })
        await loadCoursesWithEnrollment()
      } catch (err) {
        console.error('Ошибка обновления прогресса:', err)
      }
    }
    router.push(`/courses/${course.id}`)
  }
}

onMounted(() => {
  initialize()
  loadCoursesWithEnrollment()

  const queryCategory = route.query.category
  if (queryCategory && ['programming', 'networking', 'cybersecurity'].includes(queryCategory)) {
    filter.value = queryCategory
  }
})
</script>