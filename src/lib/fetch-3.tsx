// src/lib/fetch-service-no-graphql.tsx
// A simple helper to call Strapi REST API endpoints without GraphQL

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.FSRF_BACKEND_TOKEN || '9000b94102da009d6e2788b4f6bedd92228317ea126a99c4a7be91e1a63a8b94981e5a609674c715abecb70090277d4d65b632d8d944a849bd18b2e11ae73ba47e24db10a32b6832fe28df6809bbdf72953c225812729a25dc7e0b25f958591125d1735850a999554b8855ef702ec39eb26df3f803cfa896ed7f781fbd8a8bcc'; // optional Bearer token

interface StrapiResponse<T> {
  data: T;
  meta?: any;
  error?: {
    status: number;
    name: string;
    message: string;
    details: any;
  };
}

/**
 * Fetch data from Strapi REST API
 * @param path - the path under `/api`, including leading `/`, e.g. `/organisations?filters[slug][$eq]=slug`
 * @returns parsed JSON response with `data` always defined (empty array on 404)
 */
export default async function fetchStrapi<T = any>(path: string): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}/api${path}`;
  const headers: Record<string,string> = {
    "Content-Type": "application/json",
  };
  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }

  const res = await fetch(url, { headers });

  // Handle 404 by returning empty data rather than throwing
  if (res.status === 404) {
    return { data: [] as unknown as T };
  }

  let json: StrapiResponse<T>;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error(`Failed to parse JSON from Strapi (${res.status}): ${(err as Error).message}`);
  }

  // If Strapi reports an error, or any HTTP error ≥400
  if (res.status >= 400) {
    // For 404 with Strapi error payload, treat like empty data
    if (res.status === 404 || json.error?.status === 404) {
      return { data: [] as unknown as T };
    }
    const errMsg = json.error
      ? `${json.error.name} (${json.error.status}): ${json.error.message}`
      : `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(`Strapi REST error: ${errMsg}`);
  }

  return json;
}
