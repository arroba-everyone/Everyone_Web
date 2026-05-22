import { z } from 'zod';
import { isAmazonUrl } from '@everyone-web/lib/deals/amazon-url';

// ---------------------------------------------------------------------------
// Hashtag validation constants (exported — used by HashtagsInput and server fns)
// ---------------------------------------------------------------------------

/**
 * Valid hashtag: alphanumeric + underscore + Spanish accented chars, 1–30 chars.
 * No spaces, hyphens, or emojis. Telegram parses hashtags up to the first
 * non-alphanumeric separator, so we keep it safe.
 */
export const HASHTAG_REGEX = /^[A-Za-z0-9_áéíóúüñÁÉÍÓÚÜÑ]{1,30}$/;

/**
 * Maximum number of hashtags per deal. 15 is generous but prevents abuse.
 */
export const MAX_HASHTAGS = 15;

// ---------------------------------------------------------------------------
// Subschemas
// ---------------------------------------------------------------------------

const dealStatusEnum = z.enum(['pending', 'published', 'rejected']);

const positivePrice = z.number().positive('El precio debe ser mayor que 0');

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

/**
 * Schema for editing an existing deal. All fields that a deal already has
 * in the DB are required here (title, current_price, original_url, source).
 * Fields typically set by the bot (telegram_message_id, etc.) are optional.
 */
export const dealEditSchema = z.object({
  title: z.string().min(1, 'El título no puede estar vacío'),
  current_price: positivePrice,
  previous_price: z.number().positive().nullable().optional(),
  average_price: z.number().positive().nullable().optional(),
  discount_percent: z.number().min(0).max(100).nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  original_url: z
    .string()
    .url('La URL original no es válida')
    .refine(
      isAmazonUrl,
      'La URL original debe ser de Amazon (amazon.* o amzn.to / a.co / amzn.eu)'
    ),
  affiliate_url: z.string().url().nullable().optional(),
  source: z.string().min(1),
  status: dealStatusEnum.optional(),
  youtube_review_url: z.string().url().nullable().optional(),
  hashtags: z
    .array(
      z
        .string()
        .regex(HASHTAG_REGEX, 'Hashtag inválido: solo letras, números, _ y acentos (máx. 30 chars)')
    )
    .max(MAX_HASHTAGS, `Máximo ${MAX_HASHTAGS} hashtags`)
    .nullable()
    .optional(),
});

/**
 * Schema for creating a new deal (used when inserting manually).
 * `status` defaults to 'pending' in the DB, so it's optional here.
 */
export const dealCreateSchema = dealEditSchema;

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type DealEditInput = z.infer<typeof dealEditSchema>;
export type DealCreateInput = z.infer<typeof dealCreateSchema>;
export type DealStatusValue = z.infer<typeof dealStatusEnum>;
