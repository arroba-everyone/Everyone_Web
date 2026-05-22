import { z } from 'zod';

// Slug regex: lowercase alphanumeric with internal hyphens.
// Valid: "my-post-123", "about-us", "post1"
// Invalid: "Invalid-Slug", "has spaces", "-leading-hyphen", "trailing-"
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export const postCreateSchema = z.object({
  title: z.string().min(1, 'El título no puede estar vacío'),
  slug: z
    .string()
    .min(1, 'El slug no puede estar vacío')
    .regex(slugRegex, 'El slug solo puede contener letras minúsculas, números y guiones'),
  author: z.string().min(1, 'El autor no puede estar vacío'),
  thumbnail_url: z.string().url('La URL de la miniatura no es válida'),
  markdown: z.string().min(1, 'El contenido no puede estar vacío'),
});

export const postUpdateSchema = postCreateSchema.partial().extend({
  id: z.string().uuid(),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type PostCreateInput = z.infer<typeof postCreateSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
