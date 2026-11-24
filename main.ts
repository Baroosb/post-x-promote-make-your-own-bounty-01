// Entry program for the make.fun bounty post-x-promote-make-your-own-bounty-01
// (Node 22, standard library only).
//
// The entry itself is a post on X; this repository only hands in the post's
// address. POST.json at the repository root names it, and this program copies
// that file, byte for byte, into the output directory, where the house reads
// it and then reads the post's public counts (replies + reposts + quotes)
// from X. Nothing the program writes about the post is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

// Read the hand-in file first and make sure it names one post on X before
// anything is copied: a malformed POST.json fails here, in the open, instead
// of at the gate.
let post: { url?: unknown };
try {
  post = JSON.parse(readFileSync(source, 'utf8')) as { url?: unknown };
} catch (err) {
  console.error(`POST.json at ${source} could not be read as JSON: ${(err as Error).message}`);
  process.exit(1);
}
const url = typeof post.url === 'string' ? post.url : '';
if (!/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(url)) {
  console.error(`POST.json names no X post address: ${JSON.stringify(post.url)}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, target);

// The gate reads the copy, not the original, so prove the two files hold the
// same bytes before this program calls itself done.
if (!readFileSync(source).equals(readFileSync(target))) {
  console.error(`The copied POST.json at ${target} differs from ${source}`);
  process.exit(1);
}
