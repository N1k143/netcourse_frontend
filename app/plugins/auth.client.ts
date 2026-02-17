export default defineNuxtPlugin(() => {
  const { initialize } = useAuth()

  initialize()
})