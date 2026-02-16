<<<<<<< HEAD
<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md">
      <!-- Card Container -->
      <div class="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
        <!-- Header Section -->
        <div class="bg-primary px-8 py-10 text-center">
          <div class="w-16 h-16 bg-primary-foreground/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-primary-foreground mb-2">Bienvenido</h1>
          <p class="text-primary-foreground/80 text-sm">Inicia sesión para continuar</p>
        </div>

        <!-- Form Section -->
        <form @submit.prevent="handleSumbit" class="px-8 py-8 space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label 
              for="email" 
              class="text-sm font-medium text-foreground block"
            >
              Correo electrónico
            </label>
            <Input
              id="email"
              v-model="credentials.email"
              type="email"
              placeholder="ejemplo@correo.com"
              class="w-full"
              required
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label 
              for="password"
              class="text-sm font-medium text-foreground block"
            >
              Contraseña
            </label>
            <Input
              id="password"
              v-model="credentials.password"
              type="password"
              placeholder="••••••••"
              class="w-full"
              required
            />
          </div>

          <!-- Forgot Password Link -->
          <div class="flex items-center justify-end">
            <a href="#" class="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Iniciar sesión
          </Button>

        </form>
      </div>

      <!-- Footer Text -->
      <p class="text-center text-sm text-muted-foreground mt-6">
        © 2026 SIMS. Todos los derechos reservados.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composable/useAuth';
import type { AuthRequest } from '../interface/auth.iterfaces';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const router = useRouter();

const {
    login
} = useAuth();

const credentials = ref<AuthRequest>({
    email: '',
    password: ''
})


async function handleSumbit(){
    const response = await login(credentials.value);
    
    if(response && response.status === 200){
        router.push({name: 'home'})
    }
}
=======
<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md">
      <!-- Card Container -->
      <div class="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
        <!-- Header Section -->
        <div class="bg-primary px-8 py-10 text-center">
          <div class="w-16 h-16 bg-primary-foreground/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-primary-foreground mb-2">Bienvenido</h1>
          <p class="text-primary-foreground/80 text-sm">Inicia sesión para continuar</p>
        </div>

        <!-- Form Section -->
        <form @submit.prevent="handleSumbit" class="px-8 py-8 space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label 
              for="email" 
              class="text-sm font-medium text-foreground block"
            >
              Correo electrónico
            </label>
            <Input
              id="email"
              v-model="credentials.email"
              type="email"
              placeholder="ejemplo@correo.com"
              class="w-full"
              required
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label 
              for="password"
              class="text-sm font-medium text-foreground block"
            >
              Contraseña
            </label>
            <Input
              id="password"
              v-model="credentials.password"
              type="password"
              placeholder="••••••••"
              class="w-full"
              required
            />
          </div>

          <!-- Forgot Password Link -->
          <div class="flex items-center justify-end">
            <a href="#" class="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Iniciar sesión
          </Button>

        </form>
      </div>

      <!-- Footer Text -->
      <p class="text-center text-sm text-muted-foreground mt-6">
        © 2026 SIMS. Todos los derechos reservados.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composable/useAuth';
import type { AuthRequest } from '../interface/auth.iterfaces';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const router = useRouter();

const {
    login
} = useAuth();

const credentials = ref<AuthRequest>({
    email: '',
    password: ''
})


async function handleSumbit(){
    const response = await login(credentials.value);
    
    if(response && response.status === 200){
        router.push({name: 'home'})
    }else{
      console.log(response)
    }
}
>>>>>>> ce2c756203c1f21dc64eddaf0ce60e5c439b2cfb
</script>