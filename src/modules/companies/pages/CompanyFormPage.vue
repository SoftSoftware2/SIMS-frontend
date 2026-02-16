<template>
  <div class="container h-full grid grid-rows-[auto_1fr] gap-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        {{ isEditMode ? 'Edit Company' : 'Create Company' }}
      </h1>
    </div>

    <Card class="border-0 shadow-none h-full">
      <CardContent class="h-full pt-0">
        <form @submit.prevent="handleSubmit" class="flex flex-col h-full gap-4 max-w-2xl">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <!-- Name Field -->
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="Company Name"
                @input="clearError('name')"
              />
              <p v-if="errors.name" class="text-sm text-red-500">
                {{ errors.name }}
              </p>
            </div>

            <!-- CIF Field -->
            <div class="space-y-2">
              <Label for="cif">CIF</Label>
              <Input
                id="cif"
                v-model="formData.cif"
                type="text"
                placeholder="CIF"
                @input="clearError('cif')"
              />
              <p v-if="errors.cif" class="text-sm text-red-500">
                {{ errors.cif }}
              </p>
            </div>

            <!-- Description Field -->
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Input
                id="description"
                v-model="formData.description"
                type="text"
                placeholder="Description"
                @input="clearError('description')"
              />
            </div>

            <!-- DB Connection Field -->
            <div class="space-y-2">
              <Label for="db_conexion">DB Connection</Label>
              <Input
                id="db_conexion"
                v-model="formData.db_conexion"
                type="text"
                placeholder="DB Connection"
                @input="clearError('db_conexion')"
              />
              <p v-if="errors.db_conexion" class="text-sm text-red-500">
                {{ errors.db_conexion }}
              </p>
            </div>

            <!-- DB User Field -->
            <div class="space-y-2">
              <Label for="db_user">DB User</Label>
              <Input
                id="db_user"
                v-model="formData.db_user"
                type="text"
                placeholder="DB User"
                @input="clearError('db_user')"
              />
              <p v-if="errors.db_user" class="text-sm text-red-500">
                {{ errors.db_user }}
              </p>
            </div>

            <!-- DB Password Field -->
            <div class="space-y-2">
              <Label for="db_pwd">DB Password</Label>
              <Input
                id="db_pwd"
                v-model="formData.db_pwd"
                type="password"
                placeholder="••••••••"
                @input="clearError('db_pwd')"
              />
              <p v-if="isEditMode" class="text-sm text-muted-foreground">
                Leave empty to keep current password
              </p>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              @click="router.push({name: 'companies-list'})"
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
import { useCompanies } from '../composables/useCompanies';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import type { CreateCompanyRequest } from '../interfaces/company.interface';

const route = useRoute();
const router = useRouter();
const { postCompany, putCompany, getCompanyById } = useCompanies();

const isEditMode = computed(() => !!route.params.id);
const loading = ref(false);

const formData = ref<CreateCompanyRequest>({
  name: '',
  description: '',
  cif: '',
  db_conexion: '',
  db_user: '',
  db_pwd: ''
});

const errors = ref({
  name: '',
  cif: '',
  description: '',
  db_conexion: '',
  db_user: '',
  db_pwd: ''
});

const clearError = (field: keyof typeof errors.value) => {
  errors.value[field] = '';
};

const validateForm = (): boolean => {
  let isValid = true;
  
  // Reset errors
  errors.value = {
    name: '',
    cif: '',
    description: '',
    db_conexion: '',
    db_user: '',
    db_pwd: ''
  };

  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required';
    isValid = false;
  }

  if (!formData.value.cif.trim()) {
    errors.value.cif = 'CIF is required';
    isValid = false;
  }

  if (!formData.value.db_conexion.trim()) {
    errors.value.db_conexion = 'DB Connection is required';
    isValid = false;
  }

  if (!formData.value.db_user.trim()) {
    errors.value.db_user = 'DB User is required';
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
      const companyId = Number(route.params.id);
      await putCompany(companyId, formData.value);
    } else {
      await postCompany(formData.value);
    }
    
    router.push({ name: 'companies-list' });
  } catch (error) {
    console.error('Error saving company:', error);
  } finally {
    loading.value = false;
  }
};

const loadCompany = async () => {
  if (!isEditMode.value) return;
  
  loading.value = true;
  try {
    const companyId = Number(route.params.id);
    const response = await getCompanyById(companyId);
    
    if (response && response.data) {
      formData.value = {
        name: response.data.name,
        description: response.data.description || '',
        cif: response.data.cif,
        db_conexion: response.data.db_conexion,
        db_user: response.data.db_user,
        db_pwd: '' // Don't load password
      };
    }
  } catch (error) {
    console.error('Error loading company:', error);
    router.push({ name: 'companies-list' });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCompany();
});
</script>
