<template>
  <main class="min-h-screen bg-slate-950 pt-32 pb-20 px-6 relative overflow-hidden">
    <div class="absolute inset-0 opacity-30 pointer-events-none">
      <NetworkBackground />
    </div>
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

    <div class="max-w-4xl mx-auto relative z-10">
      <div class="text-center mb-12">
        <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
          <span class="text-emerald-500 font-mono">$ cat</span>
          <br/>
          <span class="font-sans bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
            О проекте
          </span>
        </h1>

        <p class="text-slate-400 font-mono text-sm max-w-2xl mx-auto">
          Информация о платформе и технологиях
        </p>
      </div>

      <div class="flex justify-center">
        <div class="w-full max-w-3xl space-y-8">
          <!-- О платформе -->
          <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-6">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-slate-500 font-mono text-sm">project_info</span>
            </div>

            <h3 class="text-xl font-bold text-white mb-4 font-mono">О платформе</h3>
            
            <div class="text-slate-300 space-y-4">
              <p>
                NetCourse — это современная образовательная платформа для изучения сетевых технологий,
                программирования и основ кибербезопасности, разработанная с использованием
                передовых веб-технологий.
              </p>

              <p>
                Платформа предоставляет структурированные курсы и тестовые задания,
                позволяющие закреплять теорию и проверять уровень полученных знаний.
              </p>

              <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-6">
                <div class="text-emerald-500 mb-2">// Tech Stack:</div>
                <div class="text-slate-400 space-y-1">
                  <div>• Nuxt 3 + Vue 3</div>
                  <div>• Tailwind CSS</div>
                  <div>• Express.js Backend</div>
                  <div>• PostgreSQL Database</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Статистика -->
          <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-6">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-slate-500 font-mono text-sm">stats</span>
            </div>

            <h3 class="text-xl font-bold text-white mb-6 font-mono">Статистика</h3>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-3xl font-bold text-emerald-500 font-mono">500+</div>
                <div class="text-slate-400 text-sm mt-1">Студентов</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-cyan-500 font-mono">15+</div>
                <div class="text-slate-400 text-sm mt-1">Курсов</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-white font-mono">2K+</div>
                <div class="text-slate-400 text-sm mt-1">Часов обучения</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-500 font-mono">95%</div>
                <div class="text-slate-400 text-sm mt-1">Успеваемость</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// SEO meta tags
useHead({
  title: 'О проекте - NetCourse',
  meta: [
    {
      name: 'description',
      content: 'NetCourse — современная образовательная платформа для изучения сетевых технологий, программирования и кибербезопасности'
    }
  ]
})
</script>