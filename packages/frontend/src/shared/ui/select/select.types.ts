import type { ReactNode } from "react";

export interface DropdownOption {
    value: string;
    label: string;
    icon?: string | ReactNode;
    badge?: {
        text: string;
        variant?: "warning" | "success" | "danger" | "info" | "primary";
    };
    disabled?: boolean;
}

export interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: DropdownOption[];
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    searchable?: boolean;
    emptyMessage?: string;
}
