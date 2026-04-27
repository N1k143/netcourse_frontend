<!-- components/common/InterestModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        @click.self="$emit('close')"
      >
        <!-- Подложка -->
        <div class="absolute inset-0 bg-slate-950/90 backdrop-blur-md"></div>

        <!-- Само окно -->
        <Transition name="modal-scale">
          <div
            v-if="show"
            class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-500/10"
          >
            <!-- Декоративная сетка -->
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:24px_24px] rounded-2xl pointer-events-none"></div>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"></div>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-16 bg-emerald-500/5 blur-2xl pointer-events-none rounded-full"></div>

            <!-- Крестик -->
            <button
              @click="$emit('close')"
              class="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all"
            >
              <Icon name="mdi:close" class="w-4 h-4" />
            </button>

            <div class="relative p-5 sm:p-8">
              <!-- Заголовок -->
              <div class="text-center mb-6 sm:mb-8">
                <div class="relative mx-auto mb-4 sm:mb-5 w-16 h-16 sm:w-20 sm:h-20">
                  <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div class="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border-2 border-emerald-500/50 rounded-full flex items-center justify-center">
                    <Icon name="mdi:compass" class="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                  </div>
                </div>
                <div class="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-2">// welcome</div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                  Что вам интересно?
                </h2>
                <p class="text-slate-400 font-mono text-xs sm:text-sm px-2">
                  Выберите направление, и мы подберём курсы под ваш интерес
                </p>
              </div>

              <!-- Разделитель -->
              <div class="flex items-center gap-3 mb-6">
                <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                <span class="text-slate-600 font-mono text-xs">choose_path</span>
                <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
              </div>

              <!-- Индикатор загрузки -->
              <div v-if="loadingCategories" class="flex justify-center py-8">
                <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>

              <!-- Карточки категорий (появляются только после загрузки) -->
              <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  @click="$emit('select', cat.id)"
                  class="group relative bg-slate-800/60 border border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 transition-all duration-300 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-emerald-500/10 text-left"
                >
                  <!-- Иконка категории -->
                  <div class="flex items-center justify-center w-10 h-10 rounded-lg mb-3" :class="cat.bgClass">
                    <Icon :name="cat.icon" class="w-5 h-5" :class="cat.iconColor" />
                  </div>
                  <div class="font-mono text-white font-bold text-sm mb-1">{{ cat.label }}</div>
                  <div class="text-slate-400 text-xs mb-2 font-mono">{{ cat.description }}</div>
                  <div class="text-emerald-400 font-mono text-xs">
                    <span class="text-emerald-500">{{ cat.count }}</span> курсов
                  </div>
                  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>

              <!-- Подсказка -->
              <p class="text-center text-slate-500 font-mono text-xs">
                Можно посмотреть все курсы позже на странице каталога
              </p>
            </div>

            <!-- Нижняя линия -->
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'select'])

const { coursesAPI } = useApi()
const loadingCategories = ref(true)
const hasLoaded = ref(false)   // чтобы не грузить повторно при повторном открытии

const categories = ref([
  {
    id: 'programming',
    label: 'Программирование',
    description: 'От основ до продвинутых алгоритмов',
    icon: 'mdi:code-braces',
    iconColor: 'text-blue-400',
    bgClass: 'bg-blue-500/10',
    count: 0
  },
  {
    id: 'networking',
    label: 'Сети',
    description: 'Маршрутизация, протоколы, DevNet',
    icon: 'mdi:lan',
    iconColor: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    count: 0
  },
  {
    id: 'cybersecurity',
    label: 'Кибербезопасность',
    description: 'Защита систем и этичный хакинг',
    icon: 'mdi:shield-lock',
    iconColor: 'text-red-400',
    bgClass: 'bg-red-500/10',
    count: 0
  }
])

const fetchCounts = async () => {
  loadingCategories.value = true
  try {
    const allCourses = await coursesAPI.getAll()
    const counts = {
      programming: allCourses.filter(c => c.category === 'programming').length,
      networking: allCourses.filter(c => c.category === 'networking').length,
      cybersecurity: allCourses.filter(c => c.category === 'cybersecurity').length
    }
    categories.value.forEach(cat => {
      cat.count = counts[cat.id] || 0
    })
    hasLoaded.value = true
  } catch (e) {
    console.error('Ошибка загрузки количества курсов:', e)
  } finally {
    loadingCategories.value = false
  }
}

// Загрузка при изменении show (когда окно открывается)
watch(() => props.show, (newVal) => {
  if (newVal) {
    if (!hasLoaded.value) {
      fetchCounts()
    }
    if (process.client) document.body.style.overflow = 'hidden'
  } else {
    if (process.client) document.body.style.overflow = ''
  }
})

// Загрузка при монтировании, если show уже true (например, после <ClientOnly>)
onMounted(() => {
  if (props.show && !hasLoaded.value) {
    fetchCounts()
  }

  const onKeydown = (e) => { if (e.key === 'Escape') emit('close') }
  window.addEventListener('keydown', onKeydown)
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }

.modal-scale-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-scale-leave-active { transition: all 0.2s ease; }
.modal-scale-enter-from { opacity: 0; transform: scale(0.88) translateY(16px); }
.modal-scale-leave-to   { opacity: 0; transform: scale(0.94) translateY(8px); }
</style>