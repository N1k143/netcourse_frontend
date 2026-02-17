<template>
  <main class="min-h-screen bg-slate-950 pt-32 pb-20 px-4 lg:px-6 relative overflow-x-hidden">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <NetworkBackground />
    </div>
    <div class="absolute inset-0 pointer-events-none overflow-hidden bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

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

          <h1 class="text-3xl lg:text-5xl font-bold text-white mb-2 break-words">
            <span class="text-emerald-500 font-mono">$ less </span>
            <span class="font-sans bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              {{ course?.title }}
            </span>
          </h1>
          <p class="text-slate-400 font-mono text-sm max-w-3xl break-words">{{ course?.description }}</p>

          <div v-if="courseProgress" class="mt-4 flex items-center gap-2">
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
          </div>
        </div>

        <div v-if="error" class="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div class="text-yellow-400 font-mono text-sm">{{ error }}</div>
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
              @complete="handleMarkComplete"
              @close="handleCloseQuiz"
            />

            <LessonViewer
              v-else-if="currentLesson"
              :courseId="courseId"
              :currentSectionId="currentSectionId"
              :currentLesson="currentLesson"
              @mark-complete="handleMarkComplete"
              @navigate="handleNavigate"
              @open-test="handleOpenTest"
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
  </main>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { coursesAPI, sectionsAPI, lessonsAPI, progressAPI, authAPI } = useApi()

const courseId = computed(() => route.params.id)

const course = ref(null)
const sections = ref([])
const lessonsBySection = ref({})
const currentSectionId = ref(null)
const currentLesson = ref(null)
const courseProgress = ref(null)
const loading = ref(true)
const error = ref('')
const showQuizView = ref(false)

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

    // Загружаем прогресс пользователя
    const currentUser = authAPI.getCurrentUser()
    if (currentUser) {
      try {
        const progressData = await progressAPI.getByCourse(courseId.value)
        courseProgress.value = progressData
      } catch (err) {
        console.log('Прогресс курса не найден, создадим новый')
        courseProgress.value = null
      }
    }

    // Загружаем разделы курса
    const sectionsData = await sectionsAPI.getByCourse(courseId.value)
    sections.value = sectionsData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))

    // Загружаем уроки для каждого раздела
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

    // Устанавливаем первый урок как текущий
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
  
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getNextLesson = () => {
  if (!currentLesson.value || !currentSectionId.value) return null
  
  const currentLessons = lessonsBySection.value[currentSectionId.value] || []
  const currentIndex = currentLessons.findIndex(l => l.id === currentLesson.value.id)
  
  if (currentIndex < currentLessons.length - 1) {
    return {
      lesson: currentLessons[currentIndex + 1],
      sectionId: currentSectionId.value
    }
  }

  const sectionIndex = sections.value.findIndex(s => s.id === currentSectionId.value)
  for (let i = sectionIndex + 1; i < sections.value.length; i++) {
    const nextLessons = lessonsBySection.value[sections.value[i].id] || []
    if (nextLessons.length) {
      return {
        lesson: nextLessons[0],
        sectionId: sections.value[i].id
      }
    }
  }
  
  return null
}

const getPrevLesson = () => {
  if (!currentLesson.value || !currentSectionId.value) return null
  
  const currentLessons = lessonsBySection.value[currentSectionId.value] || []
  const currentIndex = currentLessons.findIndex(l => l.id === currentLesson.value.id)
  
  if (currentIndex > 0) {
    return {
      lesson: currentLessons[currentIndex - 1],
      sectionId: currentSectionId.value
    }
  }

  const sectionIndex = sections.value.findIndex(s => s.id === currentSectionId.value)
  if (sectionIndex > 0) {
    const prevLessons = lessonsBySection.value[sections.value[sectionIndex - 1].id] || []
    if (prevLessons.length) {
      return {
        lesson: prevLessons[prevLessons.length - 1],
        sectionId: sections.value[sectionIndex - 1].id
      }
    }
  }
  
  return null
}

const handleMarkComplete = async (testResults = null) => {
  if (!courseId.value || !currentSectionId.value || !currentLesson.value) return

  try {
    const progressData = {
      status: 'completed',
      updatedAt: new Date().toISOString(),
      ...(testResults && { testResults })
    }

    await progressAPI.update(courseId.value, progressData)

    courseProgress.value = {
      ...courseProgress.value,
      ...progressData
    }

    const nextLessonData = getNextLesson()
    if (nextLessonData) {
      await handleLessonSelect(nextLessonData.sectionId, nextLessonData.lesson.id)
    }

  } catch (err) {
    console.error('Error marking lesson as complete:', err)
    error.value = 'Не удалось отметить урок как завершенный'
  }
}

const handleNavigate = (direction) => {
  if (direction === 'next') {
    const nextLessonData = getNextLesson()
    if (nextLessonData) {
      handleLessonSelect(nextLessonData.sectionId, nextLessonData.lesson.id)
    }
  } else if (direction === 'prev') {
    const prevLessonData = getPrevLesson()
    if (prevLessonData) {
      handleLessonSelect(prevLessonData.sectionId, prevLessonData.lesson.id)
    }
  }
}

const handleOpenTest = () => {
  showQuizView.value = true
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleCloseQuiz = () => {
  showQuizView.value = false
}

onMounted(() => {
  loadCourseData()
})
</script>