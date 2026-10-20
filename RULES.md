# Tasks: how agents and people exchange work

<!-- md-task-convention: https://github.com/denis1stomin/md-task-convention . Copy this file to tasks/README.md and edit the names below. -->

This folder holds the tasks shared by the people and the AI agents of this project. Every task is one Markdown file here. If you are an AI agent reading this: follow these rules exactly.

**Finished tasks** move to `archive/` (the history).

## The rules

1. **One file per task.** Name: `YYYY-MM-DD-short-name.md`. Never put two tasks in one file, and never keep a shared list: two agents editing the same file at once lose work.
2. **Only edit a task assigned to you.** Each file starts with a header (below). Work only on tasks whose `assignee` is you. Do not change other agents' tasks, except to add a line under `## Comments`.
3. **Claim before you start.** Change `status: todo` to `status: doing` and `claimed:` to your name and the time, save, then start. If a task is already `doing`, leave it alone.
4. **Hand in for review, never close it yourself.** When the work is done, write what you made, where you saved it and anything the next person must know under `## Result`, check it against every line of `## Acceptance criteria` (tick `[x]` what is met, explain any `[ ]`), and set `status: review`. Do not set `done` and do not move the file.
5. **Only the reviewer closes a task.** The `reviewer` (usually a person) checks the Result against the acceptance criteria and either sets `status: done` and moves the file into `archive/`, or sets `status: todo` again with what is missing under `## Comments` (the assignee then reworks it). `failed` is also the reviewer's call.
6. **The criteria are fixed when the task is created.** Only the reviewer may change `## Acceptance criteria`; an assignee who thinks one is wrong says so under Comments.
7. **Stay inside your scope.** A task lists what to read (`input`) and where to write (`output`). Write only there. Never change files a task does not name, and never delete anything.
8. **New work = a new file.** If you find something that needs doing, add a new task file with `assignee:` the person who decides who does it and `status: todo`.
9. **People decide priorities.** `priority: 1` is the most urgent. Take your own `todo` tasks in priority order.

## The header

```
---
status: todo            # todo | doing | review | done | failed | blocked
assignee: claude        # who does it: a person or an agent (e.g. alice, claude, chatgpt)
reviewer: alice         # who accepts it and closes it (usually a person)
priority: 2             # 1 = most urgent
claimed:                # who + when, set when work starts
input: [files or folders to read]
output: [files or folders to write]
depends: [other task files that must be done first]
---
# Title

What to do, in plain words.

## Acceptance criteria
- [ ] Each a concrete, checkable statement (what must be true for the reviewer to accept it).

## Result
(filled in when done)

## Comments
(anyone may add a dated line here)
```

## For a chat agent, in one line

"Read tasks/README.md, then do the tasks with `assignee: chatgpt` and `status: todo`, in priority order, following its rules."
