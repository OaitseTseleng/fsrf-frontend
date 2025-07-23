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
        'Authorization': `Bearer 313f122d227a4b4a6d1e637b64c654cb2aa66007aed538f2aa6395277f963684f49566bac094dd143f263da75e0c1cd7903dc505032e99b92d050d08fbe8907c802fe27e0cef06f6cbcbddd26a3b7fa6bedb24af7d19da5a2295e3b5ce4a3d9325550cd79eb0254ce9d599e7adba376c415215ca213c0cb29eef05e065a614ff`, 
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
