<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <div class="w-6 h-6 sm:w-8 sm:h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div class="text-emerald-500 font-mono text-base sm:text-xl mt-4">$ loading_quiz...</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-slate-900 border border-red-500/30 rounded-xl p-4 sm:p-8">
      <div class="text-center">
        <AlertCircle class="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
        <div class="text-red-400 font-mono text-base sm:text-lg mb-4">Ошибка загрузки</div>
        <div class="text-slate-400 text-xs sm:text-sm mb-6">{{ error }}</div>
        <button
          @click="loadQuizzes"
          class="px-4 py-2 sm:px-6 sm:py-3 bg-emerald-500 text-slate-950 rounded-lg font-mono text-sm sm:text-base hover:bg-emerald-400 transition-all"
        >
          Попробовать снова
        </button>
      </div>
    </div>

    <!-- No Quiz Available -->
    <div v-else-if="!quizzes || quizzes.length === 0" class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-8">
      <div class="text-center">
        <div class="text-slate-400 font-mono text-base sm:text-lg mb-4">// Тест не найден</div>
        <div class="text-slate-500 font-mono text-xs sm:text-sm mb-6">Для этого урока нет теста</div>
        <button
          @click="emit('close')"
          class="px-4 py-2 sm:px-6 sm:py-3 bg-emerald-500 text-slate-950 rounded-lg font-mono text-sm sm:text-base hover:bg-emerald-400 transition-all"
        >
          Вернуться к уроку
        </button>
      </div>
    </div>

    <!-- Results View -->
    <div v-else-if="showResults && results" class="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 sm:p-8">
      <div class="flex items-center gap-2 mb-4 sm:mb-6">
        <div class="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
        <div class="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
        <div class="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
        <span class="text-slate-500 font-mono text-xs sm:text-sm">test_results</span>
      </div>

      <div class="text-center mb-6 sm:mb-8">
        <CheckCircle v-if="results.passed" class="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-4 sm:mb-6" />
        <XCircle v-else class="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto mb-4 sm:mb-6" />

        <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">
          {{ results.passed ? 'Тест пройден!' : 'Тест не пройден' }}
        </h2>

        <p class="text-slate-400 font-mono text-sm sm:text-base mb-4 sm:mb-6 px-4">
          {{ results.passed
            ? 'Поздравляем! Вы успешно прошли тест.'
            : `К сожалению, вы не набрали минимальный балл (${results.minScore}%).` }}
        </p>

        <div class="bg-slate-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 max-w-md mx-auto">
          <div class="text-4xl sm:text-5xl font-bold mb-2">
            <span :class="results.passed ? 'text-green-500' : 'text-red-500'">
              {{ results.score }}%
            </span>
          </div>
          <div class="text-slate-400 font-mono text-xs sm:text-sm mb-2">
            Правильных ответов: {{ results.correctCount }} из {{ results.totalCount }}
          </div>
          <div class="w-full bg-slate-700 rounded-full h-2 mt-4 overflow-hidden">
            <div
              :class="[
                'h-2 rounded-full transition-all duration-1000',
                results.passed
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-red-500 to-orange-500'
              ]"
              :style="{ width: `${results.score}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Detailed Results -->
      <div class="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-h-80 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
        <div
          v-for="(detail, index) in results.details"
          :key="index"
          :class="[
            'bg-slate-800 rounded-lg p-3 sm:p-4 border-2',
            detail.isCorrect ? 'border-green-500/30' : 'border-red-500/30'
          ]"
        >
          <div class="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
            <CheckCircle v-if="detail.isCorrect" class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-1 flex-shrink-0" />
            <XCircle v-else class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-1 flex-shrink-0" />

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span class="text-emerald-400 font-mono text-xs sm:text-sm font-bold">Вопрос {{ index + 1 }}:</span>
                <span :class="[
                  'text-xs font-mono px-2 py-0.5 rounded',
                  detail.isCorrect ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                ]">
                  {{ detail.isCorrect ? 'Верно' : 'Неверно' }}
                </span>
              </div>
              <p class="text-white text-xs sm:text-sm mb-2 sm:mb-3 break-words">{{ detail.question }}</p>

              <div v-if="detail.questionType === 'text'" class="space-y-2">
                <div class="text-slate-400 text-xs font-mono">Ваш ответ:</div>
                <div class="bg-slate-900 rounded p-2 text-slate-300 text-xs sm:text-sm font-mono break-words">
                  {{ detail.userAnswer || '(нет ответа)' }}
                </div>
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="answer in detail.allAnswers"
                  :key="answer.id"
                  :class="[
                    'p-2 rounded text-xs sm:text-sm font-mono',
                    isCorrectUserAnswer(detail, answer)
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : answer.isCorrect
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : isUserAnswerWrong(detail, answer)
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-slate-900 text-slate-500'
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <CheckCircle v-if="answer.isCorrect" class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <XCircle v-else-if="isUserAnswerWrong(detail, answer)" class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span class="break-words">{{ answer.answerText }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <button
          v-if="!results.passed"
          @click="handleRetry"
          class="px-4 py-2.5 sm:px-6 sm:py-3 bg-slate-800 text-slate-300 rounded-lg font-mono text-sm sm:text-base hover:bg-slate-700 transition-all border border-slate-600 hover:border-emerald-500/50 flex items-center justify-center gap-2"
        >
          <RefreshCw class="w-4 h-4" />
          Пройти снова
        </button>
        <button
          @click="handleClose"
          class="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 rounded-lg font-mono text-sm sm:text-base hover:from-emerald-500 hover:to-emerald-400 transition-all hover:shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
        >
          <CheckCircle v-if="results.passed" class="w-4 h-4" />
          {{ results.passed ? 'Продолжить курс' : 'Вернуться к уроку' }}
        </button>
      </div>
    </div>

    <!-- Quiz Questions -->
    <div v-else class="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 sm:p-6">
      <div class="flex items-center gap-2 mb-4 sm:mb-6">
        <div class="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
        <div class="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
        <div class="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
        <span class="text-slate-500 font-mono text-xs sm:text-sm">quiz_test</span>
      </div>

      <!-- Quiz Header -->
      <div class="mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
          <h2 class="text-xl sm:text-2xl font-bold text-white break-words">{{ currentQuiz?.title }}</h2>
          <span class="text-emerald-400 font-mono text-sm">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            class="h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Current Question -->
      <div v-if="currentQuestion" class="mb-6 sm:mb-8">
        <div class="bg-slate-800 rounded-xl p-3 sm:p-6 mb-4 sm:mb-6">
          <div class="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span class="text-emerald-400 font-mono text-base sm:text-lg font-bold flex-shrink-0">
              Q{{ currentQuestionIndex + 1 }}:
            </span>
            <p class="text-white text-sm sm:text-lg flex-1 break-words">{{ currentQuestion.questionText }}</p>
          </div>
          <div v-if="currentQuestion.questionType !== 'text'" class="text-xs text-slate-500 font-mono">
            {{ currentQuestion.questionType === 'multiple'
              ? '// Можно выбрать несколько вариантов'
              : '// Выберите один вариант' }}
          </div>
        </div>

        <!-- Answer Options -->
        <div class="space-y-2 sm:space-y-3">
          <textarea
            v-if="currentQuestion.questionType === 'text'"
            :value="userAnswers[currentQuestion.id] || ''"
            @input="handleTextAnswer(currentQuestion.id, $event.target.value)"
            placeholder="Введите ваш ответ..."
            class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-4 text-white text-sm sm:text-base font-mono focus:border-emerald-500 focus:outline-none transition-colors resize-none"
            rows="4"
          />

          <button
            v-else
            v-for="(answer, index) in currentAnswers"
            :key="answer.id"
            @click="handleAnswerSelect(currentQuestion.id, answer.id, currentQuestion.questionType)"
            :class="[
              'w-full text-left p-3 sm:p-4 rounded-lg font-mono text-sm sm:text-base transition-all border-2',
              isAnswerSelected(currentQuestion, answer)
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:bg-slate-700'
            ]"
          >
            <div class="flex items-center gap-2 sm:gap-3">
              <span :class="[
                'w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0',
                isAnswerSelected(currentQuestion, answer)
                  ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                  : 'border-slate-600'
              ]">
                {{ isAnswerSelected(currentQuestion, answer) ? '✓' : String.fromCharCode(65 + index) }}
              </span>
              <span class="flex-1 break-words">{{ answer.answerText }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 sm:pt-6 border-t border-slate-800">
        <button
          @click="currentQuestionIndex = Math.max(0, currentQuestionIndex - 1)"
          :disabled="currentQuestionIndex === 0"
          class="px-4 py-2.5 sm:px-6 sm:py-3 bg-slate-800 text-slate-300 rounded-lg font-mono text-sm sm:text-base hover:bg-slate-700 transition-all border border-slate-600 hover:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ChevronLeft class="w-4 h-4" />
          Назад
        </button>

        <button
          v-if="isLastQuestion"
          @click="handleSubmit"
          :disabled="submitting || Object.keys(userAnswers).length !== questions.length"
          class="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 rounded-lg font-mono text-sm sm:text-base hover:from-emerald-500 hover:to-emerald-400 transition-all hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-first sm:order-none"
        >
          <div v-if="submitting" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          <template v-else>
            Завершить тест
            <CheckCircle class="w-4 h-4" />
          </template>
        </button>

        <button
          v-else
          @click="currentQuestionIndex = Math.min(questions.length - 1, currentQuestionIndex + 1)"
          class="px-4 py-2.5 sm:px-6 sm:py-3 bg-emerald-500 text-slate-950 rounded-lg font-mono text-sm sm:text-base hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 order-first sm:order-none"
        >
          Далее
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ChevronRight, ChevronLeft } from 'lucide-vue-next'

const props = defineProps({
  courseId: { type: [String, Number], required: true },
  sectionId: { type: [String, Number], required: true },
  lessonId: { type: [String, Number], required: true }
})

const emit = defineEmits(['complete', 'close'])
const { quizzesAPI } = useApi()

// Инжектируем функцию для показа тостера (если родитель предоставил)
const addToast = inject('addToast', (toast) => {
  // fallback, чтобы не ломать компонент, если тостер не используется
  console.warn('Toast not provided', toast)
})

const quizzes = ref([])
const currentQuiz = ref(null)
const questions = ref([])
const allAnswers = ref({})
const currentQuestionIndex = ref(0)
const userAnswers = ref({})
const showResults = ref(false)
const results = ref(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const currentAnswers = computed(() =>
  currentQuestion.value ? (allAnswers.value[currentQuestion.value.id] || []) : []
)
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)
const progress = computed(() => ((currentQuestionIndex.value + 1) / questions.value.length) * 100)

const loadQuizzes = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await quizzesAPI.getByLesson(props.courseId, props.sectionId, props.lessonId)
    if (!data || data.length === 0) {
      quizzes.value = []
      currentQuiz.value = null
    } else {
      quizzes.value = data
      selectQuiz(data[0])
    }
  } catch (err) {
    error.value = err.message
    addToast({ type: 'error', message: `Ошибка загрузки теста: ${err.message}` })
  } finally {
    loading.value = false
  }
}

const selectQuiz = async (quiz) => {
  currentQuiz.value = quiz
  currentQuestionIndex.value = 0
  userAnswers.value = {}
  showResults.value = false
  results.value = null
  await loadQuestions(quiz.id)
}

const loadQuestions = async (quizId) => {
  loading.value = true
  try {
    const questionsData = await quizzesAPI.getQuestions(props.courseId, props.sectionId, props.lessonId, quizId)
    questions.value = questionsData
    const answersMap = {}
    questionsData.forEach(question => {
      answersMap[question.id] = question.answers && Array.isArray(question.answers) ? question.answers : []
    })
    allAnswers.value = answersMap
  } catch (err) {
    error.value = err.message
    addToast({ type: 'error', message: `Ошибка загрузки вопросов: ${err.message}` })
  } finally {
    loading.value = false
  }
}

const handleAnswerSelect = (questionId, answerId, questionType) => {
  if (questionType === 'multiple') {
    const current = userAnswers.value[questionId] || []
    const isSelected = current.includes(answerId)
    userAnswers.value = {
      ...userAnswers.value,
      [questionId]: isSelected ? current.filter(id => id !== answerId) : [...current, answerId]
    }
  } else {
    userAnswers.value = { ...userAnswers.value, [questionId]: [answerId] }
  }
}

const handleTextAnswer = (questionId, text) => {
  userAnswers.value = { ...userAnswers.value, [questionId]: text }
}

const isAnswerSelected = (question, answer) => {
  if (question.questionType === 'multiple') {
    return (userAnswers.value[question.id] || []).includes(answer.id)
  }
  return (userAnswers.value[question.id] || [])[0] === answer.id
}

const isCorrectUserAnswer = (detail, answer) => {
  const isUserAnswer = detail.questionType === 'multiple'
    ? (detail.userAnswer || []).includes(answer.id)
    : (detail.userAnswer || [])[0] === answer.id
  return answer.isCorrect && isUserAnswer
}

const isUserAnswerWrong = (detail, answer) => {
  const isUserAnswer = detail.questionType === 'multiple'
    ? (detail.userAnswer || []).includes(answer.id)
    : (detail.userAnswer || [])[0] === answer.id
  return isUserAnswer && !answer.isCorrect
}

const buildDetails = () => {
  return questions.value.map(question => {
    const userAnswer = userAnswers.value[question.id]
    const correctAnswers = allAnswers.value[question.id]?.filter(a => a.isCorrect).map(a => a.id) || []
    let isCorrect = false

    if (question.questionType === 'text') {
      isCorrect = userAnswer && String(userAnswer).trim().length > 0
    } else if (question.questionType === 'multiple') {
      const arr = userAnswer || []
      isCorrect = arr.length === correctAnswers.length && arr.every(id => correctAnswers.includes(id))
    } else {
      isCorrect = correctAnswers.includes(userAnswer?.[0])
    }

    return {
      question: question.questionText,
      questionType: question.questionType,
      userAnswer,
      correctAnswers,
      allAnswers: allAnswers.value[question.id] || [],
      isCorrect
    }
  })
}

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  error.value = ''

  try {
    const answers = questions.value
      .filter(q => q.questionType !== 'text')
      .map(q => ({
        questionId: q.id,
        answerIds: Array.isArray(userAnswers.value[q.id]) ? userAnswers.value[q.id] : []
      }))

    const attemptResult = await quizzesAPI.submitAttempt(
      props.courseId,
      props.sectionId,
      props.lessonId,
      currentQuiz.value.id,
      { answers }
    )

    results.value = {
      score: attemptResult.score,
      passed: attemptResult.passed,
      correctCount: attemptResult.correctCount,
      totalCount: attemptResult.totalCount,
      minScore: attemptResult.minScore,
      details: buildDetails()
    }

    showResults.value = true
    // НЕ эмитим complete — пользователь сам нажмёт кнопку и увидит результаты

  } catch (err) {
    error.value = err.message || 'Не удалось отправить результаты теста'
    addToast({ type: 'error', message: error.value })
  } finally {
    submitting.value = false
  }
}

// Если тест пройден — emit complete, иначе просто закрываем
const handleClose = () => {
  if (results.value?.passed) {
    emit('complete')
  } else {
    emit('close')
  }
}

const handleRetry = () => {
  userAnswers.value = {}
  currentQuestionIndex.value = 0
  showResults.value = false
  results.value = null
}

onMounted(() => {
  if (props.courseId && props.sectionId && props.lessonId) loadQuizzes()
})

watch(() => [props.courseId, props.sectionId, props.lessonId], () => {
  if (props.courseId && props.sectionId && props.lessonId) loadQuizzes()
})
</script>