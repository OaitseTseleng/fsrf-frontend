import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { event, model, entry } = req.body;

  if (event !== 'entry.publish' || !model || !entry || !entry.createdAt || !entry.updatedAt) {
    console.log('Invalid webhook payload:', req.body);
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  // Determine if it's a new publish or an update
  const isNew = entry.createdAt === entry.updatedAt;

  const subject = isNew
    ? 'New content has been published on the site!'
    : 'Site content has been updated!';
  const message = isNew
    ? 'Hello! New content is now available on our site. Come take a look.'
    : 'Hello! Some updates have been made to our site content. Come check it out.';

  try {
    // Fetch subscribers from Strapi with token in Authorization header
    const fetchRes = await fetch(`http://localhost:1337/api/subscriptions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 9000b94102da009d6e2788b4f6bedd92228317ea126a99c4a7be91e1a63a8b94981e5a609674c715abecb70090277d4d65b632d8d944a849bd18b2e11ae73ba47e24db10a32b6832fe28df6809bbdf72953c225812729a25dc7e0b25f958591125d1735850a999554b8855ef702ec39eb26df3f803cfa896ed7f781fbd8a8bcc`, 
      },
    });

    const json = await fetchRes.json(); // parse the JSON body

    const subscribers = json?.data || []; // Strapi wraps content in `data`

    if (subscribers.length === 0) {
      console.log('No subscribers found');
      return res.status(200).json({ status: 'No subscribers to notify' });
    }

    // Set up nodemailer transporter (use real credentials in production)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    console.log('subscribers found', subscribers);

    // Send emails in parallel
    const sendList = subscribers.map((sub: any) =>
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: sub.email,
        subject,
        text: message,
      })
    );

    await Promise.allSettled(sendList);

    return res.status(200).json({ status: "Notifications sent", count: subscribers.length });
  } catch (err: any) {
    console.error('Notification error:', err);
    return res.status(500).json({ error: 'Failed to notify subscribers' });
  }
}
