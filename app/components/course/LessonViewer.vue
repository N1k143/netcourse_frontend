<template>
  <div v-if="!currentLesson || !currentLesson.id" class="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 text-center">
    <div class="text-slate-400 font-mono text-xs xs:text-sm sm:text-base md:text-lg mb-2 xs:mb-3 sm:mb-4">
      // Урок не найден
    </div>
    <div class="text-slate-500 font-mono text-[10px] xs:text-xs sm:text-sm">
      Выберите урок из списка слева
    </div>
  </div>

  <div v-else class="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 w-full overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-1.5 xs:gap-2 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
      <div class="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
      <div class="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
      <div class="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
      <span class="text-slate-500 font-mono text-[10px] xs:text-xs sm:text-sm">lesson_viewer</span>
    </div>

    <!-- Content Area -->
    <div class="markdown-content min-h-[250px] xs:min-h-[300px] sm:min-h-[350px] md:min-h-[400px] mb-4 xs:mb-5 sm:mb-6 w-full overflow-hidden">
      <div v-if="currentLesson.contentType === 'text' && currentLesson.textContent" class="w-full overflow-hidden">
        <MarkdownRenderer :content="currentLesson.textContent" />
      </div>

      <div v-else-if="currentLesson.contentType === 'video' && currentLesson.videoUrl" class="w-full">
        <div class="aspect-video bg-black rounded-lg overflow-hidden w-full">
          <iframe
            v-if="getYouTubeVideoId(currentLesson.videoUrl)"
            :src="`https://www.youtube.com/embed/${getYouTubeVideoId(currentLesson.videoUrl)}`"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            title="YouTube видео урока"
          />
          <video
            v-else
            :src="currentLesson.videoUrl"
            controls
            class="w-full h-full"
            preload="metadata"
          >
            Ошибка воспроизведения видео
          </video>
        </div>
      </div>

      <div v-else class="text-center py-6 xs:py-8 sm:py-10 md:py-12 lg:py-20">
        <div class="text-slate-400 font-mono text-xs xs:text-sm sm:text-base md:text-lg mb-2 xs:mb-3 sm:mb-4">
          // Контент урока не найден
        </div>
        <div class="text-slate-500 font-mono text-[10px] xs:text-xs sm:text-sm">
          Обратитесь к администратору курса
        </div>
      </div>
    </div>

    <!-- Quiz Button -->
    <div v-if="!checkingQuiz && hasQuiz" class="mb-4 xs:mb-5 sm:mb-6">
      <button
        @click="handleOpenTest"
        class="w-full px-3 py-2 xs:px-4 xs:py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 rounded-lg font-mono text-xs xs:text-sm hover:from-emerald-500 hover:to-emerald-400 transition-all hover:shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-1.5 xs:gap-2 relative overflow-hidden group/btn"
      >
        <span class="relative z-10 flex items-center justify-center gap-1.5 xs:gap-2">
          <span class="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-slate-950 rounded-full animate-pulse"></span>
          > start_test.sh
        </span>
        <div class="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-emerald-500 to-emerald-300"></div>
      </button>
      <div class="text-center text-slate-500 text-[10px] xs:text-xs font-mono mt-1.5 xs:mt-2">
        // Complete the test to finish the lesson
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex flex-col sm:flex-row justify-between gap-2 xs:gap-2.5 sm:gap-3 mt-4 xs:mt-5 sm:mt-6 md:mt-8 pt-4 xs:pt-5 sm:pt-6 border-t border-emerald-500/20">
      <button
        @click="emit('navigate', 'prev')"
        class="px-3 py-2 xs:px-4 xs:py-2.5 sm:px-5 sm:py-3 bg-slate-800 text-slate-300 rounded-lg font-mono text-xs xs:text-sm hover:bg-slate-700 transition-all border border-slate-600 hover:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group/btn"
      >
        <span class="relative z-10 flex items-center justify-center gap-1.5 xs:gap-2">
          <span class="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-slate-300 rounded-full"></span>
          > prev_lesson.sh
        </span>
        <div class="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-slate-700"></div>
      </button>

      <button
        @click="emit('navigate', 'next')"
        class="px-3 py-2 xs:px-4 xs:py-2.5 sm:px-5 sm:py-3 bg-slate-800 text-slate-300 rounded-lg font-mono text-xs xs:text-sm hover:bg-slate-700 transition-all border border-slate-600 hover:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group/btn"
      >
        <span class="relative z-10 flex items-center justify-center gap-1.5 xs:gap-2">
          <span class="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-slate-300 rounded-full"></span>
          > next_lesson.sh
        </span>
        <div class="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-slate-700"></div>
      </button>
    </div>

    <!-- Кнопка «Завершить курс» всегда активна, пока курс не завершён -->
    <div v-if="!courseCompleted" class="mt-4 xs:mt-5 sm:mt-6 pt-4 xs:pt-5 sm:pt-6 border-t border-emerald-500/20">
      <button
        @click="emit('complete-course')"
        class="w-full px-3 py-2 xs:px-4 xs:py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 rounded-lg font-mono text-xs xs:text-sm transition-all hover:shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-1.5 xs:gap-2 relative overflow-hidden group/btn"
      >
        <span class="relative z-10 flex items-center justify-center gap-1.5 xs:gap-2">
          <Icon name="mdi:check-circle-outline" class="w-4 h-4" />
          > complete_course.sh
        </span>
        <div class="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-emerald-500 to-emerald-300"></div>
      </button>
      <div class="text-center text-slate-500 text-[10px] xs:text-xs font-mono mt-1.5 xs:mt-2">
        // Finish course and get rewards
      </div>
    </div>

    <!-- Статус завершённого курса -->
    <div v-else class="mt-4 xs:mt-5 sm:mt-6 pt-4 xs:pt-5 sm:pt-6 border-t border-emerald-500/20 text-center text-emerald-500 font-mono text-xs xs:text-sm flex items-center justify-center gap-2">
      <Icon name="mdi:check-circle" class="w-4 h-4" />
      <span>// курс завершён</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  courseId:        { type: [String, Number], required: true },
  currentSectionId:{ type: [String, Number], default: null },
  currentLesson:   { type: Object,           default: () => ({}) },
  lessonCompleted: { type: Boolean,          default: false },
  courseCompleted: { type: Boolean,          default: false }
})

const emit = defineEmits(['navigate', 'open-test', 'mark-complete', 'complete-course'])

const { quizzesAPI } = useApi()
const hasQuiz = ref(false)
const checkingQuiz = ref(true)
const hasEmittedComplete = ref(false)

const checkForQuiz = async () => {
  if (!props.courseId || !props.currentSectionId || !props.currentLesson?.id) {
    hasQuiz.value = false
    checkingQuiz.value = false
    return
  }
  checkingQuiz.value = true
  try {
    const quizzes = await quizzesAPI.getByLesson(props.courseId, props.currentSectionId, props.currentLesson.id)
    hasQuiz.value = quizzes && quizzes.length > 0
  } catch {
    hasQuiz.value = false
  } finally {
    checkingQuiz.value = false
    if (!hasQuiz.value && !props.lessonCompleted && !hasEmittedComplete.value) {
      hasEmittedComplete.value = true
      emit('mark-complete')
    }
  }
}

const handleOpenTest = () => emit('open-test')

const getYouTubeVideoId = (url) => {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtube\.com\/embed\/)([^&\s]+)/,
    /(?:youtu\.be\/)([^&\s]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m?.[1]) return m[1]
  }
  return null
}

watch(
  () => [props.courseId, props.currentSectionId, props.currentLesson],
  () => {
    hasEmittedComplete.value = false
    checkForQuiz()
  },
  { immediate: true }
)
</script>