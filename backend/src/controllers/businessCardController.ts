import { Request, Response } from 'express';
import { db } from '../config/db';  // Import DB connection

// Existing GET controller
export const getBusinessCard = async (req: Request, res: Response) => {
  try {
    const data = await db.query('SELECT * FROM business_card WHERE id = 1');
    if (Array.isArray(data[0]) && data[0].length > 0) {
      res.json(data[0][0]);
    } else {
      res.status(404).json({ message: 'Business Card not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// New POST controller to create business card
export const createBusinessCard = async (req: Request, res: Response) => {
  const { first_name, last_name, email, mobile, company_name, job_title, department, address, city, postal_code } = req.body;

  // Simple validation
  if (!first_name || !last_name || !email || !mobile || !company_name || !job_title) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // SQL to insert a new business card
    const [result]: any = await db.query(
      'INSERT INTO business_card (first_name, last_name, email, mobile, company_name, job_title, department, address, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, mobile, company_name, job_title, department, address, city, postal_code]
    );

    // Sending back the inserted row
    res.status(201).json({ id: result.insertId, first_name, last_name, email, mobile, company_name, job_title, department, address, city, postal_code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// New PUT controller to update business card by ID
export const updateBusinessCard = async (req: Request, res: Response) => {
  const { id } = req.params;  // Get the ID from URL
  const { first_name, last_name, email, mobile, company_name, job_title, department, address, city, postal_code } = req.body;

  // Simple validation
  if (!first_name || !last_name || !email || !mobile || !company_name || !job_title) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // SQL to update the business card with the given ID
    const [result]: any = await db.query(
      'UPDATE business_card SET first_name = ?, last_name = ?, email = ?, mobile = ?, company_name = ?, job_title = ?, department = ?, address = ?, city = ?, postal_code = ? WHERE id = ?',
      [first_name, last_name, email, mobile, company_name, job_title, department, address, city, postal_code, id]
    );

    // Check if any row was updated
    if (result.affectedRows > 0) {
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


// Static user data (mock login)
const staticUser = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@ey.com',
  mobile: '+1234567890',
  company_name: 'EY',
  job_title: 'Developer',
  department: 'IT',
  address: '123 Main Street',
  city: 'New York',
  postal_code: '10001'
};

export const loginUser = (req: Request, res: Response) => {
  // For now, we just return the static user profile
  res.json({
    message: 'Login successful',
    user: staticUser
  });
};









