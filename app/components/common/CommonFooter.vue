<template>
  <footer class="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
    <div class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <!-- О платформе -->
        <div class="lg:col-span-2">
          <div class="flex items-center mb-4">
            <span class="text-2xl font-bold font-mono">NetCourse</span>
          </div>
          <p class="text-slate-300 leading-relaxed max-w-md font-mono text-sm">
            Образовательная платформа с курсами и тестами по сетевым технологиям, 
            программированию и кибербезопасности для системного и последовательного обучения.
          </p>

          <!-- Социальные сети -->
          <div class="flex space-x-4 mt-6">
            <a 
              href="https://www.instagram.com/nikita_petrunin3?igsh=ZWdwY2dzMmhiN3Ez" 
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 bg-slate-700 hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors"
            >
              <img 
                src="https://th.bing.com/th/id/R.26d9974a1feec9905a4e0d5e5ddf8db6?rik=Og1ujXM2C1AJHQ&riu=http%3a%2f%2fupload.wikimedia.org%2fwikipedia%2fcommons%2fa%2fa5%2fInstagram_icon.png&ehk=1%2fZWXYn2nN%2fR80TOtcKH5SsdLkkUvMLrB%2fHUXRDHk9I%3d&risl=&pid=ImgRaw&r=0" 
                class="w-5 h-5"
                alt="Instagram"
              />
            </a>
            <a 
              href="https://www.x.com/__motya" 
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 bg-slate-700 hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors"
            >
              <img 
                src="https://img.icons8.com/?size=1200&id=yoQabS8l0qpr&format=png" 
                class="w-5 h-5"
                alt="X (Twitter)"
              />
            </a>
            <a 
              href="https://web.telegram.org/" 
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 bg-slate-700 hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors"
            >
              <img 
                src="https://cdn.worldvectorlogo.com/logos/telegram.svg" 
                class="w-5 h-5"
                alt="Telegram"
              />
            </a>
          </div>
        </div>

        <!-- Навигация -->
        <div>
          <h3 class="text-lg font-semibold mb-4 font-mono">{{ '<navigation/>' }}</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="text-slate-300 hover:text-emerald-400 transition-colors font-mono text-sm">
                Главная
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/courses" class="text-slate-300 hover:text-emerald-400 transition-colors font-mono text-sm">
                Курсы
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="text-slate-300 hover:text-emerald-400 transition-colors font-mono text-sm">
                О нас
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Контакты -->
        <div>
          <h3 class="text-lg font-semibold mb-4 font-mono">{{ '<contacts/>' }}</h3>
          <ul class="space-y-3 text-slate-300 font-mono text-sm">
            <li class="flex items-center">
              <span class="w-5 h-5 bg-emerald-500 rounded-full mr-3 flex items-center justify-center text-xs">📧</span>
              nikitapetrunin296@gmail.com
            </li>
            <li class="flex items-center">
              <span class="w-5 h-5 bg-emerald-500 rounded-full mr-3 flex items-center justify-center text-xs">📱</span>
              +7 708 864 96 30
            </li>
            <li class="flex items-center">
              <span class="w-5 h-5 bg-emerald-500 rounded-full mr-3 flex items-center justify-center text-xs">📍</span>
              Астана, Казахстан
            </li>
          </ul>
        </div>

      </div>

      <!-- Подписка на обновления -->
      <div class="mt-12 pt-8 border-t border-slate-700">
        <div class="max-w-md">
          <h4 class="text-lg font-semibold mb-4 font-mono">{{ '// subscribe_updates' }}</h4>
          <div class="flex flex-col sm:flex-row gap-3">
            <input 
              v-model="subscribeEmail"
              type="email" 
              placeholder="Ваш email"
              class="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors font-mono text-sm"
            />
            <button 
              @click="handleSubscribe"
              class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 rounded-lg font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg hover:shadow-xl font-mono"
            >
              {{ '$ subscribe' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Нижняя часть -->
      <div class="mt-12 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center">
        <p class="text-slate-400 text-sm font-mono">
          © 2026 NetCourse <span class="text-emerald-500">// powered by EVC </span>
        </p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <NuxtLink to="/privacypolicy" class="text-slate-400 hover:text-emerald-400 transition-colors text-sm font-mono">
            privacy_policy
          </NuxtLink>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
const subscribeEmail = ref('')

const handleSubscribe = () => {
  if (subscribeEmail.value && subscribeEmail.value.includes('@')) {
    // Mock подписка - в реальном проекте отправишь на сервер
    alert(`Спасибо за подписку! Email: ${subscribeEmail.value}`)
    subscribeEmail.value = ''
  } else {
    alert('Пожалуйста, введите корректный email')
  }
}
</script>