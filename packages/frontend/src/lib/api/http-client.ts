import { ApiListResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

async function parseResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let message = res.statusText;
        try {
            const body = await res.json();
            if (typeof body?.message === "string") message = body.message;
        } catch {
            // ignore parse errors — use statusText
        }
        throw new ApiError(res.status, message);
    }

    if (res.status === 204) return undefined as T;

    return res.json() as Promise<T>;
}

export async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: { Accept: "application/json" },
    });
    return parseResponse<T>(res);
}

export async function apiGetList<T>(path: string): Promise<T> {
    const raw = await apiGet<ApiListResponse<T>>(path);
    return raw.data;
}

export async function apiPost<TBody, TResult = void>(
    path: string,
    body: TBody,
): Promise<TResult> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(body),
    });
    return parseResponse<TResult>(res);
}

export async function apiDelete(path: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: "DELETE",
    });
    return parseResponse<void>(res);
}
