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
            error.value = err.message || 'Error al cargar los tipos de vehículo';
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
            await fetchVehicleTypes(); // Refresh the list
            return data;
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Error al crear el tipo de vehículo';
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
            await fetchVehicleTypes(); // Refresh the list
            return data;
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Error al actualizar el tipo de vehículo';
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
            await fetchVehicleTypes(); // Refresh the list
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Error al eliminar el tipo de vehículo';
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
