<template>
    <div>
        <div class="hidden flex-col md:flex">
            <div class="border-b">
                <div class="flex h-16 items-center px-4">
                    <MainNav />
                    <div class="ml-auto flex items-center space-x-4">
                        <ColorMode />
                        <!-- <UserNav /> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-gray">
            <slot />
        </div>

    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>