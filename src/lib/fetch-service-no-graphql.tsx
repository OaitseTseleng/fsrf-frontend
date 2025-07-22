const API_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.STRAPI_API_TOKEN || "bd42874359116c4be0f0343c99eb669dfdb36b529f287a94c60374fa5b2bb918f542740c44d4630b39025411baf6fc132e0d2466bd499bb25f21f08173c8a826caea64923bcd67a3fffe8aa4683e87e17a940845ca6700306b72d02c0def645a226d2c04a4485758a45fe564b6dc6f81ca7987a9d01341b2bd40c5b439ec4954"; // Add this env var in .env.local

export default async function fetchStrapi<T = any>(
  path: string,
  params: Record<string, string> = {},
  token?: string // optional override per-request
): Promise<T> {
  const url = new URL(`${API_BASE}/api/${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || API_TOKEN}`, // include token here
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi REST error ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json;
}
