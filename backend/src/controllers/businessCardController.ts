import { Request, Response } from 'express';
import { db } from '../config/db';  // Import DB connection
import { createBusinessCardSchema, updateBusinessCardSchema } from '../validation/businessCardValidation'; // Import Joi schemas
import QRCode from 'qrcode';  // Import QR Code library





// Controller to fetch business card data
export const getBusinessCard = async (req: Request, res: Response) => {
  const { id } = req.params;  // Get the ID from URL

  try {
    // Fetch the business card data from the database by ID
    const [rows]: any = await db.query('SELECT * FROM business_card WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Business Card not found' });
    }

    const businessCard = rows[0]; // Assuming only one result is returned
    res.json(businessCard);  // Return business card data from the database
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// Controller to create a new business card
export const createBusinessCard = async (req: Request, res: Response) => {
  // Validate request body using Joi schema
  const { error } = createBusinessCardSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { first_name, last_name, email, mobile, job_title, department } = req.body;

  // Inchangeable fields (company_name, address, city, postal_code)
  const company_name = 'AMC ERNST & YOUNG';  // Fixed
  const address = 'Avenue Fadhel Ben Achour'; // Fixed
  const city = 'Tunis';                     // Fixed
  const postal_code = '1003';               // Fixed

  try {
    const [result]: any = await db.query(
      'INSERT INTO business_card (first_name, last_name, email, mobile, job_title, department, company_name, address, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, mobile, job_title, department, company_name, address, city, postal_code]
    );

    res.status(201).json({
      id: result.insertId,
      first_name,
      last_name,
      email,
      mobile,
      job_title,
      department,
      company_name,
      address,
      city,
      postal_code
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};







// Controller to update a business card
export const updateBusinessCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate request body using Joi schema
  const { error } = updateBusinessCardSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { mobile, job_title, department } = req.body;

  try {
    const [rows]: any = await db.query('SELECT * FROM business_card WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Business Card not found' });
    }

    const { first_name, last_name, email, company_name, address, city, postal_code } = rows[0];

    const [updateResult]: any = await db.query(
      'UPDATE business_card SET mobile = ?, job_title = ?, department = ? WHERE id = ?',
      [mobile, job_title, department, id]
    );

    if (updateResult && updateResult.affectedRows > 0) {
      res.json({
        id,
        first_name,
        last_name,
        email,
        mobile,
        company_name,
        job_title,
        department,
        address,
        city,
        postal_code
      });
    } else {
      res.status(404).json({ message: 'Business Card not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


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
