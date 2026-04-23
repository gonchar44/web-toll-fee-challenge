import { CreatePassagePayload, Passage } from "@/types";
import { apiDelete, apiGetList, apiPost } from "@/lib/api/http-client";

const PASSAGES_ENDPOINT = "/api/passages";

export function fetchPassages(): Promise<Passage[]> {
    return apiGetList<Passage[]>(PASSAGES_ENDPOINT);
}

export function createPassage(payload: CreatePassagePayload): Promise<void> {
    return apiPost(PASSAGES_ENDPOINT, payload);
}

export function deletePassage(id: string): Promise<void> {
    return apiDelete(`${PASSAGES_ENDPOINT}/${id}`);
}
