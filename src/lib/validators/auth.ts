import { z } from 'zod';

// ---------------------------------------------------------------------------
// Reusable field schemas
// ---------------------------------------------------------------------------

const emailField = z.string().email('Introduce un email válido');
const passwordField = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres');

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const signupSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .max(60, 'El nombre no puede pasar de 60 caracteres')
      .optional()
      .or(z.literal('')),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(60, 'El nombre no puede pasar de 60 caracteres'),
  avatarUrl: z
    .string()
    .trim()
    .url('Introduce una URL válida')
    .max(500)
    .or(z.literal(''))
    .optional(),
});

export const passwordResetRequestSchema = z.object({
  email: emailField,
});

export const passwordResetCompleteSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetCompleteInput = z.infer<typeof passwordResetCompleteSchema>;
