import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPassages } from "@/features/passages/api/passages.api";
import { fetchVehicleTypes } from "@/features/vehicle-types/api/vehicle-types.api";
import type { KnownVehicle } from "../model/passage-form.types";

export function useKnownVehicles(): KnownVehicle[] {
    const { data: passages } = useQuery({ queryKey: ["passages"], queryFn: fetchPassages });
    const { data: vehicleTypes } = useQuery({
        queryKey: ["vehicle-types"],
        queryFn: fetchVehicleTypes,
        staleTime: Infinity,
    });

    return useMemo(() => {
        if (!passages) return [];
        const tollFreeSet = new Set(vehicleTypes?.filter((vt) => vt.tollFree).map((vt) => vt.vehicleType) ?? []);
        const seen = new Map<string, KnownVehicle>();
        for (const p of passages) {
            if (!seen.has(p.vehicleId)) {
                seen.set(p.vehicleId, {
                    vehicleId: p.vehicleId,
                    vehicleType: p.vehicleType,
                    isTollFree: tollFreeSet.has(p.vehicleType),
                });
            }
        }
        return Array.from(seen.values());
    }, [passages, vehicleTypes]);
}
