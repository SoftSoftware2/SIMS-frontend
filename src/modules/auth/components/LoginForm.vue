<template>
    <div class="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div class="mb-8 text-center">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
            <p class="text-gray-600">Enter your credentials to access</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email Field -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <input
                    id="email"
                    v-model="credentials.email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    :class="{ 'border-red-500': errors.email }"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                    {{ errors.email }}
                </p>
            </div>

            <!-- Password Field -->
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <div class="relative">
                    <input
                        id="password"
                        v-model="credentials.password"
                        :type="showPassword ? 'text' : 'password'"
                        required
                        placeholder="••••••••"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                        :class="{ 'border-red-500': errors.password }"
                    />
                    <button
                        type="button"
                        @click="togglePasswordVisibility"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    </button>
                </div>
                <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                    {{ errors.password }}
                </p>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input
                        id="remember"
                        v-model="rememberMe"
                        type="checkbox"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="remember" class="ml-2 block text-sm text-gray-700">
                        Remember me
                    </label>
                </div>
                <a href="#" class="text-sm text-blue-600 hover:text-blue-500">
                    Forgot your password?
                </a>
            </div>

            <!-- Submit Button -->
            <Button
                type="submit"
                class="w-full"
                :disabled="isSubmitting"
            >
                <span v-if="!isSubmitting">Sign In</span>
                <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                </span>
            </Button>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
                Don't have an account? 
                <a href="#" class="text-blue-600 hover:text-blue-500 font-medium">
                    Sign up
                </a>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'


// State
const credentials = reactive<Credentials>({
    email: '',
    password: ''
})

const errors = reactive({
    email: '',
    password: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)
const isSubmitting = ref(false)

// Methods
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const validateForm = (): boolean => {
    errors.email = ''
    errors.password = ''
    let isValid = true

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!credentials.email) {
        errors.email = 'Email is required'
        isValid = false
    } else if (!emailRegex.test(credentials.email)) {
        errors.email = 'Invalid email'
        isValid = false
    }

    // Password validation
    if (!credentials.password) {
        errors.password = 'Password is required'
        isValid = false
    } else if (credentials.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
        isValid = false
    }

    return isValid
}

const handleSubmit = () => {
    if (validateForm()) {
        isSubmitting.value = true
                
        // Reset isSubmitting after a short delay (the parent component should handle this)
        setTimeout(() => {
            isSubmitting.value = false
        }, 2000)
    }
}

// Expose method to reset form from parent
defineExpose({
    resetForm: () => {
        credentials.email = ''
        credentials.password = ''
        errors.email = ''
        errors.password = ''
        isSubmitting.value = false
    }
})
</script>
