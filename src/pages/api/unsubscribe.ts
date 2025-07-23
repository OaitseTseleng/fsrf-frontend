// pages/api/unsubscribe.ts
import type { NextApiRequest, NextApiResponse } from 'next'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const TOKEN = process.env.STRAPI_API_TOKEN || '313f122d227a4b4a6d1e637b64c654cb2aa66007aed538f2aa6395277f963684f49566bac094dd143f263da75e0c1cd7903dc505032e99b92d050d08fbe8907c802fe27e0cef06f6cbcbddd26a3b7fa6bedb24af7d19da5a2295e3b5ce4a3d9325550cd79eb0254ce9d599e7adba376c415215ca213c0cb29eef05e065a614ff'// your Strapi bearer token

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Missing email' })

  try {
    // 1) Fetch the subscription record
    const filterUrl = `${STRAPI_URL}/api/subscriptions?filters[email][$eq]=${encodeURIComponent(email)}`
    const findResp = await fetch(filterUrl, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
    if (!findResp.ok) throw new Error(`Lookup failed (${findResp.status})`)
    const findJson = await findResp.json()

    const data = findJson.data
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' })
    }

    const documentId = data[0].documentId

    // 2) Delete by ID
    const delUrl = `${STRAPI_URL}/api/subscriptions/${documentId}`
    const delResp = await fetch(delUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
    if (!delResp.ok) throw new Error(`Delete failed (${delResp.status})`)

    // 3) Return success
    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('Unsubscribe error:', error)
    return res
      .status(500)
      .json({ error: error.message || 'Failed to unsubscribe' })
  }
}
