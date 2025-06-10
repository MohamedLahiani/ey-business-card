// backend/src/routes/businessCardRoutes.ts

import { Router } from 'express';
import { getBusinessCard, createBusinessCard , updateBusinessCard, loginUser} from '../controllers/businessCardController';
import { getUserBusinessCard } from '../controllers/userController';


const router = Router();

// Route: GET /api/business-card
router.get('/', getBusinessCard);

// POST /api/business-card
router.post('/', (req, res) => {
  createBusinessCard(req, res);
});

// PUT /api/business-card/:id (update business card by id)
router.put('/:id', (req, res) => {
  updateBusinessCard(req, res);
});

// Static login route
router.post('/login', loginUser);

// GET /api/user/business-card
router.get('/user/business-card', getUserBusinessCard);

export default router;
