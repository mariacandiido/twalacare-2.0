type HttpMethod = "GET" | "POST" | "PUT" | "PATCH";

const baseUrl = (import.meta as any).env?.VITE_API_URL ?? "";

async function request<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  extraHeaders?: Record<string, string>,
): Promise<{ data: T }> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(extraHeaders ?? {}),
  };

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body == null ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T };
  }

  // Fallback for empty or non-JSON responses
  return { data: (await response.text()) as unknown as T };
}

export const api = {
  get: <T = unknown>(path: string) => request<T>(path, "GET"),
  post: <T = unknown>(path: string, body?: unknown, options?: { headers?: Record<string, string> }) =>
    request<T>(path, "POST", body, options?.headers),
  put: <T = unknown>(path: string, body?: unknown) => request<T>(path, "PUT", body),
  patch: <T = unknown>(path: string, body?: unknown) => request<T>(path, "PATCH", body),
};
