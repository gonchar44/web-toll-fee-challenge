import { useMemo } from "react";
import { Select } from "@/shared/ui/select/select";
import type { DropdownOption } from "@/shared/ui/select/select.types";
import { generateTimezoneOffsets } from "../lib/timezone-offsets";

interface TimezoneOffsetSelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}

export function TimezoneOffsetSelect({ value, onChange, disabled, error }: TimezoneOffsetSelectProps) {
    const options = useMemo<DropdownOption[]>(
        () => generateTimezoneOffsets().map((tz) => ({ value: tz.value, label: tz.label })),
        [],
    );

    return (
        <Select
            value={value}
            onChange={onChange}
            options={options}
            placeholder="Select timezone"
            disabled={disabled}
            error={error}
            searchable
            emptyMessage="No matching timezone found."
        />
    );
}
