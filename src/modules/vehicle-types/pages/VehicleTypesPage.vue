<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVehicleTypes } from '../composables/useVehicleTypes';
import type { VehicleType } from '../interfaces/vehicle-type.interface';
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } 
  from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Plus, RefreshCw, Pencil, Trash2 } from 'lucide-vue-next';

const router = useRouter();
const { vehicleTypes, isLoading, error, fetchVehicleTypes, deleteVehicleType } = useVehicleTypes();

// Delete dialog state
const isDeleteDialogOpen = ref(false);
const selectedVehicleType = ref<VehicleType | null>(null);

// Open delete dialog
const openDeleteDialog = (vehicleType: VehicleType) => {
  selectedVehicleType.value = vehicleType;
  isDeleteDialogOpen.value = true;
};

// Handle delete
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

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

onMounted(() => {
  fetchVehicleTypes();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Vehicle Types</h1>
        <p class="text-muted-foreground">
          Manage the vehicle types available in the system.
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="icon" @click="fetchVehicleTypes" :disabled="isLoading">
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
        </Button>
        <Button @click="router.push('/app/vehicle-types/create')">
          <Plus class="mr-2 h-4 w-4" />
          New Type
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Vehicle Types List</CardTitle>
        <CardDescription>
          All vehicle types configured in the system are displayed.
        </CardDescription>
      </CardHeader>
      <CardContent>

        <div v-if="isLoading && vehicleTypes.length === 0" class="space-y-2">
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
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="vehicleType in vehicleTypes" :key="vehicleType.id">
                <TableCell class="font-medium">{{ vehicleType.name }}</TableCell>
                <TableCell>{{ vehicleType.description || '-' }}</TableCell>
                <TableCell>{{ formatDate(vehicleType.created_at) }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      @click="router.push(`/app/vehicle-types/${vehicleType.id}/edit`)"
                      :disabled="isLoading"
                    >
                      <Pencil class="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      @click="openDeleteDialog(vehicleType)"
                      :disabled="isLoading"
                    >
                      <Trash2 class="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow v-if="vehicleTypes.length === 0">
                <TableCell colspan="4" class="h-24 text-center">
                  No vehicle types found.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

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
