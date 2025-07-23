// pages/api/unsubscribe.ts
import type { NextApiRequest, NextApiResponse } from 'next'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const TOKEN = process.env.STRAPI_API_TOKEN || 'bd42874359116c4be0f0343c99eb669dfdb36b529f287a94c60374fa5b2bb918f542740c44d4630b39025411baf6fc132e0d2466bd499bb25f21f08173c8a826caea64923bcd67a3fffe8aa4683e87e17a940845ca6700306b72d02c0def645a226d2c04a4485758a45fe564b6dc6f81ca7987a9d01341b2bd40c5b439ec4954'// your Strapi bearer token

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
