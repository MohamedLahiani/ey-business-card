import { Request, Response } from 'express';
import { getBusinessCardById } from '../models/businessCardModel';  // Import the model

// Fetch business card by user ID
export const getUserBusinessCard = async (req: Request, res: Response) => {
  const userId = 1;  // For now, using static user ID (you can replace this with dynamic later)

  try {
    const user = await getBusinessCardById(userId);

    if (user) {
      res.json(user);  // Send the user data as a response
    } else {
      res.status(404).json({ message: 'Business Card not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
