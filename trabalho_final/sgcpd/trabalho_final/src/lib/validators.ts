import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
}).refine(d => d.password === d.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"]
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const ForgotSchema = z.object({
  email: z.string().email()
});

export const ResetSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
}).refine(d => d.password === d.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"]
});

export const UserUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["user","admin"]).optional()
});
