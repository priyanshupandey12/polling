import type { Request, Response, NextFunction } from 'express'
import ApiError from "../utils/error.js";
import { env } from "../config/env.js";
import { verifyToken } from "../utils/jwt.js";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
 const authHeader = req.headers.authorization;
  

  const cookieToken = req.cookies.accessToken;

  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {

    token = authHeader.split(" ")[1];
  } else if (cookieToken) {
    token = cookieToken;
  }


  if (!token) {
    throw ApiError.unauthorized("No token provided");
  }

  const decoded = verifyToken(token, env.ACCESS_TOKEN_SECRET) as { userId: string } | null;

  if (!decoded) {
    throw ApiError.unauthorized("Invalid or expired token");
  }

  req.user = decoded;

  next();
};

export default authMiddleware;