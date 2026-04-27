<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        @click.self="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-950/90 backdrop-blur-md"></div>

        <!-- Модальное окно -->
        <Transition name="modal-scale">
          <div
            v-if="show"
            class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-500/10"
          >
            <!-- Декоративная сетка фон -->
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:24px_24px] rounded-2xl pointer-events-none"></div>

            <!-- Верхнее свечение -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"></div>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-16 bg-emerald-500/5 blur-2xl pointer-events-none rounded-full"></div>

            <!-- Кнопка закрыть -->
            <button
              @click="$emit('close')"
              class="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all"
            >
              <Icon name="mdi:close" class="w-4 h-4" />
            </button>

            <div class="relative p-5 sm:p-8">
              <!-- Заголовок -->
              <div class="text-center mb-6 sm:mb-8">
                <!-- Иконка трофея -->
                <div class="relative mx-auto mb-4 sm:mb-5 w-16 h-16 sm:w-20 sm:h-20">
                  <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div class="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border-2 border-emerald-500/50 rounded-full flex items-center justify-center">
                    <Icon name="mdi:trophy-award" class="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                  </div>
                  <!-- Орбитальные точки -->
                  <div class="absolute inset-0 animate-spin-slow">
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div class="absolute inset-0 animate-spin-slow" style="animation-delay: -2s;">
                    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  </div>
                </div>

                <div class="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-2">// success</div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                  Курс завершён!
                </h2>
                <p class="text-slate-400 font-mono text-xs sm:text-sm px-2">
                  Вы успешно прошли курс
                  <span class="text-emerald-400 font-semibold block sm:inline mt-1 sm:mt-0">{{ courseTitle }}</span>
                </p>
              </div>

              <!-- Разделитель: сертификат -->
              <div class="flex items-center gap-3 mb-6">
                <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                <span class="text-slate-600 font-mono text-xs">certificate</span>
                <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
              </div>

              <!-- Блок сертификата -->
              <div v-if="certification" class="mb-6">
                <div class="relative bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4 sm:p-5 overflow-hidden">
                  <!-- Декоративный угол -->
                  <div class="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 blur-xl pointer-events-none"></div>
                  <div class="absolute top-0 right-0 border-t-2 border-r-2 border-yellow-500/30 w-8 h-8 rounded-tr-xl pointer-events-none"></div>

                  <div class="flex items-start gap-3 mb-4">
                    <div class="w-9 h-9 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center justify-center shrink-0">
                      <Icon name="mdi:certificate" class="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <div class="text-yellow-400 font-mono text-xs font-bold tracking-wider uppercase mb-0.5">Сертификат выдан</div>
                      <div class="text-white font-semibold text-sm sm:text-base break-words">{{ certification.course?.title || courseTitle }}</div>
                    </div>
                  </div>

                  <!-- Инфо строки -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    <div class="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                      <div class="text-slate-500 font-mono text-xs mb-1">Дата выдачи</div>
                      <div class="text-slate-200 font-mono text-xs sm:text-sm font-semibold">{{ formatDate(certification.issuedAt) }}</div>
                    </div>
                    <div class="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                      <div class="text-slate-500 font-mono text-xs mb-1">Код</div>
                      <div class="text-slate-200 font-mono text-xs sm:text-sm font-semibold break-all tracking-wider">
                        {{ certification.certificateCode }}
                      </div>
                    </div>
                  </div>

                  <!-- Кнопка скачать -->
                  <button
                    @click="handleDownload"
                    :disabled="downloading"
                    class="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-mono font-bold text-sm transition-all duration-200 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-slate-900 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <div v-if="downloading" class="w-4 h-4 border-2 border-slate-900/50 border-t-slate-900 rounded-full animate-spin"></div>
                    <Icon v-else name="mdi:download" class="w-4 h-4" />
                    <span>{{ downloading ? 'Загрузка файла...' : '$ download_certificate.pdf' }}</span>
                  </button>
                </div>
              </div>

              <!-- Сертификат грузится -->
              <div v-else class="mb-6">
                <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-4 sm:p-5 flex items-center gap-3">
                  <div class="w-5 h-5 border-2 border-yellow-400/50 border-t-yellow-400 rounded-full animate-spin shrink-0"></div>
                  <div>
                    <div class="text-slate-300 font-mono text-sm">Сертификат формируется</div>
                    <div class="text-slate-500 font-mono text-xs mt-0.5">Обычно занимает несколько секунд</div>
                  </div>
                </div>
              </div>

              <!-- ===== БЛОК МЕДАЛИ ===== -->
              <template v-if="medal">
                <!-- Разделитель: badge -->
                <div class="flex items-center gap-3 mb-6">
                  <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                  <span class="text-slate-600 font-mono text-xs">badge</span>
                  <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                </div>

                <div class="mb-6">
                  <div class="relative bg-slate-800/60 border border-emerald-500/30 rounded-xl p-4 sm:p-5 overflow-hidden">
                    <!-- Декоративный угол -->
                    <div class="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 blur-xl pointer-events-none"></div>
                    <div class="absolute top-0 right-0 border-t-2 border-r-2 border-emerald-500/30 w-8 h-8 rounded-tr-xl pointer-events-none"></div>

                    <div class="flex items-center gap-4">
                      <!-- Иконка медали -->
                      <div class="relative shrink-0">
                        <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-pulse"></div>
                        <div class="relative w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
                          <img
                            v-if="medal.imageUrl"
                            :src="medal.imageUrl"
                            :alt="medal.name"
                            class="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          />
                          <Icon v-else name="mdi:medal" class="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        </div>
                      </div>

                      <!-- Текст -->
                      <div class="flex-1 min-w-0">
                        <div class="text-emerald-400 font-mono text-xs font-bold tracking-wider uppercase mb-0.5">Значок получен</div>
                        <div class="text-white font-semibold text-sm sm:text-base break-words">{{ medal.name }}</div>
                        <div v-if="medal.description" class="text-slate-400 font-mono text-xs mt-1 leading-relaxed">{{ medal.description }}</div>
                      </div>
                    </div>

                    <!-- Кнопка надеть / снять -->
                    <button
                      @click="toggleEquip"
                      class="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono text-sm font-semibold transition-all border"
                      :class="isEquipped
                        ? 'bg-slate-700 border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50'"
                    >
                      <span
                        class="w-2 h-2 rounded-full"
                        :class="isEquipped ? 'bg-slate-400 animate-pulse' : 'bg-emerald-400'"
                      ></span>
                      {{ isEquipped ? '$ unequip_badge.sh' : '$ equip_badge.sh' }}
                    </button>

                    <!-- Индикатор надета -->
                    <div v-if="isEquipped" class="mt-3 flex items-center justify-center gap-2 text-emerald-400 font-mono text-xs">
                      <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block"></span>
                      Медалька надета на аватар
                    </div>
                  </div>
                </div>
              </template>
              <!-- ===== КОНЕЦ БЛОКА МЕДАЛИ ===== -->

              <!-- Кнопки действий -->
              <div class="flex flex-col sm:flex-row gap-3">
                <NuxtLink to="/profile" class="flex-1">
                  <button class="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl font-mono text-sm transition-all">
                    $ profile.sh
                  </button>
                </NuxtLink>
                <NuxtLink to="/courses" class="flex-1">
                  <button class="w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 rounded-xl font-mono text-sm transition-all">
                    $ other_courses.sh
                  </button>
                </NuxtLink>
              </div>
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
  show:          { type: Boolean, default: false },
  courseTitle:   { type: String,  default: '' },
  certification: { type: Object,  default: null },
  medal:         { type: Object,  default: null }   // ← добавлен проп
})

const emit = defineEmits(['close', 'equip'])          // ← добавлен emit

const config = useRuntimeConfig()
const downloading = ref(false)

// ─── Equip state ────────────────────────────────────────────────────────────
const EQUIP_KEY = 'equippedBadge'

const isEquipped = computed(() => {
  if (!props.medal) return false
  try {
    const raw = localStorage.getItem(EQUIP_KEY)
    return raw ? JSON.parse(raw)?.id === props.medal.id : false
  } catch {
    return false
  }
})

const toggleEquip = () => {
  if (!props.medal) return
  emit('equip', props.medal)   // родитель сам пишет в localStorage и диспатчит событие
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

// ─── Download PDF (с токеном) ────────────────────────────────────────────────
const handleDownload = async () => {
  if (!props.certification?.certificateCode || downloading.value) return
  downloading.value = true
  try {
    const apiBase = config.public.apiBase || config.public.baseURL || ''
    const url = `${apiBase}/certifications/${props.certification.certificateCode}/pdf`

    // Получаем токен из localStorage (ключ зависит от вашего useAuth)
    const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''

    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })

    if (!response.ok) {
      console.error('PDF download failed:', response.status)
      return
    }

    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = `certificate-${props.certification.certificateCode}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  } finally {
    setTimeout(() => { downloading.value = false }, 1500)
  }
}

// ─── Keyboard & scroll lock ──────────────────────────────────────────────────
onMounted(() => {
  const onKeydown = (e) => { if (e.key === 'Escape') emit('close') }
  window.addEventListener('keydown', onKeydown)
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
})

watch(() => props.show, (val) => {
  if (process.client) document.body.style.overflow = val ? 'hidden' : ''
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

@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin-slow 4s linear infinite; }
</style>