import cx from "clsx";
import type { VehicleTypeOption } from "@/types";
import { VEHICLE_TYPE_ICON, VEHICLE_TYPE_FALLBACK_ICON } from "../lib/vehicle-type-icons";
import styles from "./vehicle-type-select.module.css";

interface VehicleTypeSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: VehicleTypeOption[];
    disabled?: boolean;
}

export function VehicleTypeSelect({ value, onChange, options, disabled }: VehicleTypeSelectProps) {
    return (
        <div className={cx("select is-fullwidth", { [styles.autoFilled]: disabled && value })}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            >
                <option value="">Select vehicle type</option>
                {options.map((opt) => (
                    <option key={opt.vehicleType} value={opt.vehicleType}>
                        {VEHICLE_TYPE_ICON[opt.vehicleType] ?? VEHICLE_TYPE_FALLBACK_ICON}{" "}
                        {opt.vehicleType}
                        {opt.tollFree ? " · toll-free" : ""}
                    </option>
                ))}
            </select>
        </div>
    );
}
