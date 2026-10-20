---
status: done
assignee: claude
reviewer: alice
priority: 1
claimed: claude, 2026-03-02 09:10
input: [docs/stack.md]
output: [package.json, src/, .github/workflows/ci.yml]
depends: []
---
# Project setup

Create the app skeleton from docs/stack.md: the web server, the test runner and a CI workflow that runs the tests
on every push.

## Acceptance criteria
- [x] `npm start` serves a "hello" page on localhost
- [x] `npm test` runs and passes (one example test)
- [x] CI runs the tests on every push and pull request
- [ ] CI also runs on Windows

## Result

Skeleton in `src/`, tests in `tests/`, CI in `.github/workflows/ci.yml` (Linux). The Windows job is left out:
the test setup uses POSIX paths; making it portable is about an hour of work. All other criteria met.

## Comments
- 2026-03-02 (alice, reviewer): accepted without the Windows criterion: we deploy on Linux only and nobody
  develops on Windows. Not worth the hour now; a new task if that changes.
