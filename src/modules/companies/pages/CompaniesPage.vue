<script setup lang="ts">
import { onMounted } from 'vue';
import { useCompanies } from '../composables/useCompanies';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw } from 'lucide-vue-next';

const { companies, isLoading, error, fetchCompanies } = useCompanies();

onMounted(() => {
  fetchCompanies();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Empresas</h1>
        <p class="text-muted-foreground">
          Gestiona las empresas registradas en el sistema.
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="icon" @click="fetchCompanies" :disabled="isLoading">
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
        </Button>
        <Button>
          <Plus class="mr-2 h-4 w-4" />
          Nueva Empresa
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Listado de Empresas</CardTitle>
        <CardDescription>
          Se muestran todas las empresas configuradas con sus respectivas conexiones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="space-y-2">
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
                <TableHead>Nombre</TableHead>
                <TableHead>CIF</TableHead>
                <TableHead>Conexión</TableHead>
                <TableHead>Usuario DB</TableHead>
                <TableHead class="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="company in companies" :key="company.id">
                <TableCell class="font-medium">{{ company.name }}</TableCell>
                <TableCell>{{ company.cif }}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{{ company.db_conexion }}</Badge>
                </TableCell>
                <TableCell>{{ company.db_user }}</TableCell>
                <TableCell class="text-right">
                  <Button variant="ghost" size="sm">Editar</Button>
                </TableCell>
              </TableRow>
              <TableRow v-if="companies.length === 0">
                <TableCell colspan="5" class="h-24 text-center">
                  No se encontraron empresas.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
