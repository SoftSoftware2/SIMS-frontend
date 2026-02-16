<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Vehicle } from '../interfaces/vehicle.interface';
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map';

interface Props {
  vehicles: Vehicle[];
  highlightedVehicleId?: number | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'highlight': [vehicleId: number | null]
}>();

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Delta
const center = { lat: 40.7200, lng: 0.7340 };
const zoom = 11;

const vehiclesWithGPS = computed(() => {
  return props.vehicles.filter(v => v.latitude != null && v.longitude != null);
});

// Function to get marker color based on status
const getMarkerColor = (status: string) => {
  switch (status) {
    case 'available':
      return '#22c55e'; // green
    case 'using':
      return '#3b82f6'; // blue
    case 'stopped':
      return '#ef4444'; // red
    default:
      return '#3b82f6'; // blue
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'using':
      return 'In Use';
    case 'stopped':
      return 'Stopped';
    default:
      return status;
  }
};

const hoveredVehicleId = ref<number | null>(null);
</script>

<template>
  <div class="w-full h-[500px] rounded-lg overflow-hidden border relative">
    <GoogleMap
      :api-key="apiKey"
      :center="center"
      :zoom="zoom"
      style="width: 100%; height: 100%"
      :styles="[]"
    >
      <Marker
        v-for="vehicle in vehiclesWithGPS"
        :key="vehicle.id"
        :options="{
          position: { lat: vehicle.latitude!, lng: vehicle.longitude! },
          title: vehicle.license,
          icon: {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: getMarkerColor(vehicle.status),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1,
            scale: props.highlightedVehicleId === vehicle.id ? 2 : 1.5,
            anchor: { x: 12, y: 24 }
          }
        }"
        @mouseover="() => {
          emit('highlight', vehicle.id);
          hoveredVehicleId = vehicle.id;
        }"
        @mouseout="() => {
          emit('highlight', null);
          hoveredVehicleId = null;
        }"
      >
        <InfoWindow v-if="hoveredVehicleId === vehicle.id">
          <div class="p-2 min-w-[200px]">
            <h3 class="font-bold text-lg mb-2">{{ vehicle.license }}</h3>
            <div class="space-y-1 text-sm">
              <p>
                <span class="font-semibold">Type:</span> 
                {{ vehicle.vehicle_type?.name || 'N/A' }}
              </p>
              <p>
                <span class="font-semibold">Status:</span>
                <span 
                  :style="{
                    color: getMarkerColor(vehicle.status)
                  }"
                  class="font-medium"
                >
                  {{ getStatusLabel(vehicle.status) }}
                </span>
              </p>
              <p class="text-xs text-gray-500 mt-2">
                📍 {{ vehicle.latitude?.toFixed(4) }}, {{ vehicle.longitude?.toFixed(4) }}
              </p>
            </div>
          </div>
        </InfoWindow>
      </Marker>
    </GoogleMap>
    
    <div 
      v-if="vehiclesWithGPS.length === 0" 
      class="absolute inset-0 flex items-center justify-center bg-black/50 z-[1000]"
    >
      <div class="bg-white rounded-lg p-6 text-center">
        <p class="text-lg font-semibold mb-2">📍 No GPS Data</p>
        <p class="text-sm text-muted-foreground">
          There are no vehicles with GPS coordinates to display on the map.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

:deep(.vue-map-container) {
  height: 100%;
  width: 100%;
}
</style>
