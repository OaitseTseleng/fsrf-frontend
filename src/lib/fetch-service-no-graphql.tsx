const API_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://13.218.95.118:1337";
const API_TOKEN = process.env.FSRF_BACKEND_TOKEN || '313f122d227a4b4a6d1e637b64c654cb2aa66007aed538f2aa6395277f963684f49566bac094dd143f263da75e0c1cd7903dc505032e99b92d050d08fbe8907c802fe27e0cef06f6cbcbddd26a3b7fa6bedb24af7d19da5a2295e3b5ce4a3d9325550cd79eb0254ce9d599e7adba376c415215ca213c0cb29eef05e065a614ff'; // Add this env var in .env.local

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
