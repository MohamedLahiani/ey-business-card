import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { db } from '../config/db';

export const emailBusinessCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { to } = req.body;

  try {
    const [rows]: any = await db.query('SELECT * FROM business_card WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Business card not found' });

    const card = rows[0];
    const vCard = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${card.first_name} ${card.last_name}\r\nEMAIL:${card.email}\r\nTEL:${card.mobile}\r\nEND:VCARD`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mohamedlahiani11@gmail.com',
        pass: 'aueb vssj nzrg qupr',
      },
    });

    await transporter.sendMail({
      from: 'mohamedlahiani1@gmail.com',
      to : 'adharyoussef2002@gmail.com',
      subject: 'Your Business Card',
      text: 'Please find your digital business card attached.',
      attachments: [
        {
          filename: 'business_card.vcf',
          content: vCard,
        },
      ],
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
};
