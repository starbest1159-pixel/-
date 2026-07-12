import { Router, Request, Response } from 'express';

const router = Router();

// GET /profile
router.get('/profile', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// GET /:id
router.get('/:id', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// GET / (list)
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// POST /
router.post('/', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// PUT /:id/credit
router.put('/:id/credit', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// PUT /:id/discount
router.put('/:id/discount', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

export default router;
