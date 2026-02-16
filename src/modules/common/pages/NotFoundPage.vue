<template>
    <div class="flex flex-col items-center justify-center min-h-screen liniar-gradient-to-b from-gray-50 to-gray-100">
        <div class="text-center px-4">
            <!-- 404 Number -->
            <h1 class="text-9xl font-bold text-gray-800 mb-4">404</h1>
            
            <!-- Error Message -->
            <h2 class="text-3xl font-semibold text-gray-700 mb-4">
                Página no encontrada
            </h2>
            
            <p class="text-gray-600 mb-8 max-w-md mx-auto">
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
            
            <!-- Action Buttons -->
            <div class="flex gap-4 justify-center">
                <button 
                    @click="goHome"
                    class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                    Volver al inicio
                </button>
                <button 
                    @click="goBack"
                    class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                    Página anterior
                </button>
            </div>
        </div>
        
        <!-- Decorative Icon -->
        <div class="mt-12 text-gray-300">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-32 w-32" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="1" 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
    router.push('/')
}

const goBack = () => {
    router.back()
}
</script>
