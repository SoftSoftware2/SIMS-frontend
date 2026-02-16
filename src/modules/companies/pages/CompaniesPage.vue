<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Companies</h1>
        <p class="text-muted-foreground">Manage system companies</p>
      </div>
      <Button @click="router.push({name: 'companies-create'})">
        New Company
      </Button>
    </div>
    
    <CompanyTable 
      :companies="companies" 
      :loading="loading"
      @edit="(company) => router.push({name: 'companies-edit', params: {id: company.id}})"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCompanies } from '../composables/useCompanies';
import CompanyTable from '../components/CompanyTable.vue';
import { Button } from '@/components/ui/button';
import type { Company } from '../interfaces/company.interface';
import { useRouter } from 'vue-router';

const { getCompanies, deleteCompany } = useCompanies();
const router = useRouter();

const companies = ref<Company[]>([]);
const loading = ref(false);

const loadCompanies = async () => {
  loading.value = true;
  try {
    const response = await getCompanies();
    if (response) {
      // The composable already handles the data extraction, but we ensure it matches the list
      companies.value = Array.isArray(response) ? response : (response as any).data;
    }
  } catch (error) {
    console.error('Error loading companies:', error);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this company?')) {
    return;
  }
  
  try {
    await deleteCompany(id);
    await loadCompanies();
  } catch (error) {
    console.error('Error deleting company:', error);
  }
};

onMounted(() => {
  loadCompanies();
});
</script>
