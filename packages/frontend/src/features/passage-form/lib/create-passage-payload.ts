import type { CreatePassagePayload } from "@/types";
import type { PassageFormValues } from "../model/passage-form.schema";

export function createPassagePayload(values: PassageFormValues): CreatePassagePayload {
    return {
        vehicleId: values.vehicleId,
        vehicleType: values.vehicleType,
        timestamp: `${values.timestamp}${values.timezone}`,
    };
}
