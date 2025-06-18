import QRCode from 'qrcode';  // Import QR Code library
import { Request, Response } from 'express';
import { db } from '../config/db';  // Import DB connection


// Controller to generate QR code for a business card (permanent URL strategy)
export const getBusinessCardQRCodeURL = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if business card exists
    const [rows]: any = await db.query('SELECT * FROM business_card WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Business Card not found' });
    }

    // Permanent URL to download latest vCard
    const qrURL = `https://ey-business-card.com/api/business-card/${id}/download-vcard`;

    // Generate QR code with this URL
    const qrCodeDataURL = await QRCode.toDataURL(qrURL);

    // Return QR code as PNG image
    const img = Buffer.from(qrCodeDataURL.split(",")[1], 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// Controller to serve latest vCard dynamically (for permanent QR code)
export const downloadBusinessCardVCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows]: any = await db.query('SELECT * FROM business_card WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Business Card not found' });
    }

    const businessCard = rows[0];

    const vCardData = `
BEGIN:VCARD
VERSION:3.0
N:${businessCard.last_name};${businessCard.first_name};;;
FN:${businessCard.first_name} ${businessCard.last_name}
EMAIL:${businessCard.email}
TEL;TYPE=CELL:${businessCard.mobile.toString()}
ORG:${businessCard.company_name}
TITLE:${businessCard.job_title}
ADR;TYPE=WORK:;;${businessCard.address};${businessCard.city};;${businessCard.postal_code};Tunisia
END:VCARD
`.trim();

    // These headers are KEY to make phones show "Import Contact"
    res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="business-card.vcf"');
    res.send(vCardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const getBusinessCardQRCodeVCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows]: any = await db.query('SELECT * FROM business_card WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Business Card not found' });
    }

    const businessCard = rows[0];

    const vCardData = `
BEGIN:VCARD
VERSION:3.0
N:${businessCard.last_name};${businessCard.first_name};;;
FN:${businessCard.first_name} ${businessCard.last_name}
EMAIL:${businessCard.email}
TEL;TYPE=CELL:${businessCard.mobile.toString()}
ORG:${businessCard.company_name}
TITLE:${businessCard.job_title}
ADR;TYPE=WORK:;;${businessCard.address};${businessCard.city};;${businessCard.postal_code};Tunisia
END:VCARD
`.trim();

    const qrCodeDataURL = await QRCode.toDataURL(vCardData);

    const img = Buffer.from(qrCodeDataURL.split(",")[1], 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
