import { Router, Request, Response } from 'express';

const router = Router();

// POST /login
router.post('/login', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// POST /refresh
router.post('/refresh', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// POST /logout
router.post('/logout', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

export default router;
