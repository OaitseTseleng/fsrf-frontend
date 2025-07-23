import type { NextApiRequest, NextApiResponse } from 'next';
import fetchStrapi from '@/lib/fetch-3'; // adjust if needed
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
    // Fetch subscribers from Strapi
    const strapiRes = await fetchStrapi(`http://localhost:1337/api/subscriptions`);
    const subscribers = strapiRes?.data || [];

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

    // Send emails in parallel
    const sendList = subscribers.map((sub: any) =>
      transporter.sendMail({
        from: `"FSRF" <${process.env.SMTP_USER}>`,
        to: sub.email,
        subject,
        text: message,
      })
    );

    await Promise.allSettled(sendList);

    res.status(200).json({ status: 'Notifications sent', count: subscribers.length });
  } catch (err: any) {
    console.error('Notification error:', err);
    res.status(500).json({ error: 'Failed to notify subscribers' });
  }
}
