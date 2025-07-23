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
        'Authorization': `Bearer bd42874359116c4be0f0343c99eb669dfdb36b529f287a94c60374fa5b2bb918f542740c44d4630b39025411baf6fc132e0d2466bd499bb25f21f08173c8a826caea64923bcd67a3fffe8aa4683e87e17a940845ca6700306b72d02c0def645a226d2c04a4485758a45fe564b6dc6f81ca7987a9d01341b2bd40c5b439ec4954`, 
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
