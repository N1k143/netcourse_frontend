<template>
  <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-6 sticky top-32 max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
    <div class="flex items-center gap-2 mb-4">
      <div class="w-2 h-2 bg-red-500 rounded-full"></div>
      <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
      <span class="text-slate-500 font-mono text-sm">course_nav</span>
    </div>

    <div class="flex-1 overflow-y-auto pr-2">
      <div class="space-y-4">
        <div v-for="section in sections" :key="section.id" class="border-l-2 border-emerald-500/30 pl-4">
          <button
            @click="toggleSection(section.id)"
            class="w-full text-left mb-2 hover:opacity-80 transition-opacity"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-emerald-500 font-mono text-sm">
                {{ section.title }}
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-500">
                  {{ (lessonsBySection[section.id] || []).length }} уроков
                </span>
                <ChevronDown v-if="expandedSections[section.id] !== false" class="w-3 h-3 text-emerald-500" />
                <ChevronRight v-else class="w-3 h-3 text-emerald-500" />
              </div>
            </div>
          </button>

          <div v-if="expandedSections[section.id] !== false && (lessonsBySection[section.id] || []).length > 0" class="space-y-1 ml-2">
            <button
              v-for="lesson in lessonsBySection[section.id]"
              :key="lesson.id"
              @click="$emit('lesson-select', section.id, lesson.id)"
              :class="[
                'w-full text-left p-2 rounded-lg font-mono text-xs transition-all duration-200',
                currentLessonId === lesson.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : courseProgress[lesson.id]?.status === 'completed'
                  ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              ]"
            >
              <div class="flex items-center gap-2">
                <CheckCircle v-if="courseProgress[lesson.id]?.status === 'completed'" class="w-3 h-3 text-green-500" />
                <Play v-else-if="currentLessonId === lesson.id" class="w-3 h-3 text-emerald-400 animate-pulse" />
                <Circle v-else class="w-3 h-3 text-slate-500" />
                <span class="flex-1 truncate text-left">{{ lesson.title }}</span>
                <span v-if="lesson.duration" class="text-slate-500 text-xs shrink-0">
                  {{ lesson.duration }}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="onOpenQuizzes" class="mt-4 pt-4 border-t border-slate-800/30">
      <button
        @click="$emit('open-quizzes')"
        class="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        <ClipboardList class="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span class="text-emerald-400 font-mono text-sm">Тесты курса</span>
      </button>
    </div>

    <div class="mt-4">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-slate-400 font-mono">Статус курса</span>
        <span :class="[
          'text-sm font-mono',
          progressStatus === 'completed' ? 'text-green-500' :
          progressStatus === 'in_progress' ? 'text-cyan-500' :
          'text-slate-500'
        ]">
          {{ progressStatus === 'completed' ? 'COMPLETED' :
             progressStatus === 'in_progress' ? 'IN PROGRESS' :
             'NOT STARTED' }}
        </span>
      </div>

      <div class="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
        <div 
          :class="[
            'h-1 rounded-full transition-all duration-1000 ease-out',
            progressStatus === 'completed' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : progressStatus === 'in_progress'
              ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500' 
              : 'bg-gradient-to-r from-slate-600 to-slate-500'
          ]"
          :style="{ 
            width: progressStatus === 'completed' ? '100%' : 
                   progressStatus === 'in_progress' ? '50%' : '0%' 
          }"
        ></div>
      </div>
      <div class="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
        <span>NOT STARTED</span>
        <span>IN PROGRESS</span>
        <span>COMPLETED</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Circle, CheckCircle, Play, ChevronDown, ChevronRight, ClipboardList } from 'lucide-vue-next'

const props = defineProps({
  course: Object,
  sections: {
    type: Array,
    default: () => []
  },
  lessonsBySection: {
    type: Object,
    default: () => ({})
  },
  currentLessonId: [Number, String],
  courseProgress: {
    type: Object,
    default: () => ({ status: 'not_started' })
  },
  onOpenQuizzes: Function
})

const emit = defineEmits(['lesson-select', 'open-quizzes'])

const expandedSections = ref({})

const progressStatus = computed(() => props.courseProgress?.status || 'not_started')

const toggleSection = (sectionId) => {
  expandedSections.value = {
    ...expandedSections.value,
    [sectionId]: !(expandedSections.value[sectionId] ?? true)
  }
}

// Авто-раскрытие секции с текущим уроком
watch(() => props.currentLessonId, (newLessonId) => {
  if (newLessonId) {
    Object.entries(props.lessonsBySection).forEach(([sectionId, lessons]) => {
      if (lessons.some(lesson => lesson.id === newLessonId)) {
        expandedSections.value = {
          ...expandedSections.value,
          [sectionId]: true
        }
      }
    })
  }
}, { immediate: true })
</script>