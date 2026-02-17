<template>
  <section class="py-20 px-6 bg-slate-900 relative">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:60px_60px]"></div>
    
    <div class="max-w-7xl mx-auto relative z-10">
      
      <div class="text-center mb-16">
        <div class="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg mb-6 font-mono text-sm text-emerald-500">
          {{ '// FEATURES_MODULE.init()' }}
        </div>
        <h2 class="text-4xl font-bold text-white mb-4">
          Инструменты профессионала
        </h2>
        <p class="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
          Всё необходимое для изучения и практики сетевых технологий
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(feature, idx) in features" 
          :key="idx" 
          class="group bg-slate-800 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="text-4xl" v-html="feature.icon"></div>
            <span 
              :class="[
                'px-2 py-1 rounded text-xs font-mono',
                feature.status === 'active' 
                  ? 'bg-emerald-500/20 text-emerald-500' 
                  : 'bg-yellow-500/20 text-yellow-500'
              ]"
            >
              {{ feature.status }}
            </span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2 font-mono">
            {{ feature.title }}
          </h3>
          <p class="text-slate-400 text-sm leading-relaxed mb-4">
            {{ feature.desc }}
          </p>
          <div class="pt-4 border-t border-emerald-500/20">
            <div class="text-xs font-mono text-emerald-500">
              {{ '> ' + feature.tech }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Иконки в виде SVG (простые замены lucide-react)
const features = [
  {
    icon: `<svg class="w-8 h-8 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>`,
    title: "Основы OSI",
    desc: "Изучение модели OSI, принципов работы сетей, TCP/IP, маршрутизации и коммутации",
    tech: "Cisco Packet Tracer | GNS3",
    status: "active"
  },
  {
    icon: `<svg class="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>`,
    title: "Основы Python",
    desc: "Базовый синтаксис Python, работа с переменными, условиями, циклами и автоматизация сетевых задач",
    tech: "Python | VS Code | Netmiko",
    status: "active"
  },
  {
    icon: `<svg class="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>`,
    title: "Начальная кибербезопасность",
    desc: "Основы информационной безопасности, защита сетей, настройка firewall, VPN и анализ угроз",
    tech: "pfSense | Wireshark | Snort",
    status: "active"
  }
]
</script>