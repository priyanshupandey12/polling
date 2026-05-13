import zod from "zod";

export const registerSchema = zod.object({
  fullName: zod
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be at most 50 characters"),
  email: zod.email("Invalid email address"),
  password: zod
    .string()
    .min(8, "Password must be at least 8 characters"),
});