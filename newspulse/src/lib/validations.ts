import { z } from "zod";
import { imageHosts } from "@/config/site";

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

const coverImage = z
  .string()
  .trim()
  .max(500, "Cover image URL is too long.")
  .refine(
    (value) => {
      if (value === "") return true; // optional: an auto cover is generated
      try {
        const url = new URL(value);
        return url.protocol === "https:" && imageHosts.includes(url.hostname);
      } catch {
        return false;
      }
    },
    `Use an https image URL from: ${imageHosts.join(", ")}.`,
  );

export const articleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(120, "Title must be 120 characters or fewer."),
  excerpt: z
    .string()
    .trim()
    .min(20, "Summary must be at least 20 characters.")
    .max(280, "Summary must be 280 characters or fewer."),
  categoryId: z.string().min(1, "Choose a category."),
  coverImage,
  content: z
    .string()
    .trim()
    .min(50, "Write at least 50 characters of story content.")
    .max(50_000, "Story content is too long."),
  featured: z.boolean(),
});

export type ArticleInput = z.infer<typeof articleSchema>;
