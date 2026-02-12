<template>
    <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <LoginForm @submit="handleLogin" />
    </div>
</template>

<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue'
import type { Credentials } from '../interface/credentials.interface'

const handleLogin = (credentials: Credentials) => {
    // Aquí irá tu lógica de autenticación
    console.log('Login attempt with:', credentials)
    
    // Ejemplo de estructura para cuando implementes la lógica:
    // try {
    //   await authService.login(credentials)
    //   router.push('/dashboard')
    // } catch (error) {
    //   console.error('Login failed:', error)
    // }
}
</script>
