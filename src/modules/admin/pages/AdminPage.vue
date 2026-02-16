<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Administrators</h1>
        <p class="text-muted-foreground">Manage system administrators</p>
      </div>
      <Button @click="router.push({name: 'admin-form'})">
        New Administrator
      </Button>
    </div>
    
    <AdminTable 
      :admins="admins" 
      :loading="loading"
      @edit="(admin) => router.push({name: 'admin-edit', params: {id: admin.id}})"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdmins } from '../composables/useAdmins';
import AdminTable from '../components/AdminTable.vue';
import { Button } from '@/components/ui/button';
import type { Admin } from '../interfaces/admin.interfaces';
import { useRouter } from 'vue-router';

const { getAdmins, deleteAdmin } = useAdmins();

const router = useRouter();

const admins = ref<Admin[]>([]);
const loading = ref(false);

const loadAdmins = async () => {
  loading.value = true;
  try {
    const response = await getAdmins();
    if (response) {
      admins.value = response;
    }
  } catch (error) {
    console.error('Error loading administrators:', error);
  } finally {
    loading.value = false;
  }
};


const handleDelete = async (id: number) => {

  // Make the modal   
  if (!confirm('Are you sure you want to delete this administrator?')) {
    return;
  }
  
  try {
    await deleteAdmin(id);
    await loadAdmins();
  } catch (error) {
    console.error('Error deleting administrator:', error);
  }
};


onMounted(() => {
  loadAdmins();
});
</script>