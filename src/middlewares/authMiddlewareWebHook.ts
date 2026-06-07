import type { NextFunction, Request, Response } from "express";

function authMiddlewareWebHook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.query.token;

  if (!token || token !== process.env.API_GROWATT_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

export { authMiddlewareWebHook };
