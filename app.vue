<template>
  <div>
    <MainHeader />
    <main>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
    <MainFooter />
  </div>
</template>

<script setup>
import MainHeader from '~/layouts/MainHeader.vue'
import MainFooter from '~/layouts/MainFooter.vue'

</script>

<style scoped>

</style>
