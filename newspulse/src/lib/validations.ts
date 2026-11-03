import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.");

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Password is required."),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name must be 60 characters or fewer."),
  email,
  // bcrypt only uses the first 72 bytes, so cap the length
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or fewer."),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

export const commentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(2, "Write at least 2 characters.")
    .max(1000, "Keep comments under 1,000 characters."),
});