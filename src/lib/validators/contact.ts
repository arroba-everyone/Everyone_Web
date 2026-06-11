import { z } from 'zod';

/**
 * Project types selectable in the public contact form.
 * Mirrors the CHECK constraint on contact_requests.project_type.
 */
export const PROJECT_TYPES = [
  { value: 'web', label: 'Una web' },
  { value: 'ecommerce', label: 'Una tienda online' },
  { value: 'app', label: 'Una app móvil' },
  { value: 'arvr', label: 'Realidad aumentada / virtual' },
  { value: 'sistema', label: 'Un sistema a medida' },
  { value: 'otro', label: 'Otra cosa' },
] as const;

const projectTypeEnum = z.enum(['web', 'ecommerce', 'app', 'arvr', 'sistema', 'otro']);

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Cuéntanos al menos tu nombre')
    .max(100, 'El nombre es demasiado largo'),
  email: z.string().email('Introduce un email válido'),
  company: z.string().max(100, 'El nombre de empresa es demasiado largo').optional(),
  projectType: projectTypeEnum,
  message: z
    .string()
    .min(10, 'Cuéntanos un poco más (mínimo 10 caracteres)')
    .max(2000, 'El mensaje es demasiado largo (máximo 2000 caracteres)'),
  // Honeypot field: invisible to humans, bots tend to fill it.
  // Validated server-side; a non-empty value drops the request silently.
  website: z.string().max(0).optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;
