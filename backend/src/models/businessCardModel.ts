import { db } from '../config/db';

export const getBusinessCardById = async (id: number) => {
  const result = await db.query('SELECT * FROM business_card WHERE id = ?', [id]);
  const rows = (result as any)[0] as any[];
  return rows[0];  // Return the first (and only) row
};
