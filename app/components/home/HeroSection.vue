<template>
  <section class="pt-32 pb-20 px-6 relative overflow-hidden">
    <div class="absolute inset-0 opacity-30">
      <NetworkBackground />
    </div>
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg mb-4 sm:mb-6 font-mono">
            <span class="text-emerald-500">●</span>
            <span class="text-xs sm:text-sm text-emerald-400">System: Online | Status: Active</span>
          </div>

          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            <span class="text-emerald-500 font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl">root@netcourse:~$</span>
            <br/>
            <span class="font-sans">Мастер сетевых технологий</span>
          </h1>

          <div class="bg-slate-900 border border-emerald-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 font-mono text-xs sm:text-sm">
            <div class="flex items-center gap-2 mb-2 sm:mb-3">
              <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
              <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
              <span class="text-slate-500 ml-2 text-xs">terminal</span>
            </div>
            <div class="space-y-1.5 sm:space-y-2 text-slate-300">
              <div><span class="text-emerald-500">$</span> learn network protocols...</div>
              <div><span class="text-emerald-500">$</span> configure virtual labs...</div>
              <div class="hidden sm:block"><span class="text-emerald-500">$</span> master cisco, juniper & more...</div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-500">$</span> 
                <span class="text-white">./start_career.sh</span>
                <span class="inline-block w-1.5 h-3 sm:w-2 sm:h-4 bg-emerald-500 animate-pulse"></span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
            <NuxtLink to="/courses" class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 text-slate-950 rounded-lg font-bold hover:bg-emerald-400 transition-all cursor-pointer hover:shadow-lg hover:shadow-emerald-500/50 font-mono text-sm sm:text-base text-center">
              {{ '> НАЧАТЬ ОБУЧЕНИЕ' }}
            </NuxtLink>
            <button 
              @click="$emit('scroll-to-about')"
              class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-emerald-500 rounded-lg font-bold border-2 border-emerald-500/50 hover:border-emerald-500 cursor-pointer hover:bg-emerald-500/10 transition-all font-mono text-sm sm:text-base">
              {{ '> EXPLORE' }}
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2 sm:gap-4">
            <div class="bg-slate-900 border border-emerald-500/30 rounded-lg p-3 sm:p-4">
              <div class="text-xl sm:text-2xl font-bold text-emerald-500 font-mono">127+</div>
              <div class="text-[10px] sm:text-xs text-slate-400 font-mono">PROTOCOLS</div>
            </div>
            <div class="bg-slate-900 border border-emerald-500/30 rounded-lg p-3 sm:p-4">
              <div class="text-xl sm:text-2xl font-bold text-emerald-500 font-mono">24/7</div>
              <div class="text-[10px] sm:text-xs text-slate-400 font-mono">UPTIME</div>
            </div>
            <div class="bg-slate-900 border border-emerald-500/30 rounded-lg p-3 sm:p-4">
              <div class="text-xl sm:text-2xl font-bold text-emerald-500 font-mono">10K+</div>
              <div class="text-[10px] sm:text-xs text-slate-400 font-mono">NODES</div>
            </div>
          </div>
        </div>

        <div class="relative mt-8 lg:mt-0">
          <div class="relative bg-state-900 border-2 border-emerald-500/30 rounded-2xl p-8 lg:p-8 shadow-2xl shadow-emerald-500/20">
            <div class="absolute top-2 right-2 sm:top-4 sm:right-4 text-[10px] sm:text-xs text-emerald-500 font-mono">
              ROUTER_01
            </div>

            <div class="space-y-4 sm:space-y-6">
              <div class="flex justify-center items-center gap-4 sm:gap-6 lg:gap-8">
                <div class="relative">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-lg flex items-center justify-center">
                    <div class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-emerald-500 rounded"></div>
                  </div>
                  <div class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full animate-ping"></div>
                </div>
                
                <div class="flex flex-col gap-1.5 sm:gap-2">
                  <div class="h-0.5 w-12 sm:w-16 lg:w-20 bg-emerald-500"></div>
                  <div class="h-0.5 w-12 sm:w-16 lg:w-20 bg-emerald-500"></div>
                  <div class="h-0.5 w-12 sm:w-16 lg:w-20 bg-emerald-500"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  <div v-for="item in 4" :key="item" class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-slate-800 border border-emerald-500/50 rounded flex items-center justify-center">
                    <div class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-emerald-500/50 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 border border-emerald-500/30 rounded-lg p-3 sm:p-4 font-mono text-[10px] sm:text-xs">
                <div class="text-emerald-500 mb-1.5 sm:mb-2">ACTIVE PROTOCOLS:</div>
                <div class="space-y-0.5 sm:space-y-1 text-slate-400">
                  <div class="flex justify-between"><span>TCP/IP</span><span class="text-emerald-500">✓</span></div>
                  <div class="flex justify-between"><span>OSPF</span><span class="text-emerald-500">✓</span></div>
                  <div class="flex justify-between"><span>BGP</span><span class="text-emerald-500">✓</span></div>
                  <div class="flex justify-between"><span>VLAN</span><span class="text-emerald-500">✓</span></div>
                </div>
              </div>

              <div class="bg-slate-800 border border-emerald-500/30 rounded-lg p-3 sm:p-4">
                <div class="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                  <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Packet Flow: Active
                </div>
                <div class="h-1.5 sm:h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div class="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-cyan-500 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['scroll-to-about'])
</script>