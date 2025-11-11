const rawBase = import.meta.env.VITE_API_URL?.trim() ?? "/api";
const API_BASE_URL = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type ApiFetchOptions = RequestInit & {
  skipJson?: boolean;
};

function isJsonLike(body: BodyInit | null | undefined) {
  if (!body) return false;
  if (body instanceof FormData || body instanceof Blob) return false;
  return true;
}

export async function apiFetch<TResponse>(path: string, options: ApiFetchOptions = {}): Promise<TResponse> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body && isJsonLike(options.body)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (options.skipJson) {
    if (!response.ok) {
      throw new Error(`Erro ao chamar API (${response.status})`);
    }
    return undefined as TResponse;
  }

  const text = await response.text();
  const parsed = text ? safeParseJson(text) : null;

  if (!response.ok) {
    const message = parsed?.message || parsed?.detail || `Erro ao chamar API (${response.status})`;
    throw new ApiError(message, response.status, parsed);
  }

  return parsed as TResponse;
}

function safeParseJson(payload: string) {
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export { API_BASE_URL };
