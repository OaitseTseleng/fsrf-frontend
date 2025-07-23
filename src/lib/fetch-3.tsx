// src/lib/fetch-service-no-graphql.tsx
// A simple helper to call Strapi REST API endpoints without GraphQL

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.FSRF_BACKEND_TOKEN || '313f122d227a4b4a6d1e637b64c654cb2aa66007aed538f2aa6395277f963684f49566bac094dd143f263da75e0c1cd7903dc505032e99b92d050d08fbe8907c802fe27e0cef06f6cbcbddd26a3b7fa6bedb24af7d19da5a2295e3b5ce4a3d9325550cd79eb0254ce9d599e7adba376c415215ca213c0cb29eef05e065a614ff'; // optional Bearer token

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
