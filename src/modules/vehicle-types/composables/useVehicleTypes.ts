import { ref } from 'vue';
import api from "@/config/api";
import type { VehicleType } from "../interfaces/vehicle-type.interface";

export const useVehicleTypes = () => {
    const vehicleTypes = ref<VehicleType[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchVehicleTypes = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data } = await api.get('/vehicle-types');
            vehicleTypes.value = data.data || data;
        } catch (err: any) {
            error.value = err.message || 'Error loading vehicle types';
            console.error('Error fetching vehicle types:', err);
        } finally {
            isLoading.value = false;
        }
    };

    const createVehicleType = async (vehicleTypeData: Omit<VehicleType, 'id' | 'created_at' | 'updated_at'>) => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data } = await api.post('/vehicle-types', vehicleTypeData);
            await fetchVehicleTypes();
            return data;
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Error creating vehicle type';
            console.error('Error creating vehicle type:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const updateVehicleType = async (id: number, vehicleTypeData: Omit<VehicleType, 'id' | 'created_at' | 'updated_at'>) => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data } = await api.put(`/vehicle-types/${id}`, vehicleTypeData);
            await fetchVehicleTypes();
            return data;
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Error updating vehicle type';
            console.error('Error updating vehicle type:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteVehicleType = async (id: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            await api.delete(`/vehicle-types/${id}`);
            await fetchVehicleTypes();
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Error deleting vehicle type';
            console.error('Error deleting vehicle type:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        vehicleTypes,
        isLoading,
        error,
        fetchVehicleTypes,
        createVehicleType,
        updateVehicleType,
        deleteVehicleType
    };
};
