<template>
  <div class="min-h-screen">
    <CommonHeader />
    <NuxtPage />
    <CommonFooter />
  </div>
</template>

<script setup>


const router = useRouter()

if (process.client) {
  router.beforeEach(() => {
    window.scrollTo(0, 0)
  })
}
</script>