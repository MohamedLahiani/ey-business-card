// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './../config/db';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM business_card WHERE email = ?', [email]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user: any = rows[0];

    if (user.mobile !== password) {
      return res.status(401).json({ message: 'Invalid password (mobile mismatch)' });
    }

    const token = jwt.sign({ email: user.email }, 'secret_key', { expiresIn: '1h' });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        company: user.company_name // optional: include more fields
      }
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error); // Log to terminal
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const getUserBusinessCard = async (req: Request, res: Response) => {
  const email = req.query.email as string;

  if (!email) return res.status(400).json({ message: 'Missing email' });

  try {
    const [rows] = await db.query('SELECT * FROM business_card WHERE email = ?', [email]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: 'Business Card not found' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('FETCH ERROR:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
