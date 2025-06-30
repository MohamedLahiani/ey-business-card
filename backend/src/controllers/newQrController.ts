const { db } = require('../config/db');  // MySQL connection pool
const QRCode = require('qrcode'); // For generating QR codes
import { Request, Response } from 'express';

// Business Card Interface
interface BusinessCard {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    mobile?: string;
    address: string;
    city: string;
    postal_code: string;
}

// Generate QR code from business card data
const getBusinessCardQRCode = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Get business card ID from URL

    try {
        // Fetch business card data from the database by ID
        const [rows]: [BusinessCard[], any] = await db.query('SELECT * FROM business_card WHERE id = ?', [id]);

        if (rows.length === 0) {
            res.status(404).json({ message: 'Business Card not found' });
            return;
        }

        const card: BusinessCard = rows[0];

        // Build the vCard data (or any string you want to encode in the QR code)
        const vCardData = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${card.first_name} ${card.last_name}\r\nEMAIL:${card.email}\r\nTEL;TYPE=CELL:${card.mobile || ''}\r\nADR;TYPE=WORK:;;${card.address};${card.city};;${card.postal_code};\r\nEND:VCARD\r\n`;

        // Determine the base URL dynamically based on the environment
        const isLocal = process.env.NODE_ENV === 'development';  // Check if we're in local development

        const baseURL = 'http://localhost:3000';
        // Create a URL to the business card (modify as needed based on routing setup)
        const qrData = `${baseURL}/business-card/${id}`;  // This URL will be embedded in the QR code

        // Generate QR code as Base64 image
        const qrCodeUrl: string = await QRCode.toDataURL(qrData); // QR code data encoded as Base64

        // Send the QR code as Base64 image in the response
        res.json({ qr_code: qrCodeUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
  getBusinessCardQRCode
};
