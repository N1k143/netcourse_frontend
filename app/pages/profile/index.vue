<template>
  <main class="min-h-screen bg-slate-950 pt-24 sm:pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">

    <!-- Badge viewer modal -->
    <Transition name="modal-fade">
      <div v-if="viewingBadge" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="viewingBadge = null">
        <div class="absolute inset-0 bg-slate-950/85 backdrop-blur-md"></div>
        <Transition name="modal-scale">
          <div v-if="viewingBadge" class="relative bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl shadow-emerald-500/5 text-center overflow-hidden">
            <!-- Grid bg -->
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:24px_24px] rounded-2xl pointer-events-none"></div>
            <!-- Top glow -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

            <!-- Close -->
            <button @click="viewingBadge = null" class="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all">
              <Icon name="mdi:close" class="w-3.5 h-3.5" />
            </button>

            <!-- Terminal dots -->
            <div class="relative flex items-center gap-1.5 mb-6">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-slate-600 font-mono text-xs ml-1">badge_viewer</span>
            </div>

            <!-- Badge image -->
            <div class="relative mx-auto mb-5 w-28 h-28 flex items-center justify-center">
              <div class="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-pulse"></div>
              <div class="absolute inset-4 rounded-full bg-emerald-500/5"></div>
              <img
                v-if="viewingBadge.imageUrl"
                :src="viewingBadge.imageUrl"
                :alt="viewingBadge.name"
                class="relative w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              />
              <Icon v-else name="mdi:medal" class="relative w-16 h-16 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
            </div>

            <!-- Info -->
            <h3 class="relative text-lg font-bold text-white font-mono mb-2">{{ viewingBadge.name }}</h3>
            <p v-if="viewingBadge.description" class="relative text-slate-400 text-sm font-mono mb-6 leading-relaxed">{{ viewingBadge.description }}</p>
            <p v-else class="relative text-slate-600 text-xs font-mono mb-6 italic">// описание отсутствует</p>

            <!-- Equipped indicator -->
            <div v-if="equippedBadge?.id === viewingBadge.id" class="relative mb-4 flex items-center justify-center gap-2 text-emerald-400 font-mono text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-2">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block"></span>
              сейчас надета на аватар
            </div>

            <!-- Actions -->
            <div class="relative flex gap-2">
              <button
                @click="toggleEquip(viewingBadge); viewingBadge = null"
                class="flex-1 py-2.5 rounded-xl font-mono text-sm font-semibold transition-all border"
                :class="equippedBadge?.id === viewingBadge.id
                  ? 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50'"
              >
                {{ equippedBadge?.id === viewingBadge.id ? '$ unequip' : '$ equip' }}
              </button>
              <button
                @click="viewingBadge = null"
                class="flex-1 py-2.5 rounded-xl font-mono text-sm text-slate-400 hover:text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all"
              >
                $ close
              </button>
            </div>

            <!-- Bottom line -->
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div class="text-emerald-500 font-mono text-xl mt-4">$ loading_profile...</div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error && !userData" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="text-red-500 font-mono text-xl mb-4">$ error: {{ error }}</div>
        <button @click="loadProfileData" class="px-6 py-3 bg-emerald-500 text-slate-950 rounded-lg font-mono font-bold hover:bg-emerald-400 transition-all">$ retry.sh</button>
      </div>
    </div>

    <!-- Main content -->
    <div v-else>
      <div class="absolute inset-0 opacity-30 pointer-events-none"><NetworkBackground /></div>
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="text-center mb-8 md:mb-12">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            <span class="text-emerald-500 font-mono text-xl sm:text-3xl lg:text-4xl">$ whoami</span>
            <br/>
            <span class="font-sans bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">Профиль пользователя</span>
          </h1>
          <div v-if="error" class="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg max-w-md mx-auto">
            <div class="text-yellow-400 font-mono text-xs sm:text-sm break-words"><span class="text-yellow-500">⚠</span> {{ error }}</div>
          </div>
          <button @click="loadProfileData" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-mono text-sm hover:bg-slate-700 transition-all border border-slate-600 mb-4">$ refresh.sh</button>
        </div>

        <div class="grid lg:grid-cols-3 gap-6 lg:gap-8">

          <!-- ===== SIDEBAR ===== -->
          <div class="lg:col-span-1 space-y-5">

            <!-- user_info -->
            <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-6">
              <div class="flex items-center gap-2 mb-5">
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-slate-500 font-mono text-sm">user_info</span>
              </div>

              <!-- Avatar -->
              <div class="text-center mb-5">
                <!-- Контейнер аватарки + медальки -->
                <div class="relative mx-auto mb-3" style="display: inline-block;">

                  <!-- Аватарка — своя независимая группа ховера -->
                  <div class="group/avatar relative w-16 h-16 sm:w-20 sm:h-20 cursor-pointer" style="display: inline-block;">
                    <div class="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center overflow-hidden">
                      <img v-if="userData?.avatarUrl" :src="userData.avatarUrl" alt="Аватар" class="w-full h-full object-cover" />
                      <span v-else class="text-xl sm:text-2xl text-emerald-500 font-mono">{{ userData?.username?.charAt(0).toUpperCase() || 'U' }}</span>
                    </div>

                    <!-- Кнопка смены аватара — реагирует ТОЛЬКО на ховер group/avatar -->
                    <button
                      @click="$refs.fileInput?.click()"
                      :disabled="avatarLoading"
                      class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200"
                      style="z-index: 5;"
                    >
                      <div v-if="avatarLoading" class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <svg v-else class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Медалька — полностью отдельный элемент со своей группой ховера -->
                  <div
                    v-if="equippedBadge"
                    class="group/badge absolute -bottom-0.5 -right-1 flex items-center justify-center cursor-help"
                    style="width: 36px; height: 36px; z-index: 10;"
                  >
                    <!-- Фон медальки -->
                    <div class="w-9 h-9 rounded-full flex items-center justify-center">
                      <img
                        v-if="equippedBadge.imageUrl"
                        :src="equippedBadge.imageUrl"
                        :alt="equippedBadge.name"
                        class="w-7 h-7 object-contain"
                      />
                      <span v-else class="text-emerald-400 text-base">★</span>
                    </div>

                    <!-- Тултип — появляется ТОЛЬКО при ховере на медальку -->
                    <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150 pointer-events-none z-50 whitespace-nowrap">
                      <div class="bg-slate-900 border border-emerald-500/40 rounded-lg px-3 py-1.5 font-mono text-xs text-emerald-400 shadow-xl shadow-emerald-500/10">
                        {{ equippedBadge.name }}
                      </div>
                      <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style="border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid rgba(16,185,129,0.4);"></div>
                    </div>
                  </div>

                  <input ref="fileInput" type="file" @change="handleAvatarChange" accept="image/*" class="hidden" />
                </div>

                <h2 class="text-lg sm:text-xl font-bold text-white font-mono break-words">{{ userData?.username }}</h2>
                <p class="text-slate-400 text-xs sm:text-sm mt-1 break-all">{{ userData?.email }}</p>

                <!-- Bio -->
                <p v-if="userData?.bio" class="text-slate-300 text-xs mt-3 leading-relaxed italic break-words border-t border-slate-700 pt-3">
                  "{{ userData.bio }}"
                </p>

                <!-- Social Links -->
                <div v-if="socialLinks.length > 0" class="flex flex-wrap justify-center gap-2 mt-4">
                  <a
                    v-for="link in socialLinks"
                    :key="link.id"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 border border-slate-600 hover:border-emerald-500/50 rounded-lg text-slate-300 hover:text-emerald-400 transition-all"
                    :title="link.url"
                  >
                    <img v-if="link.platform === 'github'" src="https://cdn-icons-png.flaticon.com/256/25/25231.png" alt="GitHub" class="w-4 h-4 object-contain brightness-0 invert" />
                    <img v-else-if="link.platform === 'twitter'" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ3X0LHh-DqOD8MPrmr8K0XtCnIH6ftjqFQw&s" alt="X" class="w-4 h-4 object-contain rounded-sm" />
                    <img v-else-if="link.platform === 'youtube'" src="https://static.vecteezy.com/system/resources/thumbnails/018/930/572/small_2x/youtube-logo-youtube-icon-transparent-free-png.png" alt="YouTube" class="w-4 h-4 object-contain" />
                    <Icon v-else-if="link.platform === 'website'" name="mdi:web" class="w-4 h-4" />
                    <Icon v-else name="mdi:link-variant" class="w-4 h-4" />
                    <span class="font-mono text-xs">{{ link.platform }}</span>
                  </a>
                </div>
              </div>

              <!-- Stats -->
              <div class="space-y-2.5 border-t border-emerald-500/20 pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400 font-mono text-sm">Уровень:</span>
                  <span class="text-emerald-500 font-mono text-sm">{{ userData?.level }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400 font-mono text-sm">В системе:</span>
                  <span class="text-slate-300 font-mono text-sm">{{ userData?.joinDate }}</span>
                </div>
              </div>

              <!-- Progress -->
              <div class="border-t border-emerald-500/20 pt-4 mt-3">
                <div class="flex justify-between text-slate-400 font-mono text-xs mb-2">
                  <span>Общий прогресс</span>
                  <span>{{ userData?.progress || 0 }}%</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-2">
                  <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" :style="{ width: `${userData?.progress || 0}%` }"></div>
                </div>
              </div>

              <!-- Buttons -->
              <div class="border-t border-emerald-500/20 pt-4 mt-4 space-y-3">
                <NuxtLink to="/profile/edit">
                  <button class="w-full px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-mono hover:bg-slate-700 transition-all border border-slate-600 hover:border-emerald-500/50 text-sm">$ edit_profile.sh</button>
                </NuxtLink>
                <button @click="handleLogout" class="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-mono hover:bg-red-500/30 transition-all border border-red-500/30 text-sm">$ logout.sh</button>
              </div>
            </div>

            <!-- ===== BADGES ===== -->
            <div class="bg-slate-900 border border-emerald-500/30 rounded-xl overflow-hidden">
              <!-- Header -->
              <div class="flex items-center gap-2 px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-slate-800">
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-slate-500 font-mono text-sm">badges</span>
                <div class="ml-auto flex items-center gap-2">
                  <span class="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{{ badges.length }}</span>
                </div>
              </div>

              <!-- Empty state -->
              <div v-if="badges.length === 0" class="text-center py-10 px-4">
                <div class="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                  <Icon name="mdi:medal-outline" class="w-7 h-7 text-slate-600" />
                </div>
                <div class="text-slate-500 font-mono text-sm">Пока нет значков</div>
                <div class="text-slate-600 font-mono text-xs mt-1">Завершите курс, чтобы получить!</div>
              </div>

              <!-- Badges grid -->
              <div v-else class="p-4 sm:p-5">
                <div class="grid grid-cols-2 gap-2.5">
                  <button
                    v-for="item in badges"
                    :key="item.id"
                    @click="viewingBadge = item.badge"
                    class="group relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-center overflow-hidden"
                    :class="equippedBadge?.id === item.badge.id
                      ? 'bg-emerald-500/8 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/20 hover:bg-slate-800'"
                  >
                    <!-- Equipped glow bg -->
                    <div v-if="equippedBadge?.id === item.badge.id" class="absolute inset-0 bg-emerald-500/5 pointer-events-none"></div>
                    <div v-if="equippedBadge?.id === item.badge.id" class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>

                    <!-- Icon -->
                    <div
                      class="relative w-12 h-12 rounded-full flex items-center justify-center border transition-all"
                      :class="equippedBadge?.id === item.badge.id
                        ? 'bg-emerald-500/15 border-emerald-500/30'
                        : 'bg-slate-700/50 border-slate-600/30 group-hover:border-emerald-500/20'"
                    >
                      <div v-if="equippedBadge?.id === item.badge.id" class="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse"></div>
                      <img v-if="item.badge.imageUrl" :src="item.badge.imageUrl" :alt="item.badge.name" class="relative w-7 h-7 object-contain" />
                      <Icon v-else name="mdi:medal" class="relative w-6 h-6" :class="equippedBadge?.id === item.badge.id ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-400'" />
                    </div>

                    <!-- Name -->
                    <div class="font-mono text-xs font-semibold leading-tight line-clamp-2 transition-colors" :class="equippedBadge?.id === item.badge.id ? 'text-emerald-300' : 'text-slate-300 group-hover:text-white'">
                      {{ item.badge.name }}
                    </div>

                    <!-- Equipped pill -->
                    <div v-if="equippedBadge?.id === item.badge.id" class="flex items-center gap-1 text-emerald-400 font-mono text-xs">
                      <span class="w-1 h-1 bg-emerald-400 rounded-full animate-pulse inline-block"></span>
                      надета
                    </div>
                    <div v-else class="text-slate-600 font-mono text-xs group-hover:text-slate-500 transition-colors">надеть</div>
                  </button>
                </div>
              </div>
            </div>

            <!-- certifications -->
            <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-5">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-slate-500 font-mono text-sm">certifications</span>
                <span class="ml-auto text-yellow-400 font-mono text-xs bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">{{ certifications.length }}</span>
              </div>

              <div v-if="certifications.length > 0" class="space-y-2">
                <div v-for="cert in certifications" :key="cert.id" class="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:border-yellow-500/40 transition-all">
                  <div class="flex items-start gap-2">
                    <Icon name="mdi:certificate-outline" class="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <div class="min-w-0 flex-1">
                      <div class="text-white font-mono text-xs font-semibold leading-tight break-words">{{ cert.course?.title }}</div>
                      <div class="text-slate-500 font-mono text-xs mt-0.5">{{ formatDate(cert.issuedAt) }}</div>
                      <div class="text-slate-600 font-mono text-xs mt-0.5 truncate">Код: {{ cert.certificateCode }}</div>
                      <button
                        @click="downloadCertificate(cert.certificateCode)"
                        :disabled="downloadingCertCode === cert.certificateCode"
                        class="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 hover:border-yellow-500/70 text-yellow-400 hover:text-yellow-300 rounded-lg font-mono text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div v-if="downloadingCertCode === cert.certificateCode" class="w-3 h-3 border border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                        <Icon v-else name="mdi:download" class="w-3 h-3" />
                        <span>{{ downloadingCertCode === cert.certificateCode ? 'Загрузка...' : '$ download.pdf' }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-6">
                <Icon name="mdi:certificate-outline" class="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <div class="text-slate-500 font-mono text-xs">Пока нет сертификатов</div>
                <div class="text-slate-600 font-mono text-xs mt-1">Завершите курс, чтобы получить!</div>
              </div>
            </div>

          </div>
          <!-- ===== END SIDEBAR ===== -->

          <!-- ===== MAIN CONTENT ===== -->
          <div class="lg:col-span-2 space-y-6 lg:space-y-8">

            <!-- Active Courses -->
            <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-6">
              <div class="flex items-center gap-2 mb-5">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-slate-500 font-mono text-sm">active_courses</span>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-white mb-4 font-mono">Активные курсы ({{ currentCourses.length }})</h3>

              <div v-if="currentCourses.length > 0" class="space-y-4">
                <div v-for="course in currentCourses" :key="course.id" class="bg-slate-800 border border-slate-600 rounded-lg p-3 sm:p-4">
                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <h4 class="text-white font-medium text-sm sm:text-base break-words">{{ course.title }}</h4>
                    <span class="text-slate-400 text-xs sm:text-sm whitespace-nowrap">Прогресс: {{ course.progress || 0 }}%</span>
                  </div>
                  <div class="w-full bg-slate-700 rounded-full h-2 mb-3">
                    <div class="bg-emerald-500 h-2 rounded-full transition-all duration-1000" :style="{ width: `${course.progress || 0}%` }"></div>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2">
                    <NuxtLink :to="`/courses/${course.id}`" class="flex-1 px-3 sm:px-4 py-2 bg-emerald-500 text-slate-950 rounded-lg font-mono font-bold text-xs sm:text-sm hover:bg-emerald-400 transition-all text-center flex items-center justify-center gap-2">
                      <span class="w-2 h-2 bg-slate-950 rounded-full" :class="{ 'animate-pulse': course.status === 'in_progress' }"></span>
                      {{ course.status === 'completed' ? '> review_course.sh' : course.status === 'in_progress' ? '> continue.sh' : '> start.sh' }}
                    </NuxtLink>
                    <button @click="handleUnenroll(course.id)" :disabled="unenrollingCourseId === course.id" class="px-3 sm:px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-mono text-xs sm:text-sm hover:bg-red-500/30 transition-all border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                      <div v-if="unenrollingCourseId === course.id" class="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      <span v-else>$ unenroll.sh</span>
                    </button>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8">
                <div class="text-slate-400 font-mono mb-4 text-sm sm:text-base">Нет активных курсов</div>
                <NuxtLink to="/courses" class="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-slate-950 rounded-lg font-mono font-bold text-sm sm:text-base hover:bg-emerald-400 transition-all">$ browse_courses.sh</NuxtLink>
              </div>
            </div>

            <!-- Completed Courses -->
            <div class="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-6">
              <div class="flex items-center gap-2 mb-5">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-slate-500 font-mono text-sm">completed_courses</span>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-white mb-4 font-mono">Завершенные курсы ({{ completedCourses.length }})</h3>

              <div v-if="completedCourses.length > 0" class="space-y-3">
                <div v-for="course in completedCourses" :key="course.id" class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3 sm:p-4">
                  <h4 class="text-white font-medium text-sm sm:text-base break-words">{{ course.title }}</h4>
                  <div class="text-left sm:text-right">
                    <div class="text-emerald-500 font-mono text-base sm:text-lg">{{ course.progress || 100 }}%</div>
                    <div class="text-slate-400 text-xs">Результат</div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8">
                <div class="text-slate-400 font-mono text-sm sm:text-base">Пока нет завершенных курсов</div>
              </div>
            </div>

          </div>
          <!-- ===== END MAIN CONTENT ===== -->

        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const router = useRouter()
const { logout, updateUser } = useAuth()
const { userAPI, coursesAPI, progressAPI, enrollmentsAPI, badgesAPI, certificationsAPI, socialLinksAPI, handleApiError, authAPI } = useApi()
const config = useRuntimeConfig()

const loading = ref(true)
const error = ref('')
const avatarLoading = ref(false)
const unenrollingCourseId = ref(null)
const downloadingCertCode = ref(null)
const userData = ref(null)
const userCourses = ref([])
const badges = ref([])
const certifications = ref([])
const socialLinks = ref([])

// Badge viewer modal
const viewingBadge = ref(null)

// Equipped badge
const EQUIP_KEY = 'equippedBadge'
const equippedBadge = ref(null)

function loadEquipped() {
  try {
    const raw = localStorage.getItem(EQUIP_KEY)
    equippedBadge.value = raw ? JSON.parse(raw) : null
  } catch {
    equippedBadge.value = null
  }
}

function toggleEquip(badge) {
  if (equippedBadge.value?.id === badge.id) {
    equippedBadge.value = null
    localStorage.removeItem(EQUIP_KEY)
  } else {
    equippedBadge.value = badge
    localStorage.setItem(EQUIP_KEY, JSON.stringify(badge))
  }
  window.dispatchEvent(new Event('badge-equipped'))
}

const currentCourses = computed(() => userCourses.value.filter(c => c.progress < 100))
const completedCourses = computed(() => userCourses.value.filter(c => c.progress >= 100))

const calculateLevel = (progress) => {
  if (progress >= 80) return "Продвинутый"
  if (progress >= 50) return "Средний"
  return "Начинающий"
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const downloadCertificate = async (code) => {
  if (!code) return
  downloadingCertCode.value = code
  try {
    const apiBase = config.public.apiBase || config.public.baseURL || ''
    const url = `${apiBase}/certifications/${code}/pdf`
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `certificate-${code}.pdf`)
    link.setAttribute('target', '_blank')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch {
    error.value = 'Не удалось скачать сертификат'
  } finally {
    setTimeout(() => { downloadingCertCode.value = null }, 1000)
  }
}

const loadProfileData = async () => {
  if (!authAPI.isAuthenticated()) { router.push('/login'); return }
  loading.value = true
  error.value = ''

  try {
    const currentUser = authAPI.getCurrentUser()
    if (!currentUser) throw new Error('Пользователь не найден')

    const [userRes, coursesRes, badgesRes, certsRes, linksRes] = await Promise.allSettled([
      userAPI.getById(currentUser.id),
      coursesAPI.getAll(),
      badgesAPI.getMyBadges(),
      certificationsAPI.getMyCertifications(),
      socialLinksAPI.getAll()
    ])

    const userResult = userRes.status === 'fulfilled' ? userRes.value : null
    if (!userResult) throw new Error('Не удалось загрузить данные пользователя')

    authAPI.saveAuthData(localStorage.getItem('authToken'), userResult)

    badges.value = badgesRes.status === 'fulfilled' ? (badgesRes.value || []) : []
    certifications.value = certsRes.status === 'fulfilled' ? (certsRes.value || []) : []
    socialLinks.value = linksRes.status === 'fulfilled' ? (linksRes.value || []) : []

    if (equippedBadge.value) {
      const stillOwned = badges.value.find(b => b.badge.id === equippedBadge.value.id)
      if (!stillOwned) {
        equippedBadge.value = null
        localStorage.removeItem(EQUIP_KEY)
      }
    }

    const coursesResult = coursesRes.status === 'fulfilled' ? coursesRes.value : []
    const coursesWithProgress = await Promise.all(
      coursesResult.map(async (course) => {
        try {
          const progressData = await progressAPI.getByCourse(course.id)
          let p = 0
          if (progressData.status === 'completed') p = 100
          else if (progressData.status === 'in_progress') p = 50
          return { ...course, progress: p, status: progressData.status }
        } catch {
          return { ...course, progress: 0, status: 'not_started' }
        }
      })
    )

    const enrolledIds = userResult.enrollments?.map(e => e.courseId) || []
    userCourses.value = coursesWithProgress.filter(c => enrolledIds.includes(c.id))

    const totalProgress = userCourses.value.length > 0
      ? Math.round(userCourses.value.reduce((sum, c) => sum + c.progress, 0) / userCourses.value.length)
      : 0

    userData.value = {
      username: userResult.username || 'Пользователь',
      email: userResult.email,
      bio: userResult.bio || '',
      joinDate: formatDate(userResult.createdAt),
      level: calculateLevel(totalProgress),
      progress: totalProgress,
      avatarUrl: userResult.avatarUrl,
      id: userResult.id
    }
  } catch (err) {
    console.error('Ошибка загрузки профиля:', err)
    error.value = handleApiError(err, 'Не удалось загрузить данные профиля')
    const currentUser = authAPI.getCurrentUser()
    if (currentUser) {
      userData.value = {
        username: currentUser.username || 'Пользователь',
        email: currentUser.email,
        bio: currentUser.bio || '',
        joinDate: new Date().toLocaleDateString('ru-RU'),
        level: 'Начинающий',
        progress: 0,
        avatarUrl: currentUser.avatarUrl,
        id: currentUser.id
      }
      userCourses.value = []
    }
  } finally {
    loading.value = false
  }
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { error.value = 'Пожалуйста, выберите изображение'; return }
  avatarLoading.value = true
  error.value = ''
  try {
    const reader = new FileReader()
    reader.onloadend = async () => {
      const avatarUrl = reader.result
      const currentUser = authAPI.getCurrentUser()
      if (!currentUser) throw new Error('Пользователь не найден')
      await userAPI.update(currentUser.id, { avatarUrl })
      const updatedUser = { ...currentUser, avatarUrl }
      authAPI.saveAuthData(localStorage.getItem('authToken'), updatedUser)
      updateUser({ avatarUrl })
      userData.value.avatarUrl = avatarUrl
      avatarLoading.value = false
    }
    reader.readAsDataURL(file)
  } catch (err) {
    error.value = handleApiError(err, 'Не удалось обновить аватар')
    avatarLoading.value = false
  }
}

const handleUnenroll = async (courseId) => {
  unenrollingCourseId.value = courseId
  error.value = ''
  try {
    const currentUser = authAPI.getCurrentUser()
    if (!currentUser) throw new Error('Пользователь не найден')
    const enrollment = currentUser.enrollments?.find(e => e.courseId === courseId)
    if (!enrollment) throw new Error('Запись на курс не найдена')
    await enrollmentsAPI.unenroll(courseId, enrollment.id)
    await loadProfileData()
  } catch (err) {
    error.value = handleApiError(err, 'Не удалось отписаться от курса')
  } finally {
    unenrollingCourseId.value = null
  }
}

const handleLogout = async () => { await logout() }

onMounted(() => {
  loadEquipped()
  loadProfileData()
})
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-scale-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-scale-leave-active { transition: all 0.2s ease; }
.modal-scale-enter-from { opacity: 0; transform: scale(0.88) translateY(16px); }
.modal-scale-leave-to { opacity: 0; transform: scale(0.94) translateY(8px); }
</style>