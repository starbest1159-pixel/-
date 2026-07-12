import { Router, Request, Response } from 'express';

const router = Router();

// POST /links
router.post('/links', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// GET /users/:userId/links
router.get('/users/:userId/links', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// POST /links/:token/bets
router.post('/links/:token/bets', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

export default router;
