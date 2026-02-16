<template>
  <div class="container mx-auto py-6">
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>{{ isEditMode ? 'Edit Vehicle Type' : 'Create Vehicle Type' }}</CardTitle>
            <CardDescription>
              {{ isEditMode ? 'Update vehicle type information' : 'Add a new vehicle type to the system' }}
            </CardDescription>
          </div>
          <Button variant="outline" @click="router.back()">
            Cancel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="isLoadingData" class="space-y-4">
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
        </div>

        <form v-else-if="!fetchError" @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Name *</Label>
            <Input
              id="name"
              v-model="formData.name"
              placeholder="Enter vehicle type name"
              :class="{ 'border-red-500': formErrors.name }"
            />
            <p v-if="formErrors.name" class="text-sm text-red-500">
              {{ formErrors.name }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Input
              id="description"
              v-model="formData.description"
              placeholder="Enter description (optional)"
            />
          </div>

          <div v-if="error" class="text-sm text-red-500">
            {{ error }}
          </div>

          <div class="flex justify-end gap-2">
            <Button type="button" variant="outline" @click="router.back()">
              Cancel
            </Button>
            <Button type="submit" :disabled="isLoading">
              <RefreshCw v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isEditMode ? 'Update' : 'Create' }} Vehicle Type
            </Button>
          </div>
        </form>

        <div v-else class="text-red-500">
          Error loading vehicle type: {{ fetchError }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useVehicleTypes } from '../composables/useVehicleTypes';
import type { VehicleType } from '../interfaces/vehicle-type.interface';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-vue-next';
import api from '@/config/api';

const router = useRouter();
const route = useRoute();
const { isLoading, error, createVehicleType, updateVehicleType } = useVehicleTypes();

const vehicleType = ref<VehicleType | null>(null);
const isLoadingData = ref(false);
const fetchError = ref('');

const isEditMode = computed(() => !!route.params.id);

const formData = reactive({
  name: '',
  description: ''
});

const formErrors = reactive({
  name: ''
});

const validateForm = (): boolean => {
  formErrors.name = '';
  
  if (!formData.name.trim()) {
    formErrors.name = 'Name is required';
    return false;
  }
  
  return true;
};

const fetchVehicleType = async () => {
  if (!isEditMode.value) return;
  
  try {
    isLoadingData.value = true;
    const response = await api.get(`/vehicle-types/${route.params.id}`);
    const typeData = response.data.data || response.data;
    vehicleType.value = typeData;
    formData.name = typeData.name;
    formData.description = typeData.description || '';
  } catch (err: any) {
    console.error('Error fetching vehicle type:', err);
    fetchError.value = err.response?.data?.message || err.message || 'Failed to load vehicle type';
  } finally {
    isLoadingData.value = false;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  try {
    if (isEditMode.value && vehicleType.value) {
      await updateVehicleType(vehicleType.value.id, {
        name: formData.name,
        description: formData.description || undefined
      });
    } else {
      await createVehicleType({
        name: formData.name,
        description: formData.description || undefined
      });
    }
    router.push('/app/vehicle-types');
  } catch (err) {
    // Error is handled in the composable
  }
};

onMounted(() => {
  fetchVehicleType();
});
</script>
