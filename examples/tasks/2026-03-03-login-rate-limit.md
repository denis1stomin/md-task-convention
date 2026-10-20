---
status: todo
assignee: alice
reviewer: alice
priority: 2
claimed:
input: [src/server/session.js]
output: []
depends: []
---
# Login rate limit

Found while doing 2026-03-03-login-form.md (by claude): `POST /api/session` has no rate limit, so passwords can be
guessed without limit. Alice decides who does it and how strict it should be.

## Acceptance criteria
- [ ] Repeated failed logins from one IP or for one email are slowed down or blocked for a while
- [ ] The limit and the wait time are written in docs/auth.md

## Result

## Comments
