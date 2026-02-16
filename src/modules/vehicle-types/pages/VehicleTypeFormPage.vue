<template>
  <div class="container h-full grid grid-rows-[auto_1fr] gap-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        {{ isEditMode ? 'Edit Vehicle Type' : 'Create Vehicle Type' }}
      </h1>
    </div>

    <Card class="border-0 shadow-none h-full">
      <CardHeader>
      </CardHeader>
      <CardContent class="h-full">
        <form v-if="!fetchError" @submit.prevent="handleSubmit" class="grid grid-rows-[1fr_auto] h-full gap-6">
          <div class="grid grid-cols-2 gap-6">
            <!-- Name Field -->
            <div class="space-y-2">
              <Label for="name">Name *</Label>
              <Input
                id="name"
                v-model="formData.name"
                placeholder="e.g., Truck"
                @input="clearError('name')"
              />
              <p v-if="formErrors.name" class="text-sm text-red-500">
                {{ formErrors.name }}
              </p>
            </div>

            <!-- Description Field -->
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Input
                id="description"
                v-model="formData.description"
                placeholder="Optional description"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              @click="router.push('/app/vehicle-types')"
            >
              Cancel
            </Button>
            <Button type="submit" :disabled="isLoading">
              {{ isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }} Type
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
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/config/api';

const router = useRouter();
const route = useRoute();
const { isLoading, createVehicleType, updateVehicleType } = useVehicleTypes();

const vehicleType = ref<VehicleType | null>(null);
const fetchError = ref('');

const isEditMode = computed(() => !!route.params.id);

const formData = reactive({
  name: '',
  description: ''
});

const formErrors = reactive({
  name: ''
});

const clearError = (field: keyof typeof formErrors) => {
  formErrors[field] = '';
};

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
    const response = await api.get(`/vehicle-types/${route.params.id}`);
    const typeData = response.data.data || response.data;
    vehicleType.value = typeData;
    formData.name = typeData.name;
    formData.description = typeData.description || '';
  } catch (err: any) {
    console.error('Error fetching vehicle type:', err);
    fetchError.value = err.response?.data?.message || err.message || 'Failed to load vehicle type';
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
