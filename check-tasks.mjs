#!/usr/bin/env node
// Checks a tasks folder against md-task-convention (https://github.com/denis1stomin/md-task-convention).
// Node 18+, no dependencies.
//
//   node check-tasks.mjs [tasks-folder] [--json]
//
// Prints one line per problem; exits with 1 if there are errors (warnings don't fail). --json also writes
// <tasks-folder>/index.json: every task's header plus its file, title and criteria counts.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--')) || 'tasks';
const writeJson = args.includes('--json');
if (!existsSync(dir)) { console.error(`${dir}: no such folder`); process.exit(2); }

const STATUSES = ['todo', 'doing', 'review', 'done', 'failed', 'blocked'];
const FIELDS = ['status', 'assignee', 'reviewer', 'priority', 'claimed', 'input', 'output', 'depends'];
const SECTIONS = ['Acceptance criteria', 'Result', 'Comments'];
const NAME = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(-[a-z0-9]+)*\.md$/; // checked for active tasks

const problems = [];
const say = (level, file, text) => problems.push({ level, file, text });

// The header: simple `key: value` lines between --- markers; [a, b] values become lists.
function parse(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const header = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*?)\s*(#.*)?$/);
    if (!kv) continue;
    let v = kv[2];
    if (v.startsWith('[') && v.endsWith(']')) v = v.slice(1, -1).split(/[,;]/).map((s) => s.trim()).filter(Boolean);
    header[kv[1]] = v;
  }
  return { header, body: m[2] };
}

function section(body, name) {
  const m = body.match(new RegExp(`^## ${name}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'));
  return m ? m[1].trim() : null;
}

const files = [];
for (const [sub, archived] of [['', false], ['archive', true]]) {
  const d = join(dir, sub);
  if (!existsSync(d)) continue;
  for (const f of readdirSync(d)) if (f.endsWith('.md') && f !== 'README.md') files.push({ path: join(d, f), name: f, archived });
}
const names = new Set(files.map((f) => f.name));

const index = [];
for (const f of files) {
  const rel = relative(process.cwd(), f.path);
  if (!f.archived && !NAME.test(f.name)) say('warn', rel, 'file name is not YYYY-MM-DD-short-name.md');
  const doc = parse(readFileSync(f.path, 'utf8'));
  if (!doc) { say('error', rel, 'no header (--- ... --- at the top)'); continue; }
  const h = doc.header;
  const title = (doc.body.match(/^# (.+)$/m) || [])[1];
  if (f.archived) { // history: only where it is; older entries may predate the full header
    if (h.status !== 'done' && h.status !== 'failed') say('error', rel, `in archive/, but the status is "${h.status}"`);
    index.push({ file: relative(dir, f.path), title: title || null, ...h });
    continue;
  }
  for (const k of FIELDS) if (!(k in h)) say('error', rel, `header: missing "${k}"`);
  if (h.status && !STATUSES.includes(h.status)) say('error', rel, `status "${h.status}" is not one of ${STATUSES.join(', ')}`);
  for (const k of ['assignee', 'reviewer']) if (k in h && !h[k]) say('error', rel, `header: "${k}" is empty`);
  if ('priority' in h && !/^\d+$/.test(h.priority)) say('error', rel, 'priority is not a whole number');
  for (const k of ['input', 'output', 'depends']) if (k in h && !Array.isArray(h[k])) say('warn', rel, `"${k}" should be a list: [a, b]`);

  if (!title) say('error', rel, 'no "# Title" line');
  for (const s of SECTIONS) if (section(doc.body, s) === null) say('error', rel, `no "## ${s}" section`);
  const crit = section(doc.body, 'Acceptance criteria') || '';
  const boxes = [...crit.matchAll(/^- \[( |x|X)\]/gm)];
  if (section(doc.body, 'Acceptance criteria') !== null && !boxes.length) say('error', rel, 'no "- [ ]" items under Acceptance criteria');
  const ticked = boxes.filter((b) => b[1] !== ' ').length;
  const result = section(doc.body, 'Result') || '';

  if (h.status === 'doing' && !h.claimed) say('error', rel, 'doing, but "claimed" is empty (claim before you start)');
  if (h.status === 'review' && !result) say('error', rel, 'in review, but the Result is empty');
  if (h.status === 'review' && ticked < boxes.length) say('warn', rel, `in review with ${boxes.length - ticked} criteria not ticked: explain them in the Result`);
  if (h.status === 'done' || h.status === 'failed') say('error', rel, `${h.status}, but not moved to archive/`);
  for (const dep of Array.isArray(h.depends) ? h.depends : []) {
    if (!names.has(dep.split('/').pop())) say('error', rel, `depends on "${dep}", which does not exist`);
  }
  index.push({ file: relative(dir, f.path), title: title || null, ...h, criteria: boxes.length, ticked });
}

// A dependency on a task that is not done while this one is being worked on.
const byName = new Map(index.map((t) => [t.file.split('/').pop(), t]));
for (const t of index) {
  if (!['doing', 'review'].includes(t.status)) continue;
  for (const dep of Array.isArray(t.depends) ? t.depends : []) {
    const d = byName.get(dep.split('/').pop());
    if (d && d.status !== 'done') say('warn', join(dir, t.file), `is ${t.status}, but "${dep}" is still ${d.status}`);
  }
}

for (const p of problems) console.log(`${p.level === 'error' ? 'ERROR' : 'warn '} ${p.file}: ${p.text}`);
const errors = problems.filter((p) => p.level === 'error').length;
const count = (s) => index.filter((t) => t.status === s).length;
console.log(`${index.length} tasks (${STATUSES.map((s) => `${count(s)} ${s}`).join(', ')}): ${errors} errors, ${problems.length - errors} warnings`);
if (writeJson) {
  writeFileSync(join(dir, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  console.log(`wrote ${join(dir, 'index.json')}`);
}
process.exit(errors ? 1 : 0);
