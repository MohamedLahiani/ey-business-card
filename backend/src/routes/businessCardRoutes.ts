// backend/src/routes/businessCardRoutes.ts

import { Router } from 'express';
import { getBusinessCard, createBusinessCard, updateBusinessCard , getBusinessCardQRCodeURL, downloadBusinessCardVCard, getBusinessCardQRCodeVCard} from '../controllers/businessCardController';
import { getUserBusinessCard } from '../controllers/userController';


const router = Router();

// GET /api/business-card/:id - Fetch a business card by ID
router.get('/:id', (req, res, next) => {
  getBusinessCard(req, res).catch(next);
});

// POST /api/business-card
router.post('/', (req, res) => {
  createBusinessCard(req, res);
});

// PUT /api/business-card/:id (update business card by id)
router.put('/:id', (req, res) => {
  updateBusinessCard(req, res);
});



// GET /api/user/business-card
router.get('/user/business-card', getUserBusinessCard);

router.get('/:id/qrcode', (req, res, next) => {
  getBusinessCardQRCodeURL(req, res).catch(next);
}); // this is the line we need for QR code


router.get('/:id/download-vcard', (req, res, next) => {
  downloadBusinessCardVCard(req, res).catch(next);
}); // returns latest vCard

router.get('/:id/qrcode-vcard', (req, res, next) => {
  getBusinessCardQRCodeVCard(req, res).catch(next);
}); // direct vCard QR → for screen sharing


export default router;
