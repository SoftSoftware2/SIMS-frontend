<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Vehicle } from '../interfaces/vehicle.interface';
import { GoogleMap, Marker } from 'vue3-google-map';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
  vehicles: Vehicle[];
  highlightedVehicleId?: number | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{ 'highlight': [vehicleId: number | null] }>();

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapContainer = ref<HTMLElement | null>(null);
const hoveredVehicleId = ref<number | null>(null);
const cardPos = ref({ x: 0, y: 0 });

// Ebro Delta
const center = { lat: 40.7200, lng: 0.7340 };
const zoom = 11;

const vehiclesWithGPS = computed(() => 
  props.vehicles.filter(v => v.latitude != null && v.longitude != null)
);

const getHoveredVehicle = () => 
  vehiclesWithGPS.value.find(v => v.id === hoveredVehicleId.value);

// Status color configuration
const getStatusConfig = (status: string): { color: string, label: string, class: string } => {
  const defaultConfig = { color: '#3b82f6', label: 'In Use', class: 'bg-blue-100 text-blue-800' };
  const configs: Record<string, { color: string, label: string, class: string }> = {
    available: { color: '#22c55e', label: 'Available', class: 'bg-green-100 text-green-800' },
    using: defaultConfig,
    stopped: { color: '#ef4444', label: 'Stopped', class: 'bg-red-100 text-red-800' }
  };
  return configs[status] ?? defaultConfig;
};

const handleMarkerMouseover = (vehicleId: number, event: any) => {
  emit('highlight', vehicleId);
  hoveredVehicleId.value = vehicleId;

  if (event.domEvent && mapContainer.value) {
    const rect = mapContainer.value.getBoundingClientRect();
    cardPos.value = {
      x: event.domEvent.clientX - rect.left,
      y: event.domEvent.clientY - rect.top
    };
  }
};

const handleMarkerMouseout = () => {
  emit('highlight', null);
  hoveredVehicleId.value = null;
};
</script>

<template>
  <div ref="mapContainer" class="w-full h-[500px] rounded-xl overflow-hidden border shadow-inner relative bg-slate-50">
    <GoogleMap
      :api-key="apiKey"
      :center="center"
      :zoom="zoom"
      style="width: 100%; height: 100%"
      :styles="[{ featureType: 'poi', stylers: [{ visibility: 'off' }] }]"
    >
      <Marker
        v-for="vehicle in vehiclesWithGPS"
        :key="vehicle.id"
        :options="{
          position: { lat: vehicle.latitude!, lng: vehicle.longitude! },
          icon: {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: getStatusConfig(vehicle.status).color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: highlightedVehicleId === vehicle.id || hoveredVehicleId === vehicle.id ? 1.8 : 1.4,
            anchor: { x: 12, y: 24 }
          }
        }"
        @mouseover="(e) => handleMarkerMouseover(vehicle.id, e)"
        @mouseout="handleMarkerMouseout"
      />
    </GoogleMap>

    <Transition name="pop">
      <Card 
        v-if="getHoveredVehicle()" 
        class="absolute z-50 w-64 shadow-2xl border-t-4 pointer-events-none"
        :class="getStatusConfig(getHoveredVehicle()!.status).class"
        :style="{
          left: `${cardPos.x}px`,
          top: `${cardPos.y - 10}px`,
          transform: 'translate(-50%, -100%)'
        }"
      >
        <CardContent class="p-4">
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">License Plate</p>
              <h3 class="font-black text-lg leading-none">{{ getHoveredVehicle()?.license }}</h3>
            </div>
            <Badge :class="getStatusConfig(getHoveredVehicle()!.status).class" class="border">
              {{ getStatusConfig(getHoveredVehicle()!.status).label }}
            </Badge>
          </div>
          
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div>
              <p class="text-[10px] text-muted-foreground uppercase">Type</p>
              <p class="text-sm font-medium">{{ getHoveredVehicle()?.vehicle_type?.name || 'Standard' }}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-muted-foreground uppercase">Coordinates</p>
              <p class="text-[11px] font-mono text-slate-500">
                {{ getHoveredVehicle()?.latitude?.toFixed(3) }}, {{ getHoveredVehicle()?.longitude?.toFixed(3) }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Transition>
    
    <div v-if="vehiclesWithGPS.length === 0" class="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] z-10">
      <div class="bg-white rounded-xl p-8 text-center shadow-xl max-w-xs border">
        <div class="text-4xl mb-4">📍</div>
        <h3 class="text-lg font-bold">No GPS Data</h3>
        <p class="text-sm text-muted-foreground mt-2">There are no active vehicles to display on the map at the moment.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pop-enter-active {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-leave-active {
  transition: all 0.15s ease-in;
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
  transform: translate(-50%, -90%) scale(0.9);
}
</style>