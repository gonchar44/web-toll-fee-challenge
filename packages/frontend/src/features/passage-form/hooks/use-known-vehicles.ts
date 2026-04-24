import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPassages } from "@/features/passages/api/passages.api";
import { fetchVehicleTypes } from "@/features/vehicle-types/api/vehicle-types.api";
import { getKnownVehicles } from "../lib/get-known-vehicles";
import type { KnownVehicle } from "../model/passage-form.types";

export function useKnownVehicles(): KnownVehicle[] {
    const { data: passages } = useQuery({ queryKey: ["passages"], queryFn: fetchPassages });
    const { data: vehicleTypes } = useQuery({
        queryKey: ["vehicle-types"],
        queryFn: fetchVehicleTypes,
        staleTime: Infinity,
    });

    return useMemo(() => getKnownVehicles(passages, vehicleTypes), [passages, vehicleTypes]);
}
