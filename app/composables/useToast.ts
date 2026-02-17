// composables/useToast.ts
export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  timer?: NodeJS.Timeout
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info'): number => {
    const id = Date.now()
    toasts.value = [...toasts.value, { id, message, type }]
    
    // Авто-удаление через 5 секунд
    setTimeout(() => {
      removeToast(id)
    }, 5000)
    
    return id
  }

  const removeToast = (id: number): void => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  const success = (message: string): number => addToast(message, 'success')
  const error = (message: string): number => addToast(message, 'error')
  const info = (message: string): number => addToast(message, 'info')

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info
  }
}