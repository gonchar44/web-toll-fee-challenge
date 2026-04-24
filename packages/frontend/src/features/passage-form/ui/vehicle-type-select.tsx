import type { VehicleTypeOption } from "@/types";
import { Select } from "@/shared/ui/select/select";
import type { DropdownOption } from "@/shared/ui/select/select.types";
import { VEHICLE_TYPE_ICON, VEHICLE_TYPE_FALLBACK_ICON } from "../lib/vehicle-type-icons";

interface VehicleTypeSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: VehicleTypeOption[];
    disabled?: boolean;
    error?: string;
}

function toDropdownOptions(options: VehicleTypeOption[]): DropdownOption[] {
    return options.map((opt) => ({
        value: opt.vehicleType,
        label: opt.vehicleType,
        icon: VEHICLE_TYPE_ICON[opt.vehicleType] ?? VEHICLE_TYPE_FALLBACK_ICON,
        badge: opt.tollFree ? { text: "toll-free", variant: "warning" as const } : undefined,
    }));
}

export function VehicleTypeSelect({ value, onChange, options, disabled, error }: VehicleTypeSelectProps) {
    return (
        <Select
            value={value}
            onChange={onChange}
            options={toDropdownOptions(options)}
            placeholder="Select vehicle type"
            disabled={disabled}
            error={error}
        />
    );
}
