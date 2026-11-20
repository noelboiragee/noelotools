# NoeloTools Admin Panel — setup

This is a separate admin application. It does not alter the public website until a publish action is explicitly configured and used.

## 1. Create/configure Supabase
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication, create your first user with email/password. Disable public sign-ups after creating the owner.
4. Copy that user's UUID and email from Authentication > Users, then run:
   ```sql
   insert into public.admin_users(user_id,email,role,active)
   values ('AUTH_USER_UUID','ADMIN_EMAIL','owner',true);
   ```
5. Copy the Project URL and publishable/anon key into `admin/config.js`. This file must contain only public client values.

## 2. Deploy the publishing function (when ready)
Deploy `supabase/functions/publish-to-github/index.ts` as `publish-to-github`.
Set Edge Function secrets:
- `GITHUB_TOKEN`: fine-grained token with Contents: Read and write on this repository only.
- `GITHUB_REPOSITORY`: `noelboiragee/noelotools`
- `GITHUB_BRANCH`: `main`
Never place this token in `admin/config.js`, HTML, JavaScript, or GitHub Pages.

## 3. Preview
The admin files are on the `admin-panel` branch under `/admin/`. GitHub Pages currently serves the configured publishing branch only; this branch is a staging build and is not live yet. Review and test before merging/deploying.

## Security notes
- No public signup screen is provided.
- Admin access is checked against `admin_users` and enforced by Row Level Security.
- The initial owner must be provisioned manually in SQL.
- Publishing is intentionally restricted to selected HTML/catalog paths and requires an authenticated admin.
- This is a first implementation scaffold; verify Supabase policies, function deployment and a non-production test publish before enabling live publishing.
