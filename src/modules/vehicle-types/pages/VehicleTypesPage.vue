<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Plus, RefreshCw, Pencil, Trash2 } from 'lucide-vue-next';

const { vehicleTypes, isLoading, error, fetchVehicleTypes, createVehicleType, updateVehicleType, deleteVehicleType } = useVehicleTypes();

// Dialog states
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const selectedVehicleType = ref<VehicleType | null>(null);

// Form data
const formData = reactive({
  name: '',
  description: ''
});

// Form validation
const formErrors = reactive({
  name: ''
});

// Reset form
const resetForm = () => {
  formData.name = '';
  formData.description = '';
  formErrors.name = '';
};

// Validate form
const validateForm = (): boolean => {
  formErrors.name = '';
  
  if (!formData.name.trim()) {
    formErrors.name = 'El nombre es obligatorio';
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
const openEditDialog = (vehicleType: VehicleType) => {
  selectedVehicleType.value = vehicleType;
  formData.name = vehicleType.name;
  formData.description = vehicleType.description || '';
  formErrors.name = '';
  isEditDialogOpen.value = true;
};

// Open delete dialog
const openDeleteDialog = (vehicleType: VehicleType) => {
  selectedVehicleType.value = vehicleType;
  isDeleteDialogOpen.value = true;
};

// Handle create
const handleCreate = async () => {
  if (!validateForm()) return;
  
  try {
    await createVehicleType({
      name: formData.name,
      description: formData.description || undefined
    });
    isCreateDialogOpen.value = false;
    resetForm();
  } catch (err) {
    // Error is handled in the composable
  }
};

// Handle update
const handleUpdate = async () => {
  if (!validateForm() || !selectedVehicleType.value) return;
  
  try {
    await updateVehicleType(selectedVehicleType.value.id, {
      name: formData.name,
      description: formData.description || undefined
    });
    isEditDialogOpen.value = false;
    resetForm();
    selectedVehicleType.value = null;
  } catch (err) {
    // Error is handled in the composable
  }
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
  return date.toLocaleDateString('es-ES', { 
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
    <!-- Header with action buttons -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Tipos de Vehículo</h1>
        <p class="text-muted-foreground">
          Gestiona los tipos de vehículos disponibles en el sistema.
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="icon" @click="fetchVehicleTypes" :disabled="isLoading">
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
        </Button>
        <Button @click="openCreateDialog">
          <Plus class="mr-2 h-4 w-4" />
          Nuevo Tipo
        </Button>
      </div>
    </div>

    <!-- Data Card -->
    <Card>
      <CardHeader>
        <CardTitle>Listado de Tipos de Vehículo</CardTitle>
        <CardDescription>
          Se muestran todos los tipos de vehículos configurados en el sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Loading State -->
        <div v-if="isLoading && vehicleTypes.length === 0" class="space-y-2">
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
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead class="text-right">Acciones</TableHead>
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
                      @click="openEditDialog(vehicleType)"
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
                  No se encontraron tipos de vehículo.
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
          <DialogTitle>Crear Tipo de Vehículo</DialogTitle>
          <DialogDescription>
            Completa los datos para crear un nuevo tipo de vehículo.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="create-name">Nombre <span class="text-destructive">*</span></Label>
            <Input
              id="create-name"
              v-model="formData.name"
              placeholder="Ej: Camión, Furgoneta, Turismo"
              :class="{ 'border-destructive': formErrors.name }"
              @input="formErrors.name = ''"
            />
            <p v-if="formErrors.name" class="text-sm text-destructive">
              {{ formErrors.name }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="create-description">Descripción</Label>
            <Input
              id="create-description"
              v-model="formData.description"
              placeholder="Descripción del tipo de vehículo"
            />
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
          <DialogTitle>Editar Tipo de Vehículo</DialogTitle>
          <DialogDescription>
            Modifica los datos del tipo de vehículo.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="edit-name">Nombre <span class="text-destructive">*</span></Label>
            <Input
              id="edit-name"
              v-model="formData.name"
              placeholder="Ej: Camión, Furgoneta, Turismo"
              :class="{ 'border-destructive': formErrors.name }"
              @input="formErrors.name = ''"
            />
            <p v-if="formErrors.name" class="text-sm text-destructive">
              {{ formErrors.name }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="edit-description">Descripción</Label>
            <Input
              id="edit-description"
              v-model="formData.description"
              placeholder="Descripción del tipo de vehículo"
            />
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
          <DialogTitle>Eliminar Tipo de Vehículo</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar el tipo de vehículo 
            <strong>{{ selectedVehicleType?.name }}</strong>?
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
