# UI Coverage (Progress: 32/32)
Legend: [ ] not yet tested  -  [x] test written and passing  -  [~] intentionally skipped (reason)

## Public Pages (Root Layout)
- [x] Home page `/` - Secret form, security settings, create button, editor
- [x] Home page secret created state - SecretSettings with URL, QR, copy, burn
- [x] Terms page `/terms` - Static legal text content
- [x] Privacy page `/privacy` - Privacy policy content
- [x] Not Found page `/*` - 404 ghost icon, go home, create secret buttons

## Secret Pages
- [x] Secret page `/secret/:id` - Locked state with unlock button (key in URL)
- [x] Secret page - Password-protected state (requires password input)
- [x] Secret page - Revealed state (after unlocking)
- [x] Secret page - Manual key entry (no key in URL, not password protected)
- [x] Secret page - Delete modal (delete confirmation)
- [x] Secret Not Found page - Error boundary when secret doesn't exist/expired

## Auth Pages (No Layout)
- [x] Login page `/login` - Form with username/password, sign in button
- [x] Login page - Password visibility toggle
- [x] Login page - Navigate to register link
- [x] Login page - Failed login shows error
- [x] Register page `/register` - Form with username/email/password/confirm
- [x] Register page - Password strength indicator
- [x] Register page - Password match validation
- [x] Register page - Navigate to login link
- [x] Verify 2FA page `/verify-2fa` - Code entry form
- [x] Setup page `/setup` - Redirects away when app is already set up

## Request Secret Pages
- [x] Request Secret page `/request/:id` - Form to submit a secret (with valid token)
- [x] Request Secret page - Error state (invalid/expired link, 404, 410)

## Dashboard (Authenticated)
- [x] Dashboard redirect - Unauthenticated redirects to /login
- [x] Dashboard Secrets page `/dashboard` - Secret list
- [x] Dashboard Account page `/dashboard/account` - Account settings
- [x] Dashboard Analytics page `/dashboard/analytics` - Charts and stats
- [x] Dashboard Users page `/dashboard/users` - User management table
- [x] Dashboard Instance page `/dashboard/instance` - Instance settings
- [x] Dashboard Invites page `/dashboard/invites` - Invite code management
- [x] Dashboard Secret Requests page `/dashboard/secret-requests` - Requests list
- [x] Dashboard Create Secret Request `/dashboard/secret-requests/create` - Create form
- [x] Dashboard navigation sidebar - All nav items visible and clickable

## Navigation & UI Components
- [x] Header navigation - Home, Sign In, Sign Up links (unauthenticated)
- [x] Footer navigation - Privacy, Terms, API links
