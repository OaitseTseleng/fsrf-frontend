import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emails, resource } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0 || !resource) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const subject = `Resource Shared: ${resource.title}`;
  const text = `
A new resource has been shared with you.

Title: ${resource.title}
Description: ${resource.description}

Shared via the reporting portal.
`;

  let attachments = [];

  // Fetch and attach file if available
  if (resource.downloadAllFile) {
    try {
      const response = await fetch("http://13.218.95.118:1337" + resource.downloadAllFile);
      if (!response.ok) throw new Error('Failed to fetch attachment');

      const buffer = await response.arrayBuffer();
      const filename = resource.downloadAllFile.split('/').pop() || 'attachment';

      attachments.push({
        filename,
        content: Buffer.from(buffer),
      });
    } catch (err) {
      console.warn('Failed to attach file:', err);
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: emails.join(','),
      subject,
      text,
      attachments,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email', detail: error.message });
  }
}
