import { describe, expect, it } from "vitest";
import { formatPassageDateTime, formatPassageTime } from "./format-date";

describe("formatPassageDateTime", () => {
    it("formats the local date and time from the timestamp string", () => {
        expect(formatPassageDateTime("2024-01-15T08:30:00+02:00")).toBe("Mon, 15 Jan 2024 · 08:30");
    });

    it("does not shift the displayed date or time based on the timestamp offset", () => {
        expect(formatPassageDateTime("2024-01-15T00:30:00+14:00")).toBe("Mon, 15 Jan 2024 · 00:30");
        expect(formatPassageDateTime("2024-01-15T23:30:00-11:00")).toBe("Mon, 15 Jan 2024 · 23:30");
    });

    it("falls back to midnight when the timestamp has no time part", () => {
        expect(formatPassageDateTime("2024-01-15")).toBe("Mon, 15 Jan 2024 · 00:00");
    });
});

describe("formatPassageTime", () => {
    it("returns the local HH:mm portion of the timestamp", () => {
        expect(formatPassageTime("2024-01-15T08:30:00+02:00")).toBe("08:30");
    });

    it("falls back to midnight when the timestamp has no time part", () => {
        expect(formatPassageTime("2024-01-15")).toBe("00:00");
    });
});
