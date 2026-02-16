<template>
  <div class="container mx-auto py-6">
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>{{ isEditMode ? 'Edit Vehicle' : 'Create Vehicle' }}</CardTitle>
            <CardDescription>
              {{ isEditMode ? 'Update vehicle information' : 'Add a new vehicle to the system' }}
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
          <Skeleton class="h-10 w-full" />
        </div>

        <form v-else-if="!fetchError" @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="license">License Plate *</Label>
            <Input
              id="license"
              v-model="formData.license"
              placeholder="Enter license plate"
              maxlength="15"
              :class="{ 'border-red-500': formErrors.license }"
            />
            <p v-if="formErrors.license" class="text-sm text-red-500">
              {{ formErrors.license }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="vehicle_type_id">Vehicle Type *</Label>
            <Select v-model="formData.vehicle_type_id">
              <SelectTrigger :class="{ 'border-red-500': formErrors.vehicle_type_id }">
                <SelectValue placeholder="Select a vehicle type" />
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

          <div class="space-y-2">
            <Label for="status">Status *</Label>
            <Select v-model="formData.status">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in statusOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div v-if="error" class="text-sm text-red-500">
            {{ error }}
          </div>

          <div class="flex justify-end gap-2">
            <Button type="button" variant="outline" @click="router.back()">
              Cancel
            </Button>
            <Button type="submit" :disabled="isLoading || isLoadingTypes">
              <RefreshCw v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isEditMode ? 'Update' : 'Create' }} Vehicle
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-vue-next';
import api from '@/config/api';

const router = useRouter();
const route = useRoute();
const { isLoading, error, createVehicle, updateVehicle } = useVehicles();
const { vehicleTypes, isLoading: isLoadingTypes, fetchVehicleTypes } = useVehicleTypes();

const vehicle = ref<Vehicle | null>(null);
const isLoadingData = ref(false);
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

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'using', label: 'In Use' },
  { value: 'stopped', label: 'Stopped' }
];

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
    isLoadingData.value = true;
    const response = await api.get(`/vehicles/${route.params.id}`);
    const vehicleData = response.data.data || response.data;
    vehicle.value = vehicleData;
    formData.license = vehicleData.license;
    formData.status = vehicleData.status;
    formData.vehicle_type_id = vehicleData.vehicle_type_id.toString();
  } catch (err: any) {
    console.error('Error fetching vehicle:', err);
    fetchError.value = err.response?.data?.message || err.message || 'Failed to load vehicle';
  } finally {
    isLoadingData.value = false;
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
