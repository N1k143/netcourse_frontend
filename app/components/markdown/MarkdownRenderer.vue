<template>
  <div class="w-full overflow-hidden markdown-renderer" ref="rendererRef">
    <MDC :value="content" tag="div" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const rendererRef = ref(null)
let observer = null

const copyToClipboard = async (text, button) => {
  try {
    await navigator.clipboard.writeText(text)
    
    const icon = button.querySelector('.copy-icon')
    if (icon) {
      icon.setAttribute('data-copied', 'true')
      setTimeout(() => {
        icon.setAttribute('data-copied', 'false')
      }, 2000)
    }
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const addLanguageLabels = () => {
  if (!rendererRef.value) return
  
  const codeBlocks = rendererRef.value.querySelectorAll('pre.shiki[class*="language-"]')
  
  codeBlocks.forEach((block) => {
    if (block.dataset.labelAdded === 'true') {
      return
    }
    
    const classList = Array.from(block.classList)
    const langClass = classList.find(cls => cls.startsWith('language-'))
    
    if (langClass) {
      let lang = langClass.replace('language-', '')
      
      const langMap = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'sh': 'bash',
        'shell': 'bash',
        'yml': 'yaml'
      }
      
      lang = langMap[lang] || lang
      
      const controlsWrapper = document.createElement('div')
      controlsWrapper.className = 'code-controls-wrapper'
      
      const copyButton = document.createElement('button')
      copyButton.className = 'code-copy-button'
      copyButton.setAttribute('aria-label', 'Copy code')
      copyButton.innerHTML = `
        <span class="copy-icon" data-copied="false">
          <svg class="copy-default" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg class="copy-success" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      `
      
      const codeElement = block.querySelector('code')
      const codeText = codeElement ? codeElement.textContent : ''
      
      copyButton.addEventListener('click', () => {
        copyToClipboard(codeText, copyButton)
      })
      
      const label = document.createElement('div')
      label.className = 'code-language-label'
      label.textContent = lang
      
      controlsWrapper.appendChild(copyButton)
      controlsWrapper.appendChild(label)
      
      block.parentNode.insertBefore(controlsWrapper, block)
      
      block.dataset.labelAdded = 'true'
    }
  })
}

onMounted(() => {
  setTimeout(() => {
    addLanguageLabels()
  }, 100)
  
  if (rendererRef.value) {
    observer = new MutationObserver(() => {
      addLanguageLabels()
    })
    
    observer.observe(rendererRef.value, {
      childList: true,
      subtree: true
    })
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

watch(() => props.content, () => {
  setTimeout(() => {
    addLanguageLabels()
  }, 100)
})
</script>

<style scoped>

/* ================= HEADINGS ================= */

.markdown-renderer :deep(h1) {
  @apply text-sm sm:text-lg md:text-xl lg:text-2xl
         font-bold text-emerald-400
         mt-4 sm:mt-5 md:mt-6
         mb-2 sm:mb-3 md:mb-4
         border-b border-emerald-500/30
         pb-2 break-words;
}

.markdown-renderer :deep(h2) {
  @apply text-xs sm:text-base md:text-lg lg:text-xl
         font-bold text-emerald-300
         mt-3 sm:mt-4 md:mt-5
         mb-2 sm:mb-3 break-words;
}

.markdown-renderer :deep(h3) {
  @apply text-xs sm:text-sm md:text-base lg:text-lg
         font-bold text-emerald-200
         mt-3 sm:mt-4 mb-2 break-words;
}

.markdown-renderer :deep(h4) {
  @apply text-xs sm:text-sm md:text-base
         font-bold text-emerald-100
         mt-3 mb-2 break-words;
}

/* ================= TEXT ================= */

.markdown-renderer :deep(p) {
  @apply text-slate-300
         text-xs sm:text-sm md:text-base
         leading-relaxed
         mb-3 md:mb-4
         break-words;
}

.markdown-renderer :deep(ul) {
  @apply text-slate-300
         text-xs sm:text-sm md:text-base
         mb-3 md:mb-4
         ml-5 md:ml-6
         list-disc
         space-y-1;
}

.markdown-renderer :deep(ol) {
  @apply text-slate-300
         text-xs sm:text-sm md:text-base
         mb-3 md:mb-4
         ml-5 md:ml-6
         list-decimal
         space-y-1;
}

.markdown-renderer :deep(li) {
  @apply break-words leading-relaxed;
}

.markdown-renderer :deep(blockquote) {
  @apply border-l-4 border-emerald-500
         pl-4
         my-3 md:my-4
         italic text-slate-400
         bg-slate-800/50
         py-2
         text-xs sm:text-sm md:text-base
         break-words;
}

.markdown-renderer :deep(a) {
  @apply text-emerald-400 hover:text-emerald-300 underline break-all;
}

.markdown-renderer :deep(hr) {
  @apply border-slate-700 my-4 md:my-6;
}

/* ================= INLINE CODE ================= */

.markdown-renderer :deep(:not(pre) > code) {
  @apply bg-slate-800
         text-emerald-400
         px-1.5 py-0.5
         rounded
         text-xs
         break-all;
}

/* ================= CODE BLOCK ================= */

.markdown-renderer :deep(pre.shiki) {
  position: relative !important;
  background-color: #1e293b !important;
  border-radius: 0.75rem !important;
  padding: 1rem !important;
  padding-top: 2.2rem !important;
  margin: 1rem 0 !important;
  overflow-x: auto !important;
}

.markdown-renderer :deep(pre.shiki[style]) {
  background-color: #1e293b !important;
}

.markdown-renderer :deep(pre.shiki code) {
  background: transparent !important;
  font-size: 0.875rem !important;
  line-height: 1.6 !important;
  display: block !important;
  min-width: max-content !important;
  white-space: pre !important;
}

/* ================= CODE CONTROLS ================= */

.markdown-renderer :deep(.code-controls-wrapper) {
  position: relative;
  height: 0;
  width: 100%;
  pointer-events: none;
  z-index: 10;
}

.markdown-renderer :deep(.code-language-label) {
  position: absolute;
  top: 0;
  left: 0;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  background-color: #0f172a;
  border-bottom-right-radius: 0.75rem;
  border-top-left-radius: 0.75rem;
  font-family: ui-monospace, monospace;
  text-transform: lowercase;
  pointer-events: auto;
  white-space: nowrap;
}

.markdown-renderer :deep(.code-copy-button) {
  position: absolute;
  top: 6px;
  right: 12px;
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  border-radius: 0.375rem;
}

.markdown-renderer :deep(.code-copy-button:hover) {
  color: #94a3b8;
  background-color: rgba(255, 255, 255, 0.05);
}

.markdown-renderer :deep(.code-copy-button:active) {
  transform: scale(0.95);
}

.markdown-renderer :deep(.copy-icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.markdown-renderer :deep(.copy-icon svg) {
  width: 16px;
  height: 16px;
}

.markdown-renderer :deep(.copy-icon[data-copied="false"] .copy-default) {
  display: block;
}

.markdown-renderer :deep(.copy-icon[data-copied="false"] .copy-success) {
  display: none;
}

.markdown-renderer :deep(.copy-icon[data-copied="true"] .copy-default) {
  display: none;
}

.markdown-renderer :deep(.copy-icon[data-copied="true"] .copy-success) {
  display: block;
  color: #10b981;
}

/* ================= TABLE ================= */

.markdown-renderer :deep(table) {
  @apply border-collapse border border-slate-700
         text-xs sm:text-sm
         min-w-full my-4;
}

.markdown-renderer :deep(th) {
  @apply border border-slate-700
         px-3 py-2
         text-left
         bg-slate-800
         text-emerald-300
         font-mono;
}

.markdown-renderer :deep(td) {
  @apply border border-slate-700
         px-3 py-2
         text-slate-300
         break-words;
}

</style>