-- Migration: seed_display_name
-- Updates the handle_new_user trigger so the public.users row gets a sensible
-- display_name and avatar_url on signup:
--   * Email signups pass `display_name` via auth.signUp options.data.
--   * Google OAuth puts `name` and `picture` (or `avatar_url`) in raw_user_meta_data.
--   * Fallback to the email's local part so display_name is never null.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data ->> 'display_name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data ->> 'name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data ->> 'full_name'), ''),
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data ->> 'avatar_url',
      NEW.raw_user_meta_data ->> 'picture'
    )
  );
  RETURN NEW;
END;
$$;

-- Backfill existing rows where display_name is null. (Idempotent: only touches
-- rows that need it.)
UPDATE public.users u
SET display_name = split_part(au.email, '@', 1)
FROM auth.users au
WHERE u.id = au.id
  AND (u.display_name IS NULL OR TRIM(u.display_name) = '');
