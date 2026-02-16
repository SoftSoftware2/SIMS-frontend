<template>
  <div class="rounded-md shadow-2xl">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <TableCell colspan="4" class="text-center h-24">
            <span class="text-muted-foreground">Loading...</span>
          </TableCell>
        </TableRow>
        <TableRow v-else-if="vehicleTypes.length === 0">
          <TableCell colspan="4" class="text-center h-24">
            <span class="text-muted-foreground">No vehicle types registered</span>
          </TableCell>
        </TableRow>
        <TableRow v-else v-for="vehicleType in vehicleTypes" :key="vehicleType.id">
          <TableCell class="font-medium">{{ vehicleType.name }}</TableCell>
          <TableCell>{{ vehicleType.description || '-' }}</TableCell>
          <TableCell>{{ formatDate(vehicleType.created_at) }}</TableCell>
          <TableCell class="text-right space-x-2">
            <Button 
              variant="default" 
              size="sm"
              @click="emit('edit', vehicleType)"
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              @click="emit('delete', vehicleType)"
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
import type { VehicleType } from '../interfaces/vehicle-type.interface';

defineProps<{
  vehicleTypes: VehicleType[];
  loading: boolean;
}>();

const emit = defineEmits<{
  edit: [vehicleType: VehicleType];
  delete: [vehicleType: VehicleType];
}>();

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
</script>
