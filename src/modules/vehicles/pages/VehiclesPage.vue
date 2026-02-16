<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useVehicles } from '../composables/useVehicles';
import { useVehicleTypes } from '@/modules/vehicle-types/composables/useVehicleTypes';
import type { Vehicle, VehicleStatus } from '../interfaces/vehicle.interface';
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } 
  from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Plus, RefreshCw, Pencil, Trash2 } from 'lucide-vue-next';

const { vehicles, isLoading, error, fetchVehicles, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
const { vehicleTypes, fetchVehicleTypes } = useVehicleTypes();

// Dialog states
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const selectedVehicle = ref<Vehicle | null>(null);

// Form data
const formData = reactive({
  license: '',
  status: 'available' as VehicleStatus,
  vehicle_type_id: 0
});

// Form validation
const formErrors = reactive({
  license: '',
  vehicle_type_id: ''
});

// Status options
const statusOptions = [
  { value: 'available', label: 'Disponible' },
  { value: 'using', label: 'En uso' },
  { value: 'stopped', label: 'Detenido' }
];

// Reset form
const resetForm = () => {
  formData.license = '';
  formData.status = 'available';
  formData.vehicle_type_id = 0;
  formErrors.license = '';
  formErrors.vehicle_type_id = '';
};

// Validate form
const validateForm = (): boolean => {
  formErrors.license = '';
  formErrors.vehicle_type_id = '';
  
  if (!formData.license.trim()) {
    formErrors.license = 'La matrícula es obligatoria';
    return false;
  }
  
  if (formData.license.length > 15) {
    formErrors.license = 'La matrícula no puede tener más de 15 caracteres';
    return false;
  }
  
  if (!formData.vehicle_type_id || formData.vehicle_type_id === 0) {
    formErrors.vehicle_type_id = 'Debe seleccionar un tipo de vehículo';
    return false;
  }
  
  return true;
};

// Open create dialog
const openCreateDialog = () => {
  resetForm();
  isCreateDialogOpen.value = true;
};

// Open edit dialog
const openEditDialog = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle;
  formData.license = vehicle.license;
  formData.status = vehicle.status;
  formData.vehicle_type_id = vehicle.vehicle_type_id;
  formErrors.license = '';
  formErrors.vehicle_type_id = '';
  isEditDialogOpen.value = true;
};

// Open delete dialog
const openDeleteDialog = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle;
  isDeleteDialogOpen.value = true;
};

// Handle create
const handleCreate = async () => {
  if (!validateForm()) return;
  
  try {
    await createVehicle({
      license: formData.license,
      status: formData.status,
      vehicle_type_id: formData.vehicle_type_id
    });
    isCreateDialogOpen.value = false;
    resetForm();
  } catch (err) {
    // Error is handled in the composable
  }
};

// Handle update
const handleUpdate = async () => {
  if (!validateForm() || !selectedVehicle.value) return;
  
  try {
    await updateVehicle(selectedVehicle.value.id, {
      license: formData.license,
      status: formData.status,
      vehicle_type_id: formData.vehicle_type_id
    });
    isEditDialogOpen.value = false;
    resetForm();
    selectedVehicle.value = null;
  } catch (err) {
    // Error is handled in the composable
  }
};

// Handle delete
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

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Get status label
const getStatusLabel = (status: VehicleStatus) => {
  const option = statusOptions.find(opt => opt.value === status);
  return option?.label || status;
};

// Get status variant
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

onMounted(() => {
  fetchVehicles();
  fetchVehicleTypes();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header with action buttons -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Vehículos</h1>
        <p class="text-muted-foreground">
          Gestiona los vehículos registrados en el sistema.
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="icon" @click="fetchVehicles" :disabled="isLoading">
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
        </Button>
        <Button @click="openCreateDialog">
          <Plus class="mr-2 h-4 w-4" />
          Nuevo Vehículo
        </Button>
      </div>
    </div>

    <!-- Data Card -->
    <Card>
      <CardHeader>
        <CardTitle>Listado de Vehículos</CardTitle>
        <CardDescription>
          Se muestran todos los vehículos registrados en el sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Loading State -->
        <div v-if="isLoading && vehicles.length === 0" class="space-y-2">
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-full" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-4 text-center text-destructive">
          {{ error }}
        </div>

        <!-- Data Table -->
        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matrícula</TableHead>
                <TableHead>Tipo de Vehículo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead class="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="vehicle in vehicles" :key="vehicle.id">
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
                      @click="openEditDialog(vehicle)"
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
                  No se encontraron vehículos.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Create Dialog -->
    <Dialog v-model:open="isCreateDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Vehículo</DialogTitle>
          <DialogDescription>
            Completa los datos para registrar un nuevo vehículo.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="create-license">Matrícula <span class="text-destructive">*</span></Label>
            <Input
              id="create-license"
              v-model="formData.license"
              placeholder="Ej: ABC1234"
              maxlength="15"
              :class="{ 'border-destructive': formErrors.license }"
              @input="formErrors.license = ''"
            />
            <p v-if="formErrors.license" class="text-sm text-destructive">
              {{ formErrors.license }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="create-vehicle-type">Tipo de Vehículo <span class="text-destructive">*</span></Label>
            <Select v-model="formData.vehicle_type_id">
              <SelectTrigger id="create-vehicle-type" :class="{ 'border-destructive': formErrors.vehicle_type_id }">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="type in vehicleTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="formErrors.vehicle_type_id" class="text-sm text-destructive">
              {{ formErrors.vehicle_type_id }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="create-status">Estado</Label>
            <Select v-model="formData.status">
              <SelectTrigger id="create-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isCreateDialogOpen = false" :disabled="isLoading">
            Cancelar
          </Button>
          <Button @click="handleCreate" :disabled="isLoading">
            <RefreshCw v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Dialog -->
    <Dialog v-model:open="isEditDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Vehículo</DialogTitle>
          <DialogDescription>
            Modifica los datos del vehículo.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="edit-license">Matrícula <span class="text-destructive">*</span></Label>
            <Input
              id="edit-license"
              v-model="formData.license"
              placeholder="Ej: ABC1234"
              maxlength="15"
              :class="{ 'border-destructive': formErrors.license }"
              @input="formErrors.license = ''"
            />
            <p v-if="formErrors.license" class="text-sm text-destructive">
              {{ formErrors.license }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="edit-vehicle-type">Tipo de Vehículo <span class="text-destructive">*</span></Label>
            <Select v-model="formData.vehicle_type_id">
              <SelectTrigger id="edit-vehicle-type" :class="{ 'border-destructive': formErrors.vehicle_type_id }">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="type in vehicleTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="formErrors.vehicle_type_id" class="text-sm text-destructive">
              {{ formErrors.vehicle_type_id }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="edit-status">Estado</Label>
            <Select v-model="formData.status">
              <SelectTrigger id="edit-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isEditDialogOpen = false" :disabled="isLoading">
            Cancelar
          </Button>
          <Button @click="handleUpdate" :disabled="isLoading">
            <RefreshCw v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Actualizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Vehículo</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar el vehículo 
            <strong>{{ selectedVehicle?.license }}</strong>?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="isDeleteDialogOpen = false" :disabled="isLoading">
            Cancelar
          </Button>
          <Button variant="destructive" @click="handleDelete" :disabled="isLoading">
            <RefreshCw v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
