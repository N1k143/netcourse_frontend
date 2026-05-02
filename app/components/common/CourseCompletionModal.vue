<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        @click.self="$emit('close')"
      >
        <div class="absolute inset-0 bg-slate-950/90 backdrop-blur-md"></div>

        <Transition name="modal-scale">
          <div
            v-if="show"
            class="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl"
          >
            <!-- Верхний акцент -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent"></div>

            <!-- Закрыть -->
            <button
              @click="$emit('close')"
              class="absolute top-4 right-4 z-10 w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-500 hover:text-white transition-all"
            >
              <Icon name="mdi:close" class="w-3.5 h-3.5" />
            </button>

            <div class="p-6 sm:p-8">

              <!-- Шапка -->
              <div class="flex flex-col items-center text-center mb-8">
                <div class="relative mb-5">
                  <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"></div>
                  <div class="relative w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center">
                    <Icon name="mdi:trophy-award" class="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                <div class="text-emerald-500 font-mono text-[10px] tracking-[0.2em] uppercase mb-2">// course completed</div>
                <h2 class="text-2xl font-bold text-white mb-1">Курс завершён!</h2>
                <p class="text-slate-400 text-sm">
                  Вы успешно прошли
                  <span class="text-emerald-400 font-medium">{{ courseTitle }}</span>
                </p>
              </div>

              <!-- Сертификат -->
              <div class="mb-4">
                <div class="text-slate-600 font-mono text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div class="flex-1 h-px bg-slate-800"></div>
                  certificate
                  <div class="flex-1 h-px bg-slate-800"></div>
                </div>

                <div v-if="certification" class="bg-slate-800/50 border border-yellow-500/20 rounded-xl p-4">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <Icon name="mdi:certificate" class="w-4 h-4 text-yellow-400" />
                    </div>
                    <div class="min-w-0">
                      <div class="text-yellow-400 font-mono text-[10px] uppercase tracking-wider">Сертификат выдан</div>
                      <div class="text-white text-sm font-medium truncate">{{ certification.course?.title || courseTitle }}</div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2 mb-4">
                    <div class="bg-slate-900/60 rounded-lg p-2.5">
                      <div class="text-slate-500 font-mono text-[10px] mb-0.5">Дата</div>
                      <div class="text-slate-200 font-mono text-xs font-medium">{{ formatDate(certification.issuedAt) }}</div>
                    </div>
                    <div class="bg-slate-900/60 rounded-lg p-2.5">
                      <div class="text-slate-500 font-mono text-[10px] mb-0.5">Код</div>
                      <div class="text-slate-200 font-mono text-xs font-medium truncate">{{ certification.certificateCode }}</div>
                    </div>
                  </div>

                  <button
                    @click="handleDownload"
                    :disabled="downloading"
                    class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono text-sm font-bold transition-all bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div v-if="downloading" class="w-3.5 h-3.5 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin"></div>
                    <Icon v-else name="mdi:download" class="w-3.5 h-3.5" />
                    {{ downloading ? 'Загрузка...' : '$ download_certificate.pdf' }}
                  </button>
                </div>

                <div v-else class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                  <div class="w-4 h-4 border-2 border-yellow-400/40 border-t-yellow-400 rounded-full animate-spin shrink-0"></div>
                  <div>
                    <div class="text-slate-300 text-sm">Сертификат формируется</div>
                    <div class="text-slate-500 font-mono text-xs mt-0.5">Обычно занимает несколько секунд</div>
                  </div>
                </div>
              </div>

              <!-- Медаль -->
              <template v-if="medal">
                <div class="text-slate-600 font-mono text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div class="flex-1 h-px bg-slate-800"></div>
                  badge
                  <div class="flex-1 h-px bg-slate-800"></div>
                </div>

                <div class="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-4 mb-4">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="relative shrink-0">
                      <div class="absolute inset-0 bg-emerald-500/15 rounded-full blur-md"></div>
                      <div class="relative w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
                        <img v-if="medal.imageUrl" :src="medal.imageUrl" :alt="medal.name" class="w-7 h-7 object-contain" />
                        <Icon v-else name="mdi:medal" class="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-emerald-400 font-mono text-[10px] uppercase tracking-wider">Значок получен</div>
                      <div class="text-white text-sm font-medium">{{ medal.name }}</div>
                      <div v-if="medal.description" class="text-slate-400 text-xs mt-0.5 leading-relaxed line-clamp-2">{{ medal.description }}</div>
                    </div>
                  </div>

                  <button
                    @click="toggleEquip"
                    :class="[
                      'w-full flex items-center justify-center gap-2 py-2 rounded-lg font-mono text-xs font-semibold transition-all border',
                      isEquipped
                        ? 'bg-slate-700/60 border-slate-600 text-slate-400 hover:text-white'
                        : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                    ]"
                  >
                    <span :class="['w-1.5 h-1.5 rounded-full', isEquipped ? 'bg-slate-400' : 'bg-emerald-400 animate-pulse']"></span>
                    {{ isEquipped ? '$ unequip_badge.sh' : '$ equip_badge.sh' }}
                  </button>

                  <div v-if="isEquipped" class="mt-2 flex items-center justify-center gap-1.5 text-emerald-400 font-mono text-[10px]">
                    <span class="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
                    Медалька надета на аватар
                  </div>
                </div>
              </template>

              <!-- Действия -->
              <div class="flex gap-2 mt-2">
                <NuxtLink to="/profile" class="flex-1">
                  <button class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white rounded-xl font-mono text-xs transition-all">
                    $ profile.sh
                  </button>
                </NuxtLink>
                <NuxtLink to="/courses" class="flex-1">
                  <button class="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 rounded-xl font-mono text-xs transition-all">
                    $ other_courses.sh
                  </button>
                </NuxtLink>
              </div>
            </div>

            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
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
  medal:         { type: Object,  default: null }
})

const emit = defineEmits(['close', 'equip'])

const config = useRuntimeConfig()
const downloading = ref(false)

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
  emit('equip', props.medal)
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

const handleDownload = async () => {
  if (!props.certification?.certificateCode || downloading.value) return
  downloading.value = true
  try {
    const apiBase = config.public.apiBase || config.public.baseURL || ''
    const url = `${apiBase}/certifications/${props.certification.certificateCode}/pdf`
    const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    if (!response.ok) return
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
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }

.modal-scale-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-scale-leave-active { transition: all 0.15s ease; }
.modal-scale-enter-from { opacity: 0; transform: scale(0.9) translateY(12px); }
.modal-scale-leave-to   { opacity: 0; transform: scale(0.96); }
</style>