import { describe, expect, it } from "vitest";
import type { Passage } from "@/types";
import { groupPassages } from "./group-passages";

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

describe("groupPassages", () => {
    it("groups passages by vehicle ID and the local date portion of the timestamp", () => {
        const groups = groupPassages([
            passage({ id: "same-vehicle-day-1", vehicleId: "ABC123", timestamp: "2024-01-15T08:00:00+01:00" }),
            passage({ id: "same-vehicle-day-2", vehicleId: "ABC123", timestamp: "2024-01-15T09:00:00+02:00" }),
            passage({ id: "different-day", vehicleId: "ABC123", timestamp: "2024-01-16T08:00:00+01:00" }),
            passage({ id: "different-vehicle", vehicleId: "XYZ789", timestamp: "2024-01-15T08:00:00+01:00" }),
        ]);

        expect(groups).toHaveLength(3);
        expect(groups.map((group) => group.key)).toEqual([
            "ABC123__2024-01-16",
            "ABC123__2024-01-15",
            "XYZ789__2024-01-15",
        ]);
        expect(groups.find((group) => group.key === "ABC123__2024-01-15")?.passages.map((item) => item.id)).toEqual([
            "same-vehicle-day-1",
            "same-vehicle-day-2",
        ]);
    });

    it("sorts passages within each group from newest to oldest", () => {
        const [group] = groupPassages([
            passage({ id: "oldest", timestamp: "2024-01-15T08:00:00+01:00" }),
            passage({ id: "newest", timestamp: "2024-01-15T11:00:00+01:00" }),
            passage({ id: "middle", timestamp: "2024-01-15T09:00:00+01:00" }),
        ]);

        expect(group.latest.id).toBe("newest");
        expect(group.passages.map((item) => item.id)).toEqual(["newest", "middle", "oldest"]);
    });

    it("sorts groups by their latest passage from newest to oldest", () => {
        const groups = groupPassages([
            passage({ id: "middle-group", vehicleId: "MID123", timestamp: "2024-01-15T09:00:00+01:00" }),
            passage({ id: "newest-group", vehicleId: "NEW123", timestamp: "2024-01-16T08:00:00+01:00" }),
            passage({ id: "oldest-group", vehicleId: "OLD123", timestamp: "2024-01-14T12:00:00+01:00" }),
        ]);

        expect(groups.map((group) => group.latest.id)).toEqual(["newest-group", "middle-group", "oldest-group"]);
    });
});
