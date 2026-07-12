import { Router, Request, Response } from 'express';

const router = Router();

// GET /lotteries
router.get('/lotteries', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// GET /rounds
router.get('/rounds', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// GET /rounds/:id
router.get('/rounds/:id', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// POST /rounds
router.post('/rounds', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

export default router;
