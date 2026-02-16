import { ref } from 'vue';
import api from "@/config/api";
import type { Vehicle } from "../interfaces/vehicle.interface";

export const useVehicles = () => {
    const vehicles = ref<Vehicle[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchVehicles = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data } = await api.get('/vehicles');
            vehicles.value = data.data || data;
        } catch (err: any) {
            error.value = err.message || 'Error al cargar los vehículos';
            console.error('Error fetching vehicles:', err);
        } finally {
            isLoading.value = false;
        }
    };

    const createVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'vehicle_type'>) => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data } = await api.post('/vehicles', vehicleData);
            await fetchVehicles(); // Refresh the list
            return data;
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Error al crear el vehículo';
            console.error('Error creating vehicle:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const updateVehicle = async (id: number, vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'vehicle_type'>) => {
        isLoading.value = true;
        error.value = null;
        try {
            const { data } = await api.put(`/vehicles/${id}`, vehicleData);
            await fetchVehicles(); // Refresh the list
            return data;
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Error al actualizar el vehículo';
            console.error('Error updating vehicle:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteVehicle = async (id: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            await api.delete(`/vehicles/${id}`);
            await fetchVehicles(); // Refresh the list
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Error al eliminar el vehículo';
            console.error('Error deleting vehicle:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        vehicles,
        isLoading,
        error,
        fetchVehicles,
        createVehicle,
        updateVehicle,
        deleteVehicle
    };
};
