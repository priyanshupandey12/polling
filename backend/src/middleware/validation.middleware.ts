import zod from "zod";
import type { Request, Response, NextFunction } from "express";

const validationMiddleware = (schema: zod.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");

      return res.status(400).json({
        success: false,
        error: errors,
      });
    }

    req.body = result.data;
    next();
  };

export default validationMiddleware;