# Production auth checklist (AgriCycle / Better Auth)

If login/register works locally but fails on Vercel (or any host), fix these first.

## 1. Environment variables on the host

Set **all** of these in Vercel → Project → Settings → Environment Variables (Production + Preview):

| Variable | Example | Notes |
|----------|---------|--------|
| `DATABASE_URL` | `postgresql://…neon.tech/…?sslmode=require` | Same Neon DB you migrated |
| `BETTER_AUTH_SECRET` | random ≥32 chars | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `https://your-app.vercel.app` | **Must be HTTPS production URL, not localhost** |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Same as above; rebuild after changing |

Optional:

- `BETTER_AUTH_TRUSTED_ORIGINS=https://www.yourdomain.com,https://yourdomain.com`
- `BETTER_AUTH_COOKIE_DOMAIN=.yourdomain.com` (only if using apex + www)

## 2. Database tables

Run against the **production** `DATABASE_URL`:

```bash
npm run db:push
```

If tables are missing, sign-up returns 500.

## 3. Redeploy

After changing env vars (especially `NEXT_PUBLIC_*`), trigger a **new deploy** so the client bundle rebuilds.

## 4. Diagnose

Open:

```
https://YOUR_DOMAIN/api/health
```

You want:

- `database.ok: true`
- `auth.secretLengthOk: true`
- `auth.baseURL` = your HTTPS domain (not localhost)

## 5. Common errors

| Symptom | Cause | Fix |
|---------|--------|-----|
| "Failed to fetch" / network error | Client calling localhost | Clear bad `NEXT_PUBLIC_APP_URL`; redeploy |
| Origin / CSRF / forbidden | `trustedOrigins` mismatch | Set `BETTER_AUTH_URL` to exact site origin |
| 500 on sign-up | DB / missing tables | `npm run db:push` with prod URL |
| Login succeeds but not logged in | Cookie Secure/domain | Ensure HTTPS + `useSecureCookies` (enabled in prod code) |
| Works on preview, not custom domain | Origin not trusted | Add domain to `BETTER_AUTH_TRUSTED_ORIGINS` |
