export interface TimezoneOffset {
    value: string;
    label: string;
}

function buildOffsetString(totalMinutes: number): string {
    const sign = totalMinutes >= 0 ? "+" : "-";
    const abs = Math.abs(totalMinutes);
    const h = String(Math.floor(abs / 60)).padStart(2, "0");
    const m = String(abs % 60).padStart(2, "0");
    return `${sign}${h}:${m}`;
}

export function generateTimezoneOffsets(): TimezoneOffset[] {
    const offsets: TimezoneOffset[] = [];
    // UTC-12:00 to UTC+14:00 in 30-minute increments
    for (let minutes = -12 * 60; minutes <= 14 * 60; minutes += 30) {
        const value = buildOffsetString(minutes);
        const label = minutes === 0 ? "UTC±00:00" : `UTC${value}`;
        offsets.push({ value, label });
    }
    return offsets;
}

export function getBrowserTimezoneOffset(): string {
    // getTimezoneOffset() returns minutes BEHIND UTC, so negate it
    return buildOffsetString(-new Date().getTimezoneOffset());
}
