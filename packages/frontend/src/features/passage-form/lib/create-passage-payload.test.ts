import { describe, expect, it } from "vitest";
import { createPassagePayload } from "./create-passage-payload";

describe("createPassagePayload", () => {
    it("maps passage form values to the API payload", () => {
        expect(
            createPassagePayload({
                vehicleId: "ABC123",
                vehicleType: "car",
                timestamp: "2024-01-15T08:30:00",
                timezone: "+01:00",
            }),
        ).toEqual({
            vehicleId: "ABC123",
            vehicleType: "car",
            timestamp: "2024-01-15T08:30:00+01:00",
        });
    });

    it("keeps negative timezone offsets in the submitted timestamp", () => {
        expect(
            createPassagePayload({
                vehicleId: "XYZ789",
                vehicleType: "motorbike",
                timestamp: "2024-06-01T18:45:00",
                timezone: "-03:30",
            }),
        ).toMatchObject({
            timestamp: "2024-06-01T18:45:00-03:30",
        });
    });
});
