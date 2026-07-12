import { Router, Request, Response } from 'express';

const router = Router();

// GET /agent
router.get('/agent', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

// GET /admin
router.get('/admin', (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
});

export default router;
