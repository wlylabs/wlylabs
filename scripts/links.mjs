#!/usr/bin/env node
/**
 * Add or remove a project's links without hand-editing lib/data.js.
 *
 *   npm run links -- list [project]
 *   npm run links -- add <project> <kind> <href> [label]
 *   npm run links -- remove <project> <kind> [href]
 *
 * Rewrites only the named project's `links: [...]` array in lib/data.js —
 * every other line in the file is left untouched — then rebuilds public/ so
 * the change is ready to review and commit.
 */

import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_FILE = join(ROOT, 'lib', 'data.js');

function usage() {
  process.stderr.write(
    'Usage:\n' +
      '  npm run links -- list [project]\n' +
      '  npm run links -- add <project> <kind> <href> [label]\n' +
      '  npm run links -- remove <project> <kind> [href]\n',
  );
  process.exit(1);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function quote(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

/** Leading whitespace of the line containing `index`. */
function lineIndent(source, index) {
  const lineStart = source.lastIndexOf('\n', index) + 1;
  return source.slice(lineStart, index).match(/^\s*/)[0];
}

/** Index just past the bracket matching the one at `openIndex`. */
function matchBracket(source, openIndex, open, close) {
  let depth = 0;

  for (let i = openIndex; i < source.length; i++) {
    if (source[i] === open) depth++;
    else if (source[i] === close && --depth === 0) return i;
  }

  throw new Error(`unbalanced ${open}${close} in lib/data.js`);
}

/** The `{ name: '<name>', ... }` object literal for a project, as a span over `source`. */
function findProject(source, name) {
  const marker = `name: ${quote(name)}`;
  const nameAt = source.indexOf(marker);
  if (nameAt === -1) return null;

  const start = source.lastIndexOf('{', nameAt);
  const end = matchBracket(source, start, '{', '}') + 1;
  return { start, end };
}

/** The project's `links: [...]` array, as a span over `source`, plus its indent. */
function findLinks(source, project) {
  const region = source.slice(project.start, project.end);
  const keyAt = region.indexOf('links:');
  if (keyAt === -1) return null;

  const bracketStart = project.start + region.indexOf('[', keyAt);
  const bracketEnd = matchBracket(source, bracketStart, '[', ']') + 1;
  return { start: bracketStart, end: bracketEnd, indent: lineIndent(source, project.start + keyAt) };
}

function serializeLinks(links, indent) {
  if (links.length === 0) return '[]';

  const items = links.map((link) => {
    const parts = [`kind: ${quote(link.kind)}`, `href: ${quote(link.href)}`];
    if (link.label) parts.push(`label: ${quote(link.label)}`);
    return `${indent}  { ${parts.join(', ')} },`;
  });

  return `[\n${items.join('\n')}\n${indent}]`;
}

async function loadProjects() {
  const { PROJECTS } = await import(pathToFileURL(DATA_FILE).href);
  return PROJECTS;
}

function findByName(projects, name) {
  const exact = projects.find((p) => p.name === name);
  if (exact) return exact;

  const insensitive = projects.filter((p) => p.name.toLowerCase() === name.toLowerCase());
  if (insensitive.length === 1) return insensitive[0];

  return null;
}

function listAvailable(projects) {
  return projects.map((p) => p.name).join(', ');
}

function isValidHref(href) {
  return typeof href === 'string' && URL.canParse(href);
}

async function writeLinks(name, links) {
  const source = await readFile(DATA_FILE, 'utf8');

  const project = findProject(source, name);
  if (!project) throw new Error(`no project named ${name} found in lib/data.js`);

  const span = findLinks(source, project);
  if (!span) throw new Error(`${name} has no links: [...] array in lib/data.js`);

  const next = source.slice(0, span.start) + serializeLinks(links, span.indent) + source.slice(span.end);
  await writeFile(DATA_FILE, next, 'utf8');
}

function rebuild() {
  const result = spawnSync(process.execPath, [join(ROOT, 'scripts', 'build.mjs')], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (result.status !== 0) fail('lib/data.js was updated but `npm run build` failed — check the error above.');
}

async function list(args) {
  if (args.length > 1) usage();

  const projects = await loadProjects();
  const [name] = args;

  let targets = projects;
  if (name) {
    const project = findByName(projects, name);
    if (!project) fail(`no project named "${name}" — have: ${listAvailable(projects)}`);
    targets = [project];
  }

  for (const project of targets) {
    process.stdout.write(`${project.name}\n`);
    if (project.links.length === 0) process.stdout.write('  (no links)\n');
    for (const link of project.links) {
      process.stdout.write(`  ${link.kind.padEnd(10)} ${link.href}${link.label ? `  (${link.label})` : ''}\n`);
    }
  }
}

async function add(args) {
  const [name, kind, href, label] = args;
  if (!name || !kind || !href) usage();
  if (!isValidHref(href)) fail(`"${href}" is not a valid absolute URL`);

  const projects = await loadProjects();
  const project = findByName(projects, name);
  if (!project) fail(`no project named "${name}" — have: ${listAvailable(projects)}`);

  if (project.links.some((l) => l.href === href)) {
    fail(`${project.name} already has a link to ${href}`);
  }

  const link = { kind, href };
  if (label) link.label = label;

  await writeLinks(project.name, [...project.links, link]);
  process.stdout.write(`Added ${kind} link to ${project.name}: ${href}\n`);
  rebuild();
}

async function remove(args) {
  const [name, kind, href] = args;
  if (!name || !kind) usage();

  const projects = await loadProjects();
  const project = findByName(projects, name);
  if (!project) fail(`no project named "${name}" — have: ${listAvailable(projects)}`);

  const matches = project.links.filter((l) => l.kind === kind && (!href || l.href === href));

  if (matches.length === 0) fail(`${project.name} has no ${kind} link${href ? ` to ${href}` : ''}`);
  if (matches.length > 1) {
    fail(
      `${project.name} has ${matches.length} ${kind} links — pass one to remove:\n` +
        matches.map((l) => `  ${l.href}`).join('\n'),
    );
  }

  const [target] = matches;
  const remaining = project.links.filter((l) => l !== target);

  await writeLinks(project.name, remaining);
  process.stdout.write(`Removed ${kind} link from ${project.name}: ${target.href}\n`);
  rebuild();
}

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'list':
    await list(args);
    break;
  case 'add':
    await add(args);
    break;
  case 'remove':
    await remove(args);
    break;
  default:
    usage();
}
