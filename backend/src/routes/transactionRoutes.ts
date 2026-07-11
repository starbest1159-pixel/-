import { Router, Request, Response } from 'express';

const router = Router();

// GET /users/:userId/transactions
router.get('/users/:userId/transactions', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// GET /users/:userId/balance
router.get('/users/:userId/balance', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

export default router;
