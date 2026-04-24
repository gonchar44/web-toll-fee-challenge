// Extracts the local date and time directly from the ISO string to avoid
// timezone shifts when re-parsing with the browser's local timezone.
// e.g. "2024-01-15T08:30:00+02:00" → { datePart: "2024-01-15", timeStr: "08:30" }
function parseTimestamp(timestamp: string): { year: number; month: number; day: number; timeStr: string } {
    const [datePart, timeAndOffset] = timestamp.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const timeStr = timeAndOffset?.slice(0, 5) ?? "00:00";
    return { year, month, day, timeStr };
}

export function formatPassageDateTime(timestamp: string): string {
    const { year, month, day, timeStr } = parseTimestamp(timestamp);
    const date = new Date(year, month - 1, day);
    const dateFmt = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
    return `${dateFmt} · ${timeStr}`;
}

export function formatPassageTime(timestamp: string): string {
    return parseTimestamp(timestamp).timeStr;
}
