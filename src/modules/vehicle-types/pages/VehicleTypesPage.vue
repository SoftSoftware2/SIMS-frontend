<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVehicleTypes } from '../composables/useVehicleTypes';
import type { VehicleType } from '../interfaces/vehicle-type.interface';
import VehicleTypesTable from '../components/VehicleTypesTable.vue';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-vue-next';

const router = useRouter();
const { vehicleTypes, isLoading, error, fetchVehicleTypes, deleteVehicleType } = useVehicleTypes();

const isDeleteDialogOpen = ref(false);
const selectedVehicleType = ref<VehicleType | null>(null);

const openDeleteDialog = (vehicleType: VehicleType) => {
  selectedVehicleType.value = vehicleType;
  isDeleteDialogOpen.value = true;
};

const handleDelete = async () => {
  if (!selectedVehicleType.value) return;
  
  try {
    await deleteVehicleType(selectedVehicleType.value.id);
    isDeleteDialogOpen.value = false;
    selectedVehicleType.value = null;
  } catch (err) {
    // Error is handled in the composable
  }
};

const handleEdit = (vehicleType: VehicleType) => {
  router.push(`/app/vehicle-types/${vehicleType.id}/edit`);
};

onMounted(() => {
  fetchVehicleTypes();
});
</script>

<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Vehicle Types</h1>
        <p class="text-muted-foreground">Manage the vehicle types available in the system.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="icon" @click="fetchVehicleTypes" :disabled="isLoading">
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
        </Button>
        <Button @click="router.push('/app/vehicle-types/create')">
          New Type
        </Button>
      </div>
    </div>

    <div v-if="error" class="p-4 text-center text-destructive mb-6">
      {{ error }}
    </div>

    <VehicleTypesTable 
      :vehicle-types="vehicleTypes" 
      :loading="isLoading"
      @edit="handleEdit"
      @delete="openDeleteDialog"
    />

    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Vehicle Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the vehicle type 
            <strong>{{ selectedVehicleType?.name }}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="isDeleteDialogOpen = false" :disabled="isLoading">
            Cancel
          </Button>
          <Button variant="destructive" @click="handleDelete" :disabled="isLoading">
            <RefreshCw v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
