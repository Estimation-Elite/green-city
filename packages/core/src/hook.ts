type HookPayload = Record<string, unknown>;

export async function sendHookRequest<T = unknown>(
  url: string,
  payload: HookPayload,
): Promise<T> {
  if (!url) {
    throw new Error("Hook URL is not set");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Hook request failed (${response.status}): ${message}`);
  }

  if (response.headers.get("content-type")?.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return {} as T;
}
