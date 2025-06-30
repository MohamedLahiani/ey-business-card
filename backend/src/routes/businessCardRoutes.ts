
import { Router } from 'express';
import { getBusinessCard, createBusinessCard, updateBusinessCard } from '../controllers/businessCardController';
import {getBusinessCardQRCodeURL, downloadBusinessCardVCard, getBusinessCardQRCodeVCard} from '../controllers/qrController';
import { getUserBusinessCard } from '../controllers/userController';
const { getBusinessCardQRCode } = require('../controllers/newQrController'); // Import the new QR code controller


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


// Generate QR code for a business card by ID
router.get('/:id/qrcode', getBusinessCardQRCode);


export default router;