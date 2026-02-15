import { ref } from 'vue';
import api from "@/config/api";
import type { Company } from "../interfaces/company.interface";

export const useCompanies = () => {
    const companies = ref<Company[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchCompanies = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data } = await api.get('/companies');
            companies.value = data.data || data;
        } catch (err: any) {
            error.value = err.message || 'Error al cargar las empresas';
            console.error('Error fetching companies:', err);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        companies,
        isLoading,
        error,
        fetchCompanies
    };
};
