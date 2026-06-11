// contact.ts — server fns for the public contact form and its admin review tab.
//
// Public write: submitContactRequestFn (validated, honeypot-gated)
// Admin reads/mutations: getContactRequestsFn, setContactRequestStatusFn,
//                        deleteContactRequestFn
//
// All access goes through the service-role client: contact_requests has RLS
// enabled with no policies, so anon/authenticated cannot touch it directly.

import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { getServiceClient } from '@everyone-web/libs/supabase-server';
import { requireAdmin } from '@everyone-web/server/auth';
import { contactSchema } from '@everyone-web/lib/validators/contact';
import type { ContactRequestInsert, ContactRequestRow } from '@everyone-web/types/supabase';

/**
 * Stores a contact-form submission.
 *
 * Anti-spam: the form includes a hidden "website" honeypot field. If a bot
 * fills it, we return success without persisting anything, so the bot gets
 * no signal that it was detected.
 */
export const submitContactRequestFn = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) {
      return { ok: true as const };
    }

    const svc = getServiceClient();

    const payload: ContactRequestInsert = {
      name: data.name.trim(),
      email: data.email.trim(),
      company: data.company?.trim() || null,
      project_type: data.projectType,
      message: data.message.trim(),
    };

    const { error } = await svc.from('contact_requests').insert(payload);
    if (error) throw error;

    return { ok: true as const };
  });

/**
 * Returns ALL contact requests, newest first. Admin-gated.
 */
export const getContactRequestsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest();
  await requireAdmin(request);
  const svc = getServiceClient();

  const { data, error } = await svc
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ContactRequestRow[];
});

const setStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['new', 'replied', 'archived']),
});

/**
 * Updates a contact request's status (new / replied / archived). Admin-gated.
 */
export const setContactRequestStatusFn = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => setStatusSchema.parse(input))
  .handler(async ({ data: { id, status } }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    const { data, error } = await svc
      .from('contact_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ContactRequestRow;
  });

/**
 * Deletes a contact request permanently. Admin-gated.
 */
export const deleteContactRequestFn = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data: { id } }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    const { error } = await svc.from('contact_requests').delete().eq('id', id);
    if (error) throw error;
  });
