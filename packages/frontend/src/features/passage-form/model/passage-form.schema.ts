import { z } from "zod";

export const passageFormSchema = z.object({
    vehicleId: z.string().min(1, "Vehicle ID is required"),
    vehicleType: z.string().min(1, "Vehicle type is required"),
    timestamp: z.string().min(1, "Date and time is required"),
});

export type PassageFormValues = z.infer<typeof passageFormSchema>;
