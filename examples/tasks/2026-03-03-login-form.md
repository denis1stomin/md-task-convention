---
status: review
assignee: claude
reviewer: alice
priority: 1
claimed: claude, 2026-03-03 10:00
input: [docs/auth.md, src/server/]
output: [src/login/, tests/login.test.js]
depends: [2026-03-02-project-setup.md]
---
# Login form

A login page (email + password) that calls the existing `POST /api/session` endpoint, shows errors inline and
redirects to the dashboard on success. Out of scope: sign-up, password reset (own task).

## Acceptance criteria
- [x] Wrong password shows "Email or password is wrong" under the form, the email stays filled in
- [x] Success redirects to /dashboard
- [x] The button is disabled while the request runs (no double submit)
- [x] Tests cover the three cases above

## Result

Page in `src/login/`, tests in `tests/login.test.js` (4 tests, all pass). Also found: the endpoint has no rate
limit; not in scope, filed as `2026-03-03-login-rate-limit.md` (assignee: alice, to decide).

## Comments
