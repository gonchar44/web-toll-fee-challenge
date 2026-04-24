import { describe, expect, it } from "vitest";
import { passageFormSchema, type PassageFormValues } from "./passage-form.schema";

const validValues: PassageFormValues = {
    vehicleId: "ABC123",
    vehicleType: "car",
    timestamp: "2024-01-15T08:30:00",
    timezone: "+01:00",
};

describe("passageFormSchema", () => {
    it("accepts valid passage form values", () => {
        expect(passageFormSchema.safeParse(validValues).success).toBe(true);
    });

    it.each([
        ["vehicleId", "Vehicle ID is required"],
        ["vehicleType", "Vehicle type is required"],
        ["timestamp", "Date and time is required"],
        ["timezone", "Timezone is required"],
    ] as const)("requires %s", (field, message) => {
        const result = passageFormSchema.safeParse({ ...validValues, [field]: "" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors[field]).toContain(message);
        }
    });
});
