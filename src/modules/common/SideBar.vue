<template>
    <aside class="fixed left-0 top-20 h-[calc(100vh-5rem)] bg-gray-100 border-r-2 border-gray-200 transition-all duration-300 w-16 min-w-[56px] md:min-w-[180px] flex flex-col items-center md:items-stretch z-40">
        <div class="h-full w-full px-1 md:px-3 py-4 overflow-y-auto flex flex-col gap-4">
            <router-link v-for="route in routes" :to="{ name: route.route}" 
            class="flex p-2 hover:bg-gray-200 ">
                <span style="cursor: pointer;" v-html="route.icon"></span><span class="capitalize">{{ route.name }}</span>
            </router-link>
        </div>
    </aside>
</template>

<script setup lang="ts">

const routes = [
    {
        route: 'example',
        name: 'example',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"/></svg>`,
    }
]

</script>