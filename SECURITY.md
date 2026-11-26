# Security Policy

## Scope

**Will You Say Yes?** is a **static, client-side web app**. It has:

- no backend or server
- no database or ORM
- no authentication or user accounts
- no API keys, tokens or third-party SDKs
- no analytics, cookies, localStorage or sessionStorage
- no write endpoints

The production build is plain HTML, CSS, JavaScript and one audio file served from a static host.
Because of that architecture, the usual server-side checklist (database keys, RLS, server auth,
record-level access, field tampering) **does not apply to this repository**.

## What is public by design

Anything shipped to the browser is public. That includes every line of source, the built bundle,
and the WhatsApp number in `src/components/Celebration.tsx`:

```ts
const WHATSAPP_RECIPIENT = '639928636148'
```

This is intentional. A phone number used in a `https://wa.me/...` deep link cannot be hidden in a
front-end app — it must be present in the page for the link to work. If you fork this project,
change that constant to your own number. If you need the recipient to be genuinely secret, the
message must be sent by a server (see *If you add a backend* below).

> **Note:** the number is also present in older git history, including the `dist/` bundle that was
> committed in the first commit. See *Purging history*.

## Supported versions

Only the latest commit on `main` is supported.

## Reporting a vulnerability

Please **do not open a public issue** for a security problem.

Use GitHub's private reporting flow:
**Security → Advisories → Report a vulnerability** on
<https://github.com/4r6ie/sweet-date-invitation/security/advisories/new>

Include the affected file or URL, reproduction steps, and impact. You can expect an initial response
within a few days.

## Secrets policy

- Never commit `.env`, `.env.local` or any file containing a credential.
- `.gitignore` already excludes `.env`, `.env.local`, `.env.*.local`, `node_modules/` and `dist/`.
- Any variable prefixed with `VITE_` is **inlined into the client bundle** by Vite. It is public.
  Never put a secret, private key, service-role key or database password behind a `VITE_` prefix.
- Real secrets belong in a server environment (serverless function, API route or backend service).

### Automated scanning

Every push and pull request runs [gitleaks](https://github.com/gitleaks/gitleaks) via
`.github/workflows/secret-scan.yml`, which scans the full git history. The job fails if a credential
is detected.

Run the same scan locally:

```bash
# Install gitleaks first: https://github.com/gitleaks/gitleaks#installing
gitleaks detect --source . --config .gitleaks.toml --redact --verbose
```

### If a secret is ever committed

1. **Rotate/revoke the credential immediately** — assume it is compromised the moment it is pushed.
2. Remove it from the working tree and commit the fix.
3. Purge it from history (see below) and force-push.
4. Delete and recreate the repository, or contact GitHub Support, to clear cached unreachable objects.

## Purging history

The only personal datum in this repository's history is the WhatsApp number. To remove it:

```bash
# Requires git-filter-repo: https://github.com/newren/git-filter-repo
git filter-repo --replace-text <(echo '639928636148==>000000000000')

git remote add origin https://github.com/4r6ie/sweet-date-invitation.git
git push --force --all
```

Force-pushing rewrites every commit hash. GitHub may still serve old objects by SHA for a period, so
a complete purge requires deleting and recreating the repository.

## Static-site checklist

| Control | Status | Notes |
|---|---|---|
| Secure session cookies | **N/A** | The app sets no cookies and has no session. |
| Hash passwords | **N/A** | No passwords, accounts or login exist. |
| Bot protection | **N/A** | No forms, login or API to abuse. If a form is added later, put rate limiting at the host/CDN. |
| Parameterize queries | **N/A** | No database, ORM or queries. |
| Validate all inputs | **Done** | The only free-text input (custom time) is trimmed, capped at 60 characters, stripped of control characters, and required before continuing. |
| Trim API responses | **N/A** | No API. The WhatsApp message is built from trimmed values. |
| Escape user content | **Done** | React escapes every rendered value; the WhatsApp URL is built with `encodeURIComponent`. |
| Security headers | **Done** | CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and COOP are set in `netlify.toml` and `vercel.json`. |
| Force HTTPS | **Done** | HSTS is sent by both configs; Netlify and Vercel serve HTTPS by default; GitHub Pages offers an "Enforce HTTPS" toggle. |
| Scan dependencies | **Done** | `npm audit --omit=dev --audit-level=high` runs in CI, and Dependabot opens weekly PRs for npm packages and GitHub Actions. |

The CSP keeps scripts strict (`script-src 'self'`) and allows `'unsafe-inline'` only for styles, which
the UI needs because components use React inline styles.

**GitHub Pages limitation:** GitHub Pages cannot send custom response headers, so the full header set
applies only to the Netlify and Vercel configurations (or a proxy/CDN such as Cloudflare in front of
Pages). GitHub still enforces HTTPS for Pages when "Enforce HTTPS" is enabled.

## If you add a backend

The eight-point hardening checklist becomes relevant only when this project gains a server or
database. At that point:

| Control | What to do |
|---|---|
| API keys | Keep service-role/secret keys in server env vars only; expose at most a public anon key. |
| Public DB key | Use the provider's **anon/public** key in the client, never the service-role key. |
| Row Level Security | Enable RLS on every table and deny by default (`create policy ... using (false)` as a baseline). |
| Server-side auth | Verify the session/JWT on the server for every protected request; never trust the client. |
| Record access | Scope policies to the authenticated user (`auth.uid() = user_id`) and test with two accounts. |
| Field tampering | Validate and whitelist fields server-side; never mass-assign request bodies; enforce column-level constraints. |
| Encryption | Use TLS in transit and provider-managed encryption at rest; encrypt especially sensitive fields at the application layer. |
| Secret handling | Rotate keys, scope tokens narrowly, and add the provider's keys to `.gitignore` before the first commit. |

Do not implement these as client-side checks — a client-side "admin" flag or hidden field is not a
security control.

## Data handling summary

| Data | Stored? | Where |
|---|---|---|
| Selected time and food | No | React state in memory only; lost on refresh |
| WhatsApp message | No | Built in the browser and passed to WhatsApp via a deep link |
| Cookies / analytics / tracking | No | None |
| Server logs | No | The app has no server |
