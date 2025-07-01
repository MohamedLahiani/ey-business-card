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

export const getUserBusinessCard = async (req: Request, res: Response) => {
  const rawParam = req.params.email;
  const email = decodeURIComponent(req.query.email as string);

  console.log('🔍 Raw param:', rawParam);
  console.log('✅ Decoded email:', email);

  try {
    const [rows] = await db.query('SELECT * FROM business_card WHERE email = ?', [email]);

    console.log('🧾 Query result:', rows);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('❌ DB ERROR:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
