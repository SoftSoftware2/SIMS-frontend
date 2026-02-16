<template>
  <div class="rounded-md shadow-2xl">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>License Plate</TableHead>
          <TableHead>Vehicle Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <TableCell colspan="5" class="text-center h-24">
            <span class="text-muted-foreground">Loading...</span>
          </TableCell>
        </TableRow>
        <TableRow v-else-if="vehicles.length === 0">
          <TableCell colspan="5" class="text-center h-24">
            <span class="text-muted-foreground">No vehicles registered</span>
          </TableCell>
        </TableRow>
        <TableRow 
          v-else 
          v-for="vehicle in vehicles" 
          :key="vehicle.id"
          @mouseenter="emit('highlight', vehicle.id)"
          @mouseleave="emit('highlight', null)"
          :class="{ 'bg-blue-50 dark:bg-blue-950': highlightedVehicleId === vehicle.id }"
          class="transition-colors cursor-pointer"
        >
          <TableCell class="font-medium">{{ vehicle.license }}</TableCell>
          <TableCell>{{ vehicle.vehicle_type?.name || '-' }}</TableCell>
          <TableCell>
            <Badge :class="getStatusBadgeClass(vehicle.status)" class="font-medium">
              {{ getStatusLabel(vehicle.status) }}
            </Badge>
          </TableCell>
          <TableCell>{{ formatDate(vehicle.created_at) }}</TableCell>
          <TableCell class="text-right space-x-2">
            <Button 
              variant="default" 
              size="sm"
              @click="emit('edit', vehicle)"
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              @click="emit('delete', vehicle)"
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Vehicle, VehicleStatus } from '../interfaces/vehicle.interface';

defineProps<{
  vehicles: Vehicle[];
  loading: boolean;
  highlightedVehicleId: number | null;
}>();

const emit = defineEmits<{
  edit: [vehicle: Vehicle];
  delete: [vehicle: Vehicle];
  highlight: [vehicleId: number | null];
}>();

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'using', label: 'In Use' },
  { value: 'stopped', label: 'Stopped' }
];

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

const getStatusBadgeClass = (status: VehicleStatus): string => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'using':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'stopped':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};
</script>
