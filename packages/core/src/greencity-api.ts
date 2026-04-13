// ────────────────────────────────────────────
// GreenCity ERP API - Direct Integration
// ────────────────────────────────────────────

export type GreenCityObjective = "PRINCIPAL_RESIDENCE" | "INVEST" | "RENTAL" | "LAND";
export type PurchaseTime = "NOW" | "6_MONTHS";
export type FinancingValidation = "YES" | "NO" | "IN_PROGRESS";
export type GreenCityLeadState =
  | "NEW"
  | "DISCOVERY_CALL"
  | "APPOINTMENT"
  | "RESERVATION"
  | "ACTED"
  | "LOST";

export interface GreenCityLeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneMobile?: string;
  objective?: GreenCityObjective;
  purchaseTime?: PurchaseTime;
  financingValidation?: FinancingValidation;
  appointmentDate?: string;
  comment?: string;
  residences?: string[];
}

export interface GreenCityLead {
  firstName: string;
  lastName: string;
  email: string;
  phoneMobile?: string | null;
  phoneLandline?: string | null;
  state: GreenCityLeadState;
  lostReason?: string | null;
}

export interface GreenCityLeadCollection {
  limit: number;
  offset: number;
  total: number;
  data: GreenCityLead[];
}

export interface FetchGreenCityLeadsParams {
  offset?: number;
  limit?: number;
}

export interface GreenCityResidence {
  id: number;
  name: string;
}

// ────────────────────────────────────────────
// JWT Auth - Token caching
// ────────────────────────────────────────────

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

function getApiConfig() {
  const baseUrl = process.env.GREENCITY_API_URL;
  const apiKey = process.env.GREENCITY_API_KEY;
  const apiSecret = process.env.GREENCITY_API_SECRET;

  if (!apiKey || !apiSecret || !baseUrl) {
    throw new Error(
      "GREENCITY_API_KEY, GREENCITY_API_SECRET, and GREENCITY_API_URL must be set in environment variables",
    );
  }

  return { baseUrl, apiKey, apiSecret };
}

async function getAuthToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const { baseUrl, apiKey, apiSecret } = getApiConfig();

  console.log("url:", `${baseUrl}/api/login`);

  const response = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, api_secret: apiSecret }),
    cache: "no-store",
  });

  console.log("response:", response);

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`GreenCity auth failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  cachedToken = data.token;
  // Expire 5 minutes before actual expiry for safety
  tokenExpiresAt = Date.now() + 55 * 60 * 1000;

  return cachedToken!;
}

// ────────────────────────────────────────────
// Create Lead
// ────────────────────────────────────────────

export async function createGreenCityLead(
  payload: GreenCityLeadPayload,
): Promise<{ id: string;[key: string]: unknown }> {
  const { baseUrl } = getApiConfig();
  const token = await getAuthToken();

  // Remove undefined values
  const body: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      body[key] = value;
    }
  }

  const response = await fetch(`${baseUrl}/api/lead`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    // If 401, clear cached token and retry once
    if (response.status === 401 && cachedToken) {
      cachedToken = null;
      tokenExpiresAt = 0;
      return createGreenCityLead(payload);
    }

    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `GreenCity API error (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}

export async function fetchGreenCityLeads({
  offset,
  limit,
}: FetchGreenCityLeadsParams = {}): Promise<GreenCityLeadCollection> {
  const { baseUrl } = getApiConfig();
  const token = await getAuthToken();
  const url = new URL("/api/lead", baseUrl);

  if (offset !== undefined) {
    url.searchParams.set("offset", String(offset));
  }

  if (limit !== undefined) {
    url.searchParams.set("limit", String(limit));
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401 && cachedToken) {
      cachedToken = null;
      tokenExpiresAt = 0;
      return fetchGreenCityLeads({ offset, limit });
    }

    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `GreenCity API error (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}

export async function fetchGreenCityResidences(): Promise<GreenCityResidence[]> {
  const { baseUrl } = getApiConfig();
  const token = await getAuthToken();
  const url = new URL("/api/lead/residences", baseUrl);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401 && cachedToken) {
      cachedToken = null;
      tokenExpiresAt = 0;
      return fetchGreenCityResidences();
    }

    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `GreenCity API error (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}
