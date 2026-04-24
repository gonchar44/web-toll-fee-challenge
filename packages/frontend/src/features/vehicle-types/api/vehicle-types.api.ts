import { VehicleTypeOption } from "@/types";
import { apiGetList } from "@/lib/api/http-client";

const VEHICLE_TYPES_ENDPOINT = "/api/meta/vehicle-types";

export function fetchVehicleTypes(): Promise<VehicleTypeOption[]> {
    return apiGetList<VehicleTypeOption[]>(VEHICLE_TYPES_ENDPOINT);
}
