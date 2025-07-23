// pages/api/unsubscribe.ts
import type { NextApiRequest, NextApiResponse } from 'next'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const TOKEN = process.env.STRAPI_API_TOKEN || '9000b94102da009d6e2788b4f6bedd92228317ea126a99c4a7be91e1a63a8b94981e5a609674c715abecb70090277d4d65b632d8d944a849bd18b2e11ae73ba47e24db10a32b6832fe28df6809bbdf72953c225812729a25dc7e0b25f958591125d1735850a999554b8855ef702ec39eb26df3f803cfa896ed7f781fbd8a8bcc'// your Strapi bearer token

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
