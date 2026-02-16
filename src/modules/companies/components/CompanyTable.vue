<template>
  <div class="rounded-md shadow-2xl">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>CIF</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Connection</TableHead>
          <TableHead>DB User</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <TableCell colspan="5" class="text-center h-24">
            <span class="text-muted-foreground">Loading...</span>
          </TableCell>
        </TableRow>
        <TableRow v-else-if="companies.length === 0">
          <TableCell colspan="5" class="text-center h-24">
            <span class="text-muted-foreground">No companies registered</span>
          </TableCell>
        </TableRow>
        <TableRow v-else v-for="company in companies" :key="company.id">
          <TableCell>{{ company.cif }}</TableCell>
          <TableCell>{{ company.name }}</TableCell>
          <TableCell>{{ company.db_conexion }}</TableCell>
          <TableCell>{{ company.db_user }}</TableCell>
          <TableCell class="text-right space-x-2">
            <Button 
              variant="default" 
              size="sm"
              @click="emit('edit', company)"
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              @click="emit('delete', company.id)"
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
import type { Company } from '../interfaces/company.interface';

interface Props {
  companies: Company[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<{
  edit: [company: Company];
  delete: [id: number];
}>();

// Removed formatDate as it's not and shouldn't be used in this table according to AdminTable pattern if not needed
</script>
