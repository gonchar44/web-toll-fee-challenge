"use client";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import cx from "clsx";
import styles from "./passage-date-time-input.module.css";

function formatLocalDateTime(date: Date): string {
    const p = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
}

interface PassageDateTimeInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}

export function PassageDateTimeInput({ value, onChange, disabled, error }: PassageDateTimeInputProps) {
    return (
        <div className={styles.wrapper}>
            <Flatpickr
                value={value}
                options={{
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    time_24hr: true,
                    minuteIncrement: 1,
                    allowInput: true,
                }}
                onChange={([date]) => {
                    if (!date) return;
                    onChange(formatLocalDateTime(date));
                }}
                render={({ value: _v, render: _r, ...props }, ref) => (
                    <input
                        {...props}
                        ref={ref}
                        className={cx("input", { "is-danger": error })}
                        placeholder="YYYY-MM-DD HH:MM"
                        disabled={disabled}
                        readOnly={false}
                    />
                )}
            />
            <span className={styles.calendarIcon}>📅</span>
        </div>
    );
}
