<!-- pages/index.vue -->
<template>
  <main class="bg-slate-950">
    <HeroSection @scroll-to-about="scrollToAbout" />
    <FeaturesSection ref="aboutSection" />

    <!-- CTA-секция, зависимая от авторизации – рендерим только на клиенте -->
    <ClientOnly>
      <section
        class="py-20 px-6 relative overflow-hidden"
        style="background: linear-gradient(to bottom right, #059669, #0891b2);"
      >
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div class="max-w-4xl mx-auto text-center relative z-10">
          <template v-if="isAuthenticated">
            <h2 class="text-4xl font-bold text-white mb-6 font-mono">
              {{ '> WELCOME BACK, ' + (user?.username?.toUpperCase() || 'USER') + '!' }}
            </h2>
            <p class="text-emerald-50 mb-8 font-mono text-sm">
              Продолжайте обучение и развивайте свои навыки
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/courses" class="px-8 py-4 bg-slate-950 text-emerald-500 rounded-lg font-bold hover:bg-slate-900 transition-all hover:shadow-2xl font-mono">
                {{ '$ ls courses/' }}
              </NuxtLink>
              <NuxtLink to="/profile" class="px-8 py-4 bg-transparent text-white rounded-lg font-bold border-2 border-white hover:bg-white hover:text-emerald-600 transition-all font-mono">
                {{ '$ cd ~/profile' }}
              </NuxtLink>
            </div>
          </template>
          <template v-else>
            <h2 class="text-4xl font-bold text-white mb-6 font-mono">
              {{ '> READY TO CONNECT?' }}
            </h2>
            <p class="text-emerald-50 mb-8 font-mono text-sm">
              Присоединяйтесь к сообществу сетевых инженеров
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/register" class="px-8 py-4 bg-slate-950 text-emerald-500 rounded-lg font-bold hover:bg-slate-900 transition-all hover:shadow-2xl font-mono">
                {{ '$ ./register.sh' }}
              </NuxtLink>
              <NuxtLink to="/about" class="px-8 py-4 bg-transparent text-white rounded-lg font-bold border-2 border-white hover:bg-white hover:text-emerald-600 transition-all font-mono">
                {{ '$ man netcourse' }}
              </NuxtLink>
            </div>
          </template>
        </div>
      </section>
      <template #fallback>
        <div class="py-20 px-6 bg-slate-900 flex items-center justify-center">
          <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </template>
    </ClientOnly>

    <!-- Модальное окно выбора интересов – ТОЛЬКО НА КЛИЕНТЕ -->
    <ClientOnly>
      <InterestModal
        :show="showInterestModal"
        @select="handleInterestSelect"
        @close="closeInterestModal"
      />
      <template #fallback>
        <!-- пусто -->
      </template>
    </ClientOnly>
  </main>
</template>

<script setup>
import InterestModal from '~/components/common/InterestModal.vue'

const aboutSection = ref(null)
const router = useRouter()

const { isAuthenticated, user, initialize } = useAuth()

const showInterestModal = ref(false)

onMounted(() => {
  initialize()

  // Проверяем флаг "только что зарегистрировался"
  if (process.client && localStorage.getItem('justRegistered') === 'true') {
    showInterestModal.value = true
  }
})

const handleInterestSelect = (category) => {
  if (process.client) localStorage.removeItem('justRegistered')
  showInterestModal.value = false
  router.push(`/courses?category=${category}`)
}

const closeInterestModal = () => {
  if (process.client) localStorage.removeItem('justRegistered')
  showInterestModal.value = false
}

const scrollToAbout = () => {
  aboutSection.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>