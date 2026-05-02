<template>
  <main class="min-h-screen bg-slate-950 pt-32 pb-20 px-4 lg:px-6 relative overflow-x-hidden">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <NetworkBackground />
    </div>
    <div class="absolute inset-0 pointer-events-none overflow-hidden bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

    <CourseCompletionModal
      :show="showCompletionModal"
      :courseTitle="course?.title || ''"
      :certification="courseCertification"
      :medal="courseMedal"
      @close="showCompletionModal = false"
      @equip="handleEquipMedal"
    />

    <div class="max-w-7xl mx-auto relative z-10 w-full overflow-x-hidden">
      <div v-if="loading" class="flex items-center justify-center min-h-[50vh]">
        <div class="text-center">
          <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div class="text-emerald-500 font-mono text-lg mt-4">$ loading_course...</div>
        </div>
      </div>

      <template v-else>
        <div class="mb-8">
          <div class="flex items-center gap-2 text-sm text-slate-400 font-mono mb-4">
            <NuxtLink to="/courses" class="hover:text-emerald-400 transition-colors">
              $ cd /courses
            </NuxtLink>
            <span>/</span>
            <span class="text-emerald-400">{{ course?.title || 'Курс' }}</span>
          </div>

          <div class="flex flex-wrap justify-between items-start gap-4">
            <div class="flex-1">
              <h1 class="text-3xl lg:text-5xl font-bold text-white mb-2 break-words">
                <span class="text-emerald-500 font-mono">$ less </span>
                <span class="font-sans bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  {{ course?.title }}
                </span>
              </h1>
              <p class="text-slate-400 font-mono text-sm max-w-3xl break-words">{{ course?.description }}</p>
            </div>

            <div class="flex items-center gap-3">
              <div v-if="courseProgress" class="flex items-center gap-3 flex-wrap">
                <span :class="[
                  'px-2 py-1 rounded text-xs font-mono border',
                  courseProgress.status === 'completed'
                    ? 'bg-green-500/20 text-green-500 border-green-500/30'
                    : courseProgress.status === 'in_progress'
                    ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                    : 'bg-slate-500/20 text-slate-500 border-slate-500/30'
                ]">
                  {{ courseProgress.status === 'completed' ? 'КУРС ЗАВЕРШЕН' :
                     courseProgress.status === 'in_progress' ? 'В ПРОЦЕССЕ' : 'НЕ НАЧАТ' }}
                </span>

                <button
                  v-if="courseProgress.status === 'completed'"
                  @click="showCompletionModal = true"
                  class="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400 hover:text-yellow-300 rounded-lg font-mono text-xs transition-all"
                >
                  <Icon name="mdi:certificate-outline" class="w-3.5 h-3.5" />
                  <span>Мой сертификат</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          <div class="lg:col-span-1 sticky top-24 self-start">
            <CourseNavigation
              v-if="sections.length > 0"
              :course="course"
              :sections="sections"
              :lessonsBySection="lessonsBySection"
              :currentLessonId="currentLesson?.id"
              :courseProgress="courseProgress || { status: 'not_started' }"
              @lesson-select="handleLessonSelect"
            />
          </div>

          <div class="lg:col-span-3 w-full overflow-x-hidden">
            <QuizComponent
              v-if="showQuizView && currentLesson"
              :courseId="courseId"
              :sectionId="currentSectionId"
              :lessonId="currentLesson.id"
              @complete="handleQuizComplete"
              @close="handleCloseQuiz"
            />

            <LessonViewer
              v-else-if="currentLesson"
              :courseId="courseId"
              :currentSectionId="currentSectionId"
              :currentLesson="currentLesson"
              :lessonCompleted="isLessonCompleted(currentLesson.id)"
              :courseCompleted="isCourseCompleted"
              @navigate="handleNavigate"
              @open-test="handleOpenTest"
              @mark-complete="handleAutoMarkComplete"
              @complete-course="handleManualComplete"
            />

            <div v-else class="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center">
              <div class="text-slate-400 font-mono text-lg mb-4">
                // Контент не найден
              </div>
              <div class="text-slate-500 font-mono text-sm">
                Выберите урок из списка слева
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Toast Container -->
    <ToastContainer :toasts="toasts" @remove="removeToast" />
  </main>
</template>

<script setup>
import { useToast } from '~/composables/useToast'  // путь может отличаться, обычно ~/composables/useToast

const route = useRoute()
const router = useRouter()
const { coursesAPI, sectionsAPI, lessonsAPI, progressAPI, certificationsAPI, authAPI, badgesAPI } = useApi()
const { toasts, success, error: showError, removeToast } = useToast()

const courseId = computed(() => route.params.id)

const course = ref(null)
const sections = ref([])
const lessonsBySection = ref({})
const currentSectionId = ref(null)
const currentLesson = ref(null)
const courseProgress = ref(null)
const courseCertification = ref(null)
const courseMedal = ref(null)
const loading = ref(true)
const error = ref('')
const showQuizView = ref(false)
const showCompletionModal = ref(false)

const isCourseCompleted = computed(() => courseProgress.value?.status === 'completed')
const allLessonsList = computed(() => {
  const lessons = []
  for (const section of sections.value) {
    const sectionLessons = lessonsBySection.value[section.id] || []
    lessons.push(...sectionLessons.map(l => ({ ...l, sectionId: section.id })))
  }
  return lessons
})
const currentLessonIndex = computed(() => {
  if (!currentLesson.value) return -1
  return allLessonsList.value.findIndex(l => l.id === currentLesson.value.id)
})

const isLessonCompleted = (lessonId) => {
  if (!lessonId || !courseProgress.value?.completedLessons) return false
  return courseProgress.value.completedLessons.includes(lessonId)
}

const loadCourseCertification = async () => {
  try {
    const certs = await certificationsAPI.getMyCertifications()
    courseCertification.value = (certs || []).find(c => String(c.courseId) === String(courseId.value)) || null
  } catch {
    courseCertification.value = null
  }
}

const loadCourseData = async () => {
  if (!courseId.value) {
    router.push('/courses')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const courseData = await coursesAPI.getById(courseId.value)
    course.value = {
      id: courseData.id || courseData._id,
      title: courseData.title || 'Без названия',
      description: courseData.description || 'Описание отсутствует'
    }

    const currentUser = authAPI.getCurrentUser()
    if (currentUser) {
      try {
        const progressData = await progressAPI.getByCourse(courseId.value)
        courseProgress.value = progressData
      } catch (err) {
        console.log('Прогресс курса не найден')
        courseProgress.value = { status: 'not_started', completedLessons: [] }
      }

      if (isCourseCompleted.value) {
        await loadCourseCertification()
        try {
          courseMedal.value = await badgesAPI.getBadgeForCourse(courseId.value)
        } catch {
          courseMedal.value = null
        }
      }
    } else {
      courseProgress.value = { status: 'not_started', completedLessons: [] }
    }

    const sectionsData = await sectionsAPI.getByCourse(courseId.value)
    sections.value = sectionsData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))

    const lessonsMap = {}
    for (const section of sections.value) {
      try {
        const lessons = await lessonsAPI.getBySection(courseId.value, section.id)
        lessonsMap[section.id] = lessons.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
      } catch (err) {
        console.error(`Error loading lessons for section ${section.id}:`, err)
        lessonsMap[section.id] = []
      }
    }
    lessonsBySection.value = lessonsMap

    if (sections.value.length > 0) {
      const firstSection = sections.value[0]
      const firstSectionLessons = lessonsMap[firstSection.id]
      if (firstSectionLessons && firstSectionLessons.length > 0) {
        currentSectionId.value = firstSection.id
        currentLesson.value = firstSectionLessons[0]
      }
    }
  } catch (err) {
    console.error('Error loading course:', err)
    error.value = 'Не удалось загрузить данные курса'
  } finally {
    loading.value = false
  }
}

const handleLessonSelect = async (sectionId, lessonId) => {
  const lesson = lessonsBySection.value[sectionId]?.find(l => l.id === lessonId)
  if (!lesson) return
  currentSectionId.value = sectionId
  currentLesson.value = lesson
  showQuizView.value = false
  if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleAutoMarkComplete = async () => {
  if (!currentLesson.value) return
  try {
    const completedSet = new Set(courseProgress.value?.completedLessons || [])
    if (!completedSet.has(currentLesson.value.id)) {
      completedSet.add(currentLesson.value.id)
      const updated = await progressAPI.update(courseId.value, { completedLessons: Array.from(completedSet) })
      courseProgress.value = { ...courseProgress.value, ...updated }
    }
  } catch {
    // молча игнорируем
  }
}

const getNextLesson = () => {
  if (!currentLesson.value) return null
  const idx = currentLessonIndex.value
  if (idx >= 0 && idx < allLessonsList.value.length - 1) {
    const next = allLessonsList.value[idx + 1]
    return { lesson: next, sectionId: next.sectionId }
  }
  return null
}

const getPrevLesson = () => {
  if (!currentLesson.value) return null
  const idx = currentLessonIndex.value
  if (idx > 0) {
    const prev = allLessonsList.value[idx - 1]
    return { lesson: prev, sectionId: prev.sectionId }
  }
  return null
}

const handleEquipMedal = (medal) => {
  if (!medal) return
  const EQUIP_KEY = 'equippedBadge'
  const current = JSON.parse(localStorage.getItem(EQUIP_KEY) || 'null')
  if (current?.id === medal.id) localStorage.removeItem(EQUIP_KEY)
  else localStorage.setItem(EQUIP_KEY, JSON.stringify(medal))
  window.dispatchEvent(new Event('badge-equipped'))
}

const completeCourse = async () => {
  error.value = ''
  try {
    const updated = await progressAPI.update(courseId.value, { status: 'completed' })
    courseProgress.value = { ...courseProgress.value, ...updated, status: 'completed' }
    await loadCourseCertification()
    try {
      courseMedal.value = await badgesAPI.getBadgeForCourse(courseId.value)
    } catch {
      courseMedal.value = null
    }
    showCompletionModal.value = true
    success('Курс успешно завершён! 🎉')
    return true
  } catch (err) {
    console.error('Error completing course:', err)
    const data = err?.data
    if (data?.missingQuizIds?.length) {
      showError(`Сначала пройдите все тесты (мин. балл ${data.minScore}%). Не пройдены: тесты #${data.missingQuizIds.join(', #')}`)
    } else {
      showError(err?.message || 'Не удалось завершить курс')
    }
    return false
  }
}

const handleManualComplete = () => {
  completeCourse()
}

const handleQuizComplete = async () => {
  showQuizView.value = false
  try {
    const completedSet = new Set(courseProgress.value?.completedLessons || [])
    if (currentLesson.value && !completedSet.has(currentLesson.value.id)) {
      completedSet.add(currentLesson.value.id)
      const updated = await progressAPI.update(courseId.value, { completedLessons: Array.from(completedSet) })
      courseProgress.value = { ...courseProgress.value, ...updated }
    }
  } catch (err) {
    showError('Не удалось обновить прогресс')
  }

  const next = getNextLesson()
  if (next) {
    await handleLessonSelect(next.sectionId, next.lesson.id)
  } else {
    success('Поздравляем! Все уроки пройдены. Нажмите «Завершить курс» для получения наград.')
  }
}

const handleNavigate = (direction) => {
  if (direction === 'next') {
    const next = getNextLesson()
    if (next) handleLessonSelect(next.sectionId, next.lesson.id)
  } else if (direction === 'prev') {
    const prev = getPrevLesson()
    if (prev) handleLessonSelect(prev.sectionId, prev.lesson.id)
  }
}

const handleOpenTest = () => {
  showQuizView.value = true
  if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleCloseQuiz = () => {
  showQuizView.value = false
}

onMounted(() => {
  loadCourseData()
})
</script>