<template>
  <div class="container h-full grid grid-rows-[auto_1fr] gap-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        {{ isEditMode ? 'Edit Administrator' : 'Create Administrator' }}
      </h1>
    </div>

    <Card class="border-0 shadow-none h-full">
      <CardHeader>
      </CardHeader>
      <CardContent class="h-full">
        <form @submit.prevent="handleSubmit" class="grid grid-rows-[1fr_auto] h-full gap-6">
          <div class="grid grid-cols-3 gap-6">
            <!-- Email Field -->
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="ejemplo@correo.com"
                @input="clearError('email')"
              />
              <p v-if="errors.email" class="text-sm text-red-500">
                {{ errors.email }}
              </p>
            </div>

            <!-- Name Field -->
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="Full name"
                @input="clearError('name')"
              />
              <p v-if="errors.name" class="text-sm text-red-500">
                {{ errors.name }}
              </p>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                v-model="formData.password"
                type="password"
                placeholder="••••••••"
                @input="clearError('password')"
              />
              <p v-if="isEditMode && !errors.password" class="text-sm text-muted-foreground">
                Leave empty to keep current password
              </p>
              <p v-if="errors.password" class="text-sm text-red-500">
                {{ errors.password }}
              </p>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              @click="router.push({name: 'admins'})"
            >
              Cancel
            </Button>
            <Button type="submit" :disabled="loading">
              {{ loading ? 'Saving...' : 'Save' }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdmins } from '../composables/useAdmins';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardContent 
} from '@/components/ui/card';
import type { CreateAdminRequest } from '../interfaces/admin.interfaces';

const route = useRoute();
const router = useRouter();
const { postAdmin, putAdmin, getAdminById } = useAdmins();

const isEditMode = computed(() => !!route.params.id);
const loading = ref(false);

const formData = ref<CreateAdminRequest>({
  email: '',
  name: '',
  password: ''
});

const errors = ref({
  email: '',
  name: '',
  password: ''
});

const clearError = (field: keyof typeof errors.value) => {
  errors.value[field] = '';
};

const validateForm = (): boolean => {
  let isValid = true;
  
  // Reset errors
  errors.value = {
    email: '',
    name: '',
    password: ''
  };

  // Validate email
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.value.email)) {
      errors.value.email = 'Invalid email format';
      isValid = false;
    }
  }

  // Validate name
  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required';
    isValid = false;
  }

  // Validate password (only required in create mode)
  if (!isEditMode.value && !formData.value.password) {
    errors.value.password = 'Password is required';
    isValid = false;
  } else if (formData.value.password && formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  
  try {
    if (isEditMode.value) {
      const adminId = Number(route.params.id);
      const updateData: any = {
        email: formData.value.email,
        name: formData.value.name
      };
      
      // Only include password if it was provided
      if (formData.value.password) {
        updateData.password = formData.value.password;
      }
      
      await putAdmin(adminId, updateData);
    } else {
      await postAdmin(formData.value);
    }
    
    router.push({ name: 'admins' });
  } catch (error) {
    console.error('Error saving administrator:', error);
    // You could add a global error message here
  } finally {
    loading.value = false;
  }
};

const loadAdmin = async () => {
  if (!isEditMode.value) return;
  
  loading.value = true;
  try {
    const adminId = Number(route.params.id);
    const response = await getAdminById(adminId);
    
    if (response && response.data) {
      formData.value = {
        email: response.data.email,
        name: response.data.name,
        password: '' // Don't load password
      };
    }
  } catch (error) {
    console.error('Error loading administrator:', error);
    router.push({ name: 'admins' });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadAdmin();
});
</script>
