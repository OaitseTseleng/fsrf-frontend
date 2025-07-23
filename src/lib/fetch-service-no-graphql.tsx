const API_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.FSRF_BACKEND_TOKEN || '9000b94102da009d6e2788b4f6bedd92228317ea126a99c4a7be91e1a63a8b94981e5a609674c715abecb70090277d4d65b632d8d944a849bd18b2e11ae73ba47e24db10a32b6832fe28df6809bbdf72953c225812729a25dc7e0b25f958591125d1735850a999554b8855ef702ec39eb26df3f803cfa896ed7f781fbd8a8bcc'; // Add this env var in .env.local

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
