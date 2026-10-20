---
status: doing
assignee: copilot
reviewer: alice
priority: 2
claimed: copilot, 2026-03-03 14:20
input: [docs/auth.md, src/server/mail.js]
output: [src/reset/, src/server/reset.js, tests/reset.test.js]
depends: [2026-03-02-project-setup.md]
---
# Password reset

"Forgot password" link on the login page: the user enters an email and gets a one-time link valid for 30
minutes; the link opens a form to set a new password.

## Acceptance criteria
- [ ] The link works once and expires after 30 minutes
- [ ] The response is the same whether the email exists or not
- [ ] Tests for: valid link, used link, expired link, unknown email

## Result

## Comments
