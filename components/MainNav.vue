<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Icon } from '@iconify/vue'
</script>

<template>
    <nav :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
        <div class="flex justify-between items-center pl-4 cursor-pointer" @click="$router.push('/')">
            <h4 class="font-bold ml-5 "> Home ||</h4>
            <Icon icon="simple-icons:googlehome" class="ml-2" />
        </div>
        <NuxtLink to="/auth">
            login
        </NuxtLink>
        <NuxtLink to="/auth">
            Signup
        </NuxtLink>
        <!-- <a href="#" class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Products
        </a>
        <a href="#" class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Settings
        </a> -->
    </nav>
</template>

<style scoped>
</style>