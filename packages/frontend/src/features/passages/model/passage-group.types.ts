import type { Passage } from "@/types";

export interface PassageGroup {
    key: string;
    latest: Passage;
    passages: Passage[];
}
