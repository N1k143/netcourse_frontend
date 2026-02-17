<template>
  <div>
    <!-- Toast Container -->
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto"
      >
        <div 
          :class="[
            'flex items-start gap-3 border backdrop-blur-xl rounded-lg p-4 shadow-2xl animate-slideIn min-w-[320px] max-w-md group hover:scale-[1.02] transition-transform duration-300',
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 shadow-emerald-500/20' :
            toast.type === 'error' ? 'bg-red-500/10 border-red-500/50 shadow-red-500/20' :
            'bg-cyan-500/10 border-cyan-500/50 shadow-cyan-500/20'
          ]"
        >
          <div :class="[
            'mt-0.5 animate-pulse',
            toast.type === 'success' ? 'text-emerald-500' :
            toast.type === 'error' ? 'text-red-500' :
            'text-cyan-500'
          ]">
            <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5" />
            <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5" />
            <AlertCircle v-else class="w-5 h-5" />
          </div>

          <div class="flex-1">
            <div :class="[
              'font-mono text-xs mb-1 font-bold tracking-wider',
              toast.type === 'success' ? 'text-emerald-400' :
              toast.type === 'error' ? 'text-red-400' :
              'text-cyan-400'
            ]">
              {{ toast.type === 'success' ? '$ SUCCESS' : toast.type === 'error' ? '$ ERROR' : '$ INFO' }}
            </div>
            <div class="text-slate-200 text-sm leading-relaxed">
              {{ toast.message }}
            </div>
          </div>

          <button
            @click="removeToast(toast.id)"
            :class="[
              'transition-colors duration-200 opacity-70 hover:opacity-100 hover:text-white',
              toast.type === 'success' ? 'text-emerald-400' :
              toast.type === 'error' ? 'text-red-400' :
              'text-cyan-400'
            ]"
          >
            <X class="w-4 h-4" />
          </button>

          <div class="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/50 rounded-b-lg overflow-hidden">
            <div 
              :class="[
                'h-full animate-shrink',
                toast.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                toast.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                'bg-gradient-to-r from-cyan-500 to-cyan-400'
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-vue-next'

const props = defineProps({
  toasts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove'])

const removeToast = (id) => {
  emit('remove', id)
}

// Авто-удаление тостов через 5 секунд
watch(() => props.toasts, (newToasts) => {
  newToasts.forEach(toast => {
    if (!toast.timer) {
      toast.timer = setTimeout(() => {
        removeToast(toast.id)
      }, 5000)
    }
  })
}, { deep: true, immediate: true })
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-slideIn {
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-shrink {
  animation: shrink 5s linear;
}
</style>