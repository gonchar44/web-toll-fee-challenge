import type { Passage } from "@/types";
import type { PassageGroup } from "../model/passage-group.types";

// Groups by vehicleId + the local date portion of the timestamp string.
// The date is extracted directly from the ISO string to respect the recorded timezone.
const getDateKey = (timestamp: string): string => timestamp.slice(0, 10);

export const groupPassages = (passages: Passage[]): PassageGroup[] => {
    const buckets = new Map<string, Passage[]>();

    for (const passage of passages) {
        const key = `${passage.vehicleId}__${getDateKey(passage.timestamp)}`;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key)!.push(passage);
    }

    const groups: PassageGroup[] = Array.from(buckets.entries()).map(([key, group]) => {
        const sorted = [...group].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return { key, latest: sorted[0], passages: sorted };
    });

    return groups.sort((a, b) => new Date(b.latest.timestamp).getTime() - new Date(a.latest.timestamp).getTime());
};
