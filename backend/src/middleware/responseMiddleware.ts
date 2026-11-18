import type { NextFunction, Request, Response } from "express";

export const responseMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  res.success = ({ status, data }) => res.status(status).json({ ok: true, code: null, data });
  res.fail = ({ status, code }) => res.status(status).json({ ok: false, code, data: null });
  next();
};
