// users.ts — server fns for the public.users profile.
// Each authenticated user can read/update their own row (RLS users_self_*).
// Admin promotion is intentionally NOT exposed via the app — manual SQL only.

import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { getServerClient } from '@everyone-web/libs/supabase.server';
import type { UserRecord } from '@everyone-web/types/supabase';

export interface UpdateProfileInput {
  displayName: string;
  avatarUrl: string;
}

/**
 * Update the authenticated user's display_name and avatar_url. The trigger
 * `users_prevent_role_self_change` blocks accidental role escalation.
 */
export const updateMyProfileFn = createServerFn({ method: 'POST' })
  .inputValidator((input: UpdateProfileInput) => input)
  .handler(async ({ data }) => {
    const request = getRequest();
    const supabase = getServerClient(request);

    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr || !auth.user) {
      throw new Error('No autenticado');
    }

    const trimmedName = data.displayName.trim();
    if (trimmedName.length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    const trimmedAvatar = data.avatarUrl.trim();

    const { data: row, error } = await supabase
      .from('users')
      .update({
        display_name: trimmedName,
        avatar_url: trimmedAvatar.length > 0 ? trimmedAvatar : null,
      })
      .eq('id', auth.user.id)
      .select('display_name, avatar_url, role, email, id, created_at')
      .single();

    if (error) throw error;
    return row as UserRecord;
  });
