import type { Passage, VehicleTypeOption } from "@/types";
import type { KnownVehicle } from "../model/passage-form.types";

export function getKnownVehicles(
    passages: Passage[] | undefined,
    vehicleTypes: VehicleTypeOption[] | undefined,
): KnownVehicle[] {
    if (!passages) return [];

    const tollFreeSet = new Set(
        vehicleTypes?.filter((vehicleType) => vehicleType.tollFree).map((vehicleType) => vehicleType.vehicleType) ?? [],
    );
    const seen = new Map<string, KnownVehicle>();

    for (const passage of passages) {
        if (!seen.has(passage.vehicleId)) {
            seen.set(passage.vehicleId, {
                vehicleId: passage.vehicleId,
                vehicleType: passage.vehicleType,
                isTollFree: tollFreeSet.has(passage.vehicleType),
            });
        }
    }

    return Array.from(seen.values());
}
