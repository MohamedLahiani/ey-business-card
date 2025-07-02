import { Router, Request, Response, NextFunction } from 'express';
import { login } from '../controllers/authController';
import { getUserBusinessCard } from '../controllers/businessCardController';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error);
  }
});


router.get('/', async (req: Request, res: Response) => {
  await getUserBusinessCard(req, res);
});


export default router;


