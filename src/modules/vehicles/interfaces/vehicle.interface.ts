import type { VehicleType } from "@/modules/vehicle-types/interfaces/vehicle-type.interface";

export type VehicleStatus = 'available' | 'using' | 'stopped';

export interface Vehicle {
  id: number;
  license: string;
  status: VehicleStatus;
  vehicle_type_id: number;
  vehicle_type?: VehicleType;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
