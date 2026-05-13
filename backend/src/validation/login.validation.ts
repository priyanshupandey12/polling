import zod from "zod";

export const loginSchema = zod.object({
    email: zod.email("Invalid email address"),
    password: zod
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be at most 100 characters"),
});