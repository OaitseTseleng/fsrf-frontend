import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import nodemailer from 'nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';

// Disable the default body parser for handling file uploads
export const config = {
  api: {
    bodyParser: false, // Disable default body parsing for file uploads
  },
};

// POST handler for receiving the whistleblower report
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    multiples: true, // Allow multiple files
    keepExtensions: true, // Keep file extensions
    uploadDir: '/tmp', // Directory where files will be stored temporarily
  });

  return new Promise((resolve, reject) => {
    // Parse the incoming form data
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form error:', err);
        return res.status(500).json({ error: 'Failed to parse form' });
      }

      const name = fields.name?.[0] || 'Anonymous';
      const email = fields.email?.[0] || 'Anonymous';
      const message = fields.message?.[0] || '';

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Prepare attachments if any
      const attachments = [];
      const uploadedFiles = files.attachments
        ? Array.isArray(files.attachments)
          ? files.attachments
          : [files.attachments]
        : [];

      for (const file of uploadedFiles) {
        attachments.push({
          filename: file.originalFilename || 'file',
          content: await fs.readFile(file.filepath),
        });
      }

      // Send the email using nodemailer
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true', // Adjust based on your mail server
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.WHISTLEBLOWER_EMAIL || process.env.SMTP_USER,
          to: process.env.WHISTLEBLOWER_EMAIL || process.env.SMTP_USER,
          subject: 'New Whistleblower Report',
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
          attachments, // Attach files if any
        });

        // Respond with success
        res.status(200).json({ success: true });
      } catch (error: any) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Email failed', detail: error.message });
      }
    });
  });
}
