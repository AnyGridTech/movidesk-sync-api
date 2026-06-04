import type { NextFunction, Request, Response } from "express";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-api-key"];
  if (!token || token !== process.env.API_GROWATT_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

export { authMiddleware };
