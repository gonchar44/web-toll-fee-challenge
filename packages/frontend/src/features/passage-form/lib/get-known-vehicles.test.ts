import { describe, expect, it } from "vitest";
import type { Passage, VehicleTypeOption } from "@/types";
import { getKnownVehicles } from "./get-known-vehicles";

const passage = (overrides: Partial<Passage>): Passage => ({
    id: "passage-1",
    vehicleId: "ABC123",
    vehicleType: "car",
    timestamp: "2024-01-15T08:00:00+01:00",
    baseFee: 8,
    chargedFee: 8,
    dailyTotal: 8,
    ...overrides,
});

const vehicleType = (overrides: VehicleTypeOption): VehicleTypeOption => overrides;

describe("getKnownVehicles", () => {
    it("returns an empty list when passages have not loaded yet", () => {
        expect(getKnownVehicles(undefined, [vehicleType({ vehicleType: "car", tollFree: false })])).toEqual([]);
    });

    it("keeps the first known vehicle entry for each vehicle ID", () => {
        const knownVehicles = getKnownVehicles(
            [
                passage({ id: "first", vehicleId: "ABC123", vehicleType: "car" }),
                passage({ id: "duplicate", vehicleId: "ABC123", vehicleType: "motorbike" }),
                passage({ id: "second", vehicleId: "XYZ789", vehicleType: "bus" }),
            ],
            [],
        );

        expect(knownVehicles).toEqual([
            { vehicleId: "ABC123", vehicleType: "car", isTollFree: false },
            { vehicleId: "XYZ789", vehicleType: "bus", isTollFree: false },
        ]);
    });

    it("marks vehicles as toll-free when their vehicle type is toll-free", () => {
        const knownVehicles = getKnownVehicles(
            [passage({ vehicleId: "BUS123", vehicleType: "bus" }), passage({ vehicleId: "CAR123", vehicleType: "car" })],
            [vehicleType({ vehicleType: "bus", tollFree: true }), vehicleType({ vehicleType: "car", tollFree: false })],
        );

        expect(knownVehicles).toEqual([
            { vehicleId: "BUS123", vehicleType: "bus", isTollFree: true },
            { vehicleId: "CAR123", vehicleType: "car", isTollFree: false },
        ]);
    });
});
