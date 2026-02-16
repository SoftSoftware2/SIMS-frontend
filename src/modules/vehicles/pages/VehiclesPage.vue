<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVehicles } from '../composables/useVehicles';
import type { Vehicle } from '../interfaces/vehicle.interface';
import VehiclesMap from '../components/VehiclesMap.vue';
import VehiclesTable from '../components/VehiclesTable.vue';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-vue-next';

const router = useRouter();
const { vehicles, isLoading, error, fetchVehicles, deleteVehicle } = useVehicles();

const isDeleteDialogOpen = ref(false);
const selectedVehicle = ref<Vehicle | null>(null);
const highlightedVehicleId = ref<number | null>(null);

// Generate fictional GPS coordinates for demonstration
const deltaCities = [
  { name: 'Tortosa', lat: 40.8126, lng: 0.5210 },
  { name: 'Amposta', lat: 40.7098, lng: 0.5793 },
  { name: 'Sant Carles de la Ràpita', lat: 40.6208, lng: 0.6009 },
  { name: 'Deltebre', lat: 40.7261, lng: 0.7340 },
  { name: "L'Aldea", lat: 40.7833, lng: 0.5833 },
  { name: 'Alcanar', lat: 40.5580, lng: 0.5042 },
  { name: 'Sant Jaume d\'Enveja', lat: 40.7192, lng: 0.7503 },
];

// Vehicles with GPS coordinates (reactive for movement simulation)
const vehiclesWithDemoGPS = ref<Vehicle[]>([]);

const initializeVehiclePositions = () => {
  vehiclesWithDemoGPS.value = vehicles.value.map((vehicle, index) => {
    const city = deltaCities[index % deltaCities.length];
    
    if (!city) {
      return vehicle;
    }
    
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;
    
    return {
      ...vehicle,
      latitude: city.lat + latOffset,
      longitude: city.lng + lngOffset,
    };
  });
};

// Simulate vehicle movement
let movementInterval: ReturnType<typeof setInterval> | null = null;

const simulateMovement = () => {
  movementInterval = setInterval(() => {
    vehiclesWithDemoGPS.value = vehiclesWithDemoGPS.value.map(vehicle => {
      if (!vehicle.latitude || !vehicle.longitude) return vehicle;
      
      const latChange = (Math.random() - 0.5) * 0.001;
      const lngChange = (Math.random() - 0.5) * 0.001;
      
      return {
        ...vehicle,
        latitude: vehicle.latitude + latChange,
        longitude: vehicle.longitude + lngChange,
      };
    });
  }, 2000);
};

const openDeleteDialog = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle;
  isDeleteDialogOpen.value = true;
};

const handleDelete = async () => {
  if (!selectedVehicle.value) return;
  
  try {
    await deleteVehicle(selectedVehicle.value.id);
    isDeleteDialogOpen.value = false;
    selectedVehicle.value = null;
  } catch (err) {
    // Error is handled in the composable
  }
};

const handleEdit = (vehicle: Vehicle) => {
  router.push(`/app/vehicles/${vehicle.id}/edit`);
};

onMounted(() => {
  fetchVehicles();
  
  setTimeout(() => {
    initializeVehiclePositions();
    simulateMovement();
  }, 500);
});

onUnmounted(() => {
  if (movementInterval) {
    clearInterval(movementInterval);
  }
});
</script>

<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Vehicles</h1>
        <p class="text-muted-foreground">Manage the vehicles registered in the system.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="icon" @click="fetchVehicles" :disabled="isLoading">
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
        </Button>
        <Button @click="router.push('/app/vehicles/create')">
          New Vehicle
        </Button>
      </div>
    </div>

    <div v-if="error" class="p-4 text-center text-destructive mb-6">
      {{ error }}
    </div>

    <VehiclesTable 
      :vehicles="vehicles" 
      :loading="isLoading"
      :highlighted-vehicle-id="highlightedVehicleId"
      @edit="handleEdit"
      @delete="openDeleteDialog"
      @highlight="highlightedVehicleId = $event"
    />

    <div class="mt-8 rounded-md shadow-2xl p-6 bg-card">
      <h2 class="text-2xl font-bold tracking-tight mb-4">Vehicles Map</h2>
      <p class="text-muted-foreground mb-4">
        Real-time visualization of vehicle locations (demonstration data).
      </p>
      <VehiclesMap 
        :vehicles="vehiclesWithDemoGPS" 
        :highlighted-vehicle-id="highlightedVehicleId"
        @highlight="highlightedVehicleId = $event"
      />
    </div>

    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Vehicle</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the vehicle 
            <strong>{{ selectedVehicle?.license }}</strong>?
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
