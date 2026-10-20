# md-task-convention

A convention for tasks as **local Markdown files in your repo**, so people and AI agents (Claude Code, ChatGPT,
Copilot, Cursor, ...) can hand work to each other: **one file per task, claim, review, done**. No app, no server,
no database: a folder of `.md` files that every person and every agent can read and write.

It came out of a real project where one person, Claude Code and ChatGPT (as a VS Code agent) worked on the same
game in parallel: code, art generation, reviews. Without rules, agents overwrote each other's lists, closed their
own work as "done" and quietly changed what "done" meant. These rules fixed that.

## The idea in one minute

```
tasks/
  README.md                        <- the rules (copy this repo's RULES.md)
  2026-03-02-login-form.md         <- one task = one file
  2026-03-02-password-reset.md
  archive/
    2026-02-27-project-setup.md    <- finished tasks, moved here by the reviewer
```

Every task file has a small YAML header and three sections:

```markdown
---
status: todo            # todo | doing | review | done | failed | blocked
assignee: claude        # who does it: a person or an agent
reviewer: alice         # who accepts it and closes it
priority: 2             # 1 = most urgent
claimed:                # who + when, set when work starts
input: [docs/spec.md]   # what to read
output: [src/login/]    # where the assignee may write
depends: []             # other task files that must be done first
---
# Login form

What to do, in plain words.

## Acceptance criteria
- [ ] Concrete, checkable statements, fixed when the task is created.

## Result
(filled in by the assignee when done)

## Comments
(anyone may add a dated line)
```

The life of a task:

```
todo --claim--> doing --hand in--> review --reviewer accepts--> done (moved to archive/)
                  ^                   |
                  +-- reviewer: back to todo, with what is missing under Comments
```

## The rules

The full text, ready to drop into your repo as `tasks/README.md`, is in [RULES.md](RULES.md). In short:

1. **One file per task.** Never a shared list: two agents editing one file at once lose work.
2. **Only edit a task assigned to you** (others may only add a line under Comments).
3. **Claim before you start:** `status: doing` and `claimed:` set and saved first.
4. **Hand in for review, never close it yourself:** fill in Result, tick the criteria, set `review`.
5. **Only the reviewer closes a task** (`done` + move to `archive/`), or sends it back to `todo`.
6. **The criteria are fixed when the task is created.** Only the reviewer may change them.
7. **Stay inside your scope:** write only to the task's `output`; never delete anything.
8. **New work = a new file**, assigned to the person who decides who does it.
9. **People decide priorities.** Agents take their own `todo` tasks in priority order.


## Getting agents to follow it

Copy [RULES.md](RULES.md) to `tasks/README.md` and point your agents at it, for example in `AGENTS.md`,
`CLAUDE.md` or `.github/copilot-instructions.md`:

> Tasks live in `tasks/`, one Markdown file per task. Read `tasks/README.md` and follow its rules exactly.
> Do only the tasks with `assignee: <your name>` and `status: todo`, in priority order.

Or paste one line into a chat agent:

> Read tasks/README.md, then do the tasks with `assignee: chatgpt` and `status: todo`, in priority order,
> following its rules.

## Why Markdown (and not JSON)

- The header is YAML front matter: machine-readable, so scripts and CI can use it like JSON.
- The body is prose (what to do, criteria, results, discussion). People and agents write it naturally in
  Markdown; in JSON it would be escaped strings nobody wants to edit.
- Every agent reads and writes Markdown reliably; a typo breaks one paragraph, not the whole file.
- Small, clean git diffs. GitHub and editors render it with no tools.

If you need JSON (a dashboard, CI), generate it: `node check-tasks.mjs tasks --json` writes `tasks/index.json`
from the headers. The `.md` files stay the source.

## The checker

[check-tasks.mjs](check-tasks.mjs) (Node 18+, no dependencies) checks a tasks folder against the convention:
the header fields and values, the sections, `doing` tasks claimed, `review` tasks with a Result, finished tasks
only in `archive/`, and `depends` pointing at files that exist. Archived tasks are history: they only need to be `done` or `failed` (older entries may predate the full header).

```
node check-tasks.mjs tasks           # report problems; exit code 1 if there are errors (use it in CI)
node check-tasks.mjs tasks --json    # also write tasks/index.json
node check-tasks.mjs examples/tasks  # try it on the examples
```

## Examples

[examples/tasks/](examples/tasks/) shows a small made-up web app with people and agents (alice, claude,
copilot, chatgpt) working side by side: a task in each state, a new task filed by an agent for something it found out of scope, a release that depends on two
others, and a finished task the reviewer accepted although a criterion was not met, with the reason under
Comments.

## How it compares

- **Issue trackers (GitHub Issues, Jira, Linear):** better for teams of people and long histories; agents need
  API access and credentials, and the tasks live outside the repo. This convention is offline, in the repo,
  and readable by any agent that can open a file.
- **Markdown task tools** (for example Backlog.md) and **AI task planners** (for example Taskmaster): they come
  with a CLI or an app and their own formats. This is only a convention: nothing to install, and the rules are
  about handing work between different agents and people safely (claiming, scope, who may close a task).
- **AGENTS.md and similar files** tell an agent how to work in a repo; this tells several agents and people how
  to share the work. They fit together (see above).

## License

[MIT](LICENSE)
