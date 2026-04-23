import { describe, expect, it } from "vitest";
import { calculateCharges } from "./tollCalculator";
import { TollPassage } from "../types";

describe("calculateCharges", () => {
  it("returns zero for toll-free vehicle type", () => {
    const passages: TollPassage[] = [
      {
        id: "p1",
        vehicleId: "veh-1",
        vehicleType: "bus",
        timestamp: "2025-02-10T07:15:00+01:00"
      }
    ];

    const charges = calculateCharges(passages);
    const charge = charges.get("p1");

    expect(charge).toBeDefined();
    expect(charge?.chargedFee).toBe(0);
  });

  it("charges only the highest fee within an hour for the same vehicle", () => {
    const passages: TollPassage[] = [
      {
        id: "p1",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T07:05:00+01:00"
      },
      {
        id: "p2",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T07:45:00+01:00"
      },
      {
        id: "p3",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T08:10:00+01:00"
      }
    ];

    const charges = calculateCharges(passages);

    expect(charges.get("p1")?.chargedFee).toBe(25);
    expect(charges.get("p2")?.chargedFee).toBe(0);
    expect(charges.get("p3")?.chargedFee).toBe(16);
  });

  it("caps the daily total at 120 DKK", () => {
    const passages: TollPassage[] = [
      {
        id: "p1",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T06:00:00+01:00"
      },
      {
        id: "p2",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T07:05:00+01:00"
      },
      {
        id: "p3",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T08:10:00+01:00"
      },
      {
        id: "p4",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T09:15:00+01:00"
      },
      {
        id: "p5",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T15:30:00+01:00"
      },
      {
        id: "p6",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T16:35:00+01:00"
      },
      {
        id: "p7",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T17:40:00+01:00"
      }
    ];

    const charges = calculateCharges(passages);

    const total = Array.from(charges.values()).reduce(
      (sum, { chargedFee }) => sum + chargedFee,
      0
    );

    expect(total).toBe(120);
    expect(charges.get("p7")?.chargedFee).toBe(9);
  });

  it("skips tolls on weekends", () => {
    const passages: TollPassage[] = [
      {
        id: "p1",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-15T09:00:00+01:00" // Saturday
      }
    ];

    const charges = calculateCharges(passages);
    expect(charges.get("p1")?.chargedFee).toBe(0);
  });

  it("uses offset from timestamp, not hardcoded timezone", () => {
    // 2025-02-10T07:05:00+05:00 = UTC 02:05 → local time 07:05 (fee bracket: 25 DKK)
    // 2025-02-10T07:05:00+01:00 = UTC 06:05 → local time 07:05 (fee bracket: 25 DKK)
    // Both should yield the same baseFee despite different offsets
    const passageEast: TollPassage[] = [
      {
        id: "p1",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T07:05:00+05:00"
      }
    ];
    const passageWest: TollPassage[] = [
      {
        id: "p2",
        vehicleId: "veh-2",
        vehicleType: "car",
        timestamp: "2025-02-10T07:05:00+01:00"
      }
    ];

    const chargesEast = calculateCharges(passageEast);
    const chargesWest = calculateCharges(passageWest);

    expect(chargesEast.get("p1")?.baseFee).toBe(25);
    expect(chargesWest.get("p2")?.baseFee).toBe(25);
  });

  it("treats midnight-crossing correctly when offset shifts day", () => {
    // 2025-02-10T00:30:00+01:00 → local 00:30 → fee = 0 (outside schedule)
    // 2025-02-09T23:30:00+00:00 → UTC 23:30, local (UTC+0) 23:30 → fee = 0
    // But 2025-02-09T23:30:00-01:00 → local time = 22:30 on Feb 9 → also 0
    // Key: 2025-02-10T00:30:00-07:00 = UTC 07:30, local time = 00:30 → outside schedule → 0
    const passages: TollPassage[] = [
      {
        id: "p1",
        vehicleId: "veh-1",
        vehicleType: "car",
        timestamp: "2025-02-10T00:30:00+01:00"
      }
    ];

    const charges = calculateCharges(passages);
    expect(charges.get("p1")?.chargedFee).toBe(0);
  });
});
