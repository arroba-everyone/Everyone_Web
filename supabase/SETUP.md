# Supabase setup — auth-roles-and-admin-pages

This document covers everything you need to do manually in the Supabase project before deploying.

---

## 1. Apply migrations

You have two options:

### Option A — Supabase CLI (recommended)

```bash
# From the repo root
supabase db push
```

Or, if you prefer explicit migration commands:

```bash
supabase migration up
```

The CLI reads files from `supabase/migrations/` in timestamp order.

### Option B — Paste in SQL Editor

1. Open the Supabase Dashboard → **SQL Editor**.
2. Paste and run each migration file in order:
   - `20260502000001_create_deals_table.sql`
   - `20260502000002_create_users_table.sql`
   - `20260502000003_posts_rls.sql`

> **Important**: run them in numerical order. The `users` migration depends on `auth.users` existing (which it always does), and `posts_rls` depends on `posts` already existing in your project.
>
> **Naming note**: `public.users` is the application-level user record (links 1:1 with `auth.users` via FK on `id`). They are different tables in different schemas — never use one where the other is meant.

---

## 2. Configure Google OAuth

1. Go to **Supabase Dashboard → Authentication → Providers → Google**.
2. Enable Google OAuth.
3. Fill in:
   - **OAuth Client ID** — from [Google Cloud Console](https://console.cloud.google.com/).
   - **OAuth Client Secret** — from Google Cloud Console.
4. Add the following **Authorized redirect URI** in your Supabase project:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
5. In **Google Cloud Console → OAuth 2.0 Credentials**, add the following to **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://<your-netlify-subdomain>.netlify.app
   https://<your-production-domain>
   ```
   And to **Authorized redirect URIs**:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

> **Netlify deploy previews** use URLs like `https://deploy-preview-123--<your-site>.netlify.app`.
> You may add `https://*.netlify.app` as an authorized JavaScript origin in Google Console if you want all preview URLs to work, but be aware this is broad.

---

## 3. Grant admin role to a user

The role lives in `public.users.role` (not in `auth.users.app_metadata`).

Run this SQL in the **SQL Editor** (or via the CLI), replacing the email:

```sql
UPDATE public.users
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

To verify:

```sql
SELECT u.id, au.email, u.role
FROM public.users u
JOIN auth.users au ON au.id = u.id
WHERE au.email = 'admin@example.com';
```

> **Note**: role changes are effective on the **next request**. There is no JWT refresh required, because `getSession()` reads the role from `public.users` on every request.

To **revoke** admin:

```sql
UPDATE public.users
SET role = 'user'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

> **Security**: a `BEFORE UPDATE` trigger on `public.users` (`users_prevent_role_self_change`) blocks non-admins from changing their own `role`. The SQL above runs as `service_role` from the dashboard, which bypasses the trigger. From the app, only admins can change another user's role.

---

## 4. Regenerate TypeScript types (Batch B and beyond)

After applying migrations, regenerate `src/types/supabase.ts`:

```bash
supabase gen types typescript --project-id <your-project-ref> --schema public > src/types/supabase.ts
```

Find your project ref in **Supabase Dashboard → Settings → General → Reference ID**.

Commit the generated file — it serves as the TS source of truth for all DB interactions.

---

## 5. Environment variables

Ensure the following are set before running the app or deploying:

| Variable | Where | Description |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `.env` + Netlify | Public Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `.env` + Netlify | Public anon key |
| `VITE_TELEGRAM_CHANNEL_URL` | `.env` + Netlify | Telegram channel URL for the locked deal CTA |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env` + Netlify (server-only) | **Never expose to the browser.** No `VITE_` prefix. |

See `.env.example` for the exact variable names.
