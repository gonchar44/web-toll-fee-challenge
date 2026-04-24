import { ApiListResponse, CreatePassagePayload, Passage } from "@/types";
import { apiDelete, apiGetList, apiPost } from "@/lib/api/http-client";

const PASSAGES_ENDPOINT = "/api/passages";

export function fetchPassages(): Promise<Passage[]> {
    return apiGetList<Passage[]>(PASSAGES_ENDPOINT);
}

export async function createPassage(payload: CreatePassagePayload): Promise<Passage> {
    const raw = await apiPost<CreatePassagePayload, ApiListResponse<Passage>>(PASSAGES_ENDPOINT, payload);
    return raw.data;
}

export function deletePassage(id: string): Promise<void> {
    return apiDelete(`${PASSAGES_ENDPOINT}/${id}`);
}
