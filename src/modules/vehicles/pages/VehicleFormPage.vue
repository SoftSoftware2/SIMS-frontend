<template>
  <div class="container h-full grid grid-rows-[auto_1fr] gap-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        {{ isEditMode ? 'Edit Vehicle' : 'Create Vehicle' }}
      </h1>
    </div>

    <Card class="border-0 shadow-none h-full">
      <CardHeader>
      </CardHeader>
      <CardContent class="h-full">
        <form v-if="!fetchError" @submit.prevent="handleSubmit" class="grid grid-rows-[1fr_auto] h-full gap-6">
          <div class="grid grid-cols-3 gap-6">
            <!-- License Plate Field -->
            <div class="space-y-2">
              <Label for="license">License Plate *</Label>
              <Input
                id="license"
                v-model="formData.license"
                placeholder="e.g., ABC-1234"
                maxlength="15"
                @input="clearError('license')"
              />
              <p v-if="formErrors.license" class="text-sm text-red-500">
                {{ formErrors.license }}
              </p>
            </div>

            <!-- Vehicle Type Field -->
            <div class="space-y-2">
              <Label for="vehicle_type_id">Vehicle Type *</Label>
              <Select v-model="formData.vehicle_type_id" @update:model-value="clearError('vehicle_type_id')">
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="type in vehicleTypes"
                    :key="type.id"
                    :value="type.id.toString()"
                  >
                    {{ type.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p v-if="formErrors.vehicle_type_id" class="text-sm text-red-500">
                {{ formErrors.vehicle_type_id }}
              </p>
            </div>

            <!-- Status Field -->
            <div class="space-y-2">
              <Label for="status">Status *</Label>
              <Select v-model="formData.status">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="using">In Use</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              @click="router.push('/app/vehicles')"
            >
              Cancel
            </Button>
            <Button type="submit" :disabled="isLoading || isLoadingTypes">
              {{ isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }} Vehicle
            </Button>
          </div>
        </form>

        <div v-else class="text-red-500">
          Error loading vehicle: {{ fetchError }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useVehicles } from '../composables/useVehicles';
import { useVehicleTypes } from '@/modules/vehicle-types/composables/useVehicleTypes';
import type { Vehicle, VehicleStatus } from '../interfaces/vehicle.interface';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/config/api';

const router = useRouter();
const route = useRoute();
const { isLoading, createVehicle, updateVehicle } = useVehicles();
const { vehicleTypes, isLoading: isLoadingTypes, fetchVehicleTypes } = useVehicleTypes();

const vehicle = ref<Vehicle | null>(null);
const fetchError = ref('');

const isEditMode = computed(() => !!route.params.id);

const formData = reactive({
  license: '',
  status: 'available' as VehicleStatus,
  vehicle_type_id: ''
});

const formErrors = reactive({
  license: '',
  vehicle_type_id: ''
});

const clearError = (field: keyof typeof formErrors) => {
  formErrors[field] = '';
};

const validateForm = (): boolean => {
  formErrors.license = '';
  formErrors.vehicle_type_id = '';
  
  if (!formData.license.trim()) {
    formErrors.license = 'License plate is required';
    return false;
  }
  
  if (formData.license.length > 15) {
    formErrors.license = 'License plate cannot exceed 15 characters';
    return false;
  }
  
  if (!formData.vehicle_type_id) {
    formErrors.vehicle_type_id = 'You must select a vehicle type';
    return false;
  }
  
  return true;
};

const fetchVehicle = async () => {
  if (!isEditMode.value) return;
  
  try {
    const response = await api.get(`/vehicles/${route.params.id}`);
    const vehicleData = response.data.data || response.data;
    vehicle.value = vehicleData;
    formData.license = vehicleData.license;
    formData.status = vehicleData.status;
    formData.vehicle_type_id = vehicleData.vehicle_type_id.toString();
  } catch (err: any) {
    console.error('Error fetching vehicle:', err);
    fetchError.value = err.response?.data?.message || err.message || 'Failed to load vehicle';
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  try {
    if (isEditMode.value && vehicle.value) {
      await updateVehicle(vehicle.value.id, {
        license: formData.license,
        status: formData.status,
        vehicle_type_id: parseInt(formData.vehicle_type_id)
      });
    } else {
      await createVehicle({
        license: formData.license,
        status: formData.status,
        vehicle_type_id: parseInt(formData.vehicle_type_id)
      });
    }
    router.push('/app/vehicles');
  } catch (err) {
    // Error is handled in the composable
  }
};

onMounted(() => {
  fetchVehicle();
  fetchVehicleTypes();
});
</script>
