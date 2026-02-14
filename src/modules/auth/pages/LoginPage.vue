<template>
<!-- subit.prevent is a submit with the tipical event.preventDefault -->
<form class="grid" @submit.prevent="handleSumbit">
    <label 
        for="email" 
    >
        Email
    </label>
    
    <input 
        type="text" 
        name="email" 
        placeholder="email"
        v-model="credentials.email"
    >
    
    <label 
        for="password"
    >
        Password
    </label>
    
    <input 
        type="text" 
        name="password" 
        placeholder="········"
        v-model="credentials.password"
    >

    <button class="bg-amber-200">
        Test
    </button>
</form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composable/useAuth';
import type { AuthRequest } from '../interface/auth.iterfaces';

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
        router.push('/'); // Cambia '/' por la ruta a la que quieras redirigir
    }
}
</script>