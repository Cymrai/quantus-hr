import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function adminOnlyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admin role required' });
  }
  next();
}
