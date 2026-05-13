
import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;


  if (!token) {
    return next();
  }



  const decoded = verifyToken(token, env.ACCESS_TOKEN_SECRET) as { userId: string } | null;

  if (decoded) {
    req.user = decoded;
  }

  next();
};

export default optionalAuthMiddleware;