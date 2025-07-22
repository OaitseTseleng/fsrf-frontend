// src/lib/fetch-service-no-graphql.tsx
// A simple helper to call Strapi REST API endpoints without GraphQL

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || 'bd42874359116c4be0f0343c99eb669dfdb36b529f287a94c60374fa5b2bb918f542740c44d4630b39025411baf6fc132e0d2466bd499bb25f21f08173c8a826caea64923bcd67a3fffe8aa4683e87e17a940845ca6700306b72d02c0def645a226d2c04a4485758a45fe564b6dc6f81ca7987a9d01341b2bd40c5b439ec4954'; // optional Bearer token

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
