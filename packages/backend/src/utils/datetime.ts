const HOLIDAYS_BY_YEAR: Record<number, string[]> = {
  2024: [
    "01-01",
    "03-28",
    "03-29",
    "04-01",
    "05-09",
    "05-19",
    "05-20",
    "12-24",
    "12-25",
    "12-26",
  ],
  2025: [
    "01-01",
    "04-17",
    "04-18",
    "04-19",
    "04-20",
    "04-21",
    "05-29",
    "06-08",
    "06-09",
    "12-24",
    "12-25",
    "12-26",
  ],
};

export function parseOffsetMinutes(timestamp: string): number {
  const match = timestamp.match(/([+-])(\d{2}):(\d{2})$/);
  if (!match) return 0;
  const sign = match[1] === "+" ? 1 : -1;
  return sign * (parseInt(match[2], 10) * 60 + parseInt(match[3], 10));
}

function applyOffset(date: Date, offsetMinutes: number): Date {
  return new Date(date.getTime() + offsetMinutes * 60 * 1000);
}

export function getLocalDateKey(date: Date, offsetMinutes: number): string {
  const local = applyOffset(date, offsetMinutes);
  const year = local.getUTCFullYear();
  const month = `${local.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${local.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isWeekend(date: Date, offsetMinutes: number): boolean {
  const local = applyOffset(date, offsetMinutes);
  const day = local.getUTCDay();
  return day === 0 || day === 6;
}

export function isHoliday(date: Date, offsetMinutes: number): boolean {
  const local = applyOffset(date, offsetMinutes);
  const year = local.getUTCFullYear();
  const month = `${local.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${local.getUTCDate()}`.padStart(2, "0");
  const key = `${month}-${day}`;
  const holidays = HOLIDAYS_BY_YEAR[year];
  if (!holidays) {
    return false;
  }

  return holidays.includes(key);
}

export function getMinutesSinceMidnight(
  date: Date,
  offsetMinutes: number
): number {
  const local = applyOffset(date, offsetMinutes);
  return local.getUTCHours() * 60 + local.getUTCMinutes();
}
