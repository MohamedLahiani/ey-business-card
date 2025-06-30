import { Router, Request, Response, NextFunction } from 'express';
import {
  getBusinessCard,
  createBusinessCard,
  updateBusinessCard,
} from '../controllers/businessCardController';
import {
  getBusinessCardQRCodeURL,
  downloadBusinessCardVCard,
  getBusinessCardQRCodeVCard,
} from '../controllers/qrController';
import { getUserBusinessCard } from '../controllers/userController';
import { emailBusinessCard } from '../controllers/mailerController';

const router = Router();

// GET business card by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getBusinessCard(req, res);
  } catch (error) {
    next(error);
  }
});

// POST create business card
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createBusinessCard(req, res);
  } catch (error) {
    next(error);
  }
});

// PUT update business card
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateBusinessCard(req, res);
  } catch (error) {
    next(error);
  }
});

// GET user-specific business card
router.get('/user/business-card', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getUserBusinessCard(req, res);
  } catch (error) {
    next(error);
  }
});

// GET QR Code URL
router.get('/:id/qrcode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getBusinessCardQRCodeURL(req, res);
  } catch (error) {
    next(error);
  }
});

// GET downloadable vCard
router.get('/:id/download-vcard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await downloadBusinessCardVCard(req, res);
  } catch (error) {
    next(error);
  }
});

// GET QR Code with embedded vCard (for scanning)
router.get('/:id/qrcode-vcard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getBusinessCardQRCodeVCard(req, res);
  } catch (error) {
    next(error);
  }
});

// POST send email with vCard + QR
router.post('/:id/email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await emailBusinessCard(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
