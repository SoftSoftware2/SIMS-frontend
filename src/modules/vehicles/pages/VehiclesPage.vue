<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVehicles } from '../composables/useVehicles';
import type { Vehicle, VehicleStatus } from '../interfaces/vehicle.interface';
import VehiclesMap from '../components/VehiclesMap.vue';
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } 
  from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Plus, RefreshCw, Pencil, Trash2 } from 'lucide-vue-next';

const router = useRouter();
const { vehicles, isLoading, error, fetchVehicles, deleteVehicle } = useVehicles();

const isDeleteDialogOpen = ref(false);
const selectedVehicle = ref<Vehicle | null>(null);

const highlightedVehicleId = ref<number | null>(null);

const mapCardRef = ref<HTMLElement | null>(null);

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'using', label: 'In Use' },
  { value: 'stopped', label: 'Stopped' }
];

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

// Scroll to map
const scrollToMap = () => {

  const element = (mapCardRef.value as any)?.$el || mapCardRef.value;
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getStatusLabel = (status: VehicleStatus) => {
  const option = statusOptions.find(opt => opt.value === status);
  return option?.label || status;
};

const getStatusVariant = (status: VehicleStatus): 'default' | 'secondary' | 'destructive' => {
  switch (status) {
    case 'available':
      return 'default';
    case 'using':
      return 'secondary';
    case 'stopped':
      return 'destructive';
    default:
      return 'default';
  }
};

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
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Vehicles</h1>
        <p class="text-muted-foreground">
          Manage the vehicles registered in the system.
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="icon" @click="fetchVehicles" :disabled="isLoading">
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
        </Button>
        <Button @click="router.push('/app/vehicles/create')">
          <Plus class="mr-2 h-4 w-4" />
          New Vehicle
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Vehicles List</CardTitle>
        <CardDescription>
          All vehicles registered in the system are displayed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading && vehicles.length === 0" class="space-y-2">
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
        </div>

        <div v-else-if="error" class="p-4 text-center text-destructive">
          {{ error }}
        </div>

        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License Plate</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="vehicle in vehicles" 
                :key="vehicle.id"
                @mouseenter="highlightedVehicleId = vehicle.id"
                @mouseleave="highlightedVehicleId = null"
                @click="scrollToMap"
                :class="{ 'bg-blue-50 dark:bg-blue-950': highlightedVehicleId === vehicle.id }"
                class="transition-colors cursor-pointer"
              >
                <TableCell class="font-medium">{{ vehicle.license }}</TableCell>
                <TableCell>{{ vehicle.vehicle_type?.name || '-' }}</TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(vehicle.status)">
                    {{ getStatusLabel(vehicle.status) }}
                  </Badge>
                </TableCell>
                <TableCell>{{ formatDate(vehicle.created_at) }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      @click="router.push(`/app/vehicles/${vehicle.id}/edit`)"
                      :disabled="isLoading"
                    >
                      <Pencil class="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      @click="openDeleteDialog(vehicle)"
                      :disabled="isLoading"
                    >
                      <Trash2 class="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow v-if="vehicles.length === 0">
                <TableCell colspan="5" class="h-24 text-center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Card ref="mapCardRef">
      <CardHeader>
        <CardTitle>Vehicles Map</CardTitle>
        <CardDescription>
          Real-time visualization of vehicle locations (demonstration data).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VehiclesMap 
          :vehicles="vehiclesWithDemoGPS" 
          :highlighted-vehicle-id="highlightedVehicleId"
          @highlight="highlightedVehicleId = $event"
        />
      </CardContent>
    </Card>

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
