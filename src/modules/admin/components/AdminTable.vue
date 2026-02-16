<template>
  <div class="rounded-md shadow-2xl">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
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
        <TableRow v-else-if="admins.length === 0">
          <TableCell colspan="5" class="text-center h-24">
            <span class="text-muted-foreground">No administrators registered</span>
          </TableCell>
        </TableRow>
        <TableRow v-else v-for="admin in admins" :key="admin.id">
          <TableCell>{{ admin.email }}</TableCell>
          <TableCell>{{ admin.name }}</TableCell>
          <TableCell>{{ formatDate(admin.created_at) }}</TableCell>
          <TableCell class="text-right space-x-2">
            <Button 
              variant="default" 
              size="sm"
              @click="emit('edit', admin)"
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              @click="emit('delete', admin.id)"
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
import type { Admin } from '../interfaces/admin.interfaces';

interface Props {
  admins: Admin[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<{
  edit: [admin: Admin];
  delete: [id: number];
}>();

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>