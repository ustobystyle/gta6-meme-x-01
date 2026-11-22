// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry is the X post itself, not this program's output. All this program
// has to do is hand the house the post's address: it copies POST.json from the
// repository root into the output directory, where the gate reads it. Nothing
// this program writes about the post is judged; the judge reads the post
// straight from X (its first picture, then its text).
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// POST.json holds the post's address, {"url": "https://x.com/<handle>/status/<id>"}.
// A placeholder address is refused by the gate on purpose, so the file must
// name a real post before the entry is submitted. This program checks the file
// is a well-formed address (an object with a url string on x.com) before it
// hands it over, so a mistyped POST.json fails here with a clear message
// instead of reaching the gate as a bad copy.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function readPostAddress(): string {
  const from = join(repoRoot, 'POST.json');
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(from, 'utf8'));
  } catch (error) {
    console.error(`could not read POST.json from ${repoRoot}: ${(error as Error).message}`);
    process.exit(1);
  }
  const url = (parsed as { url?: unknown }).url;
  if (typeof url !== 'string' || !url.startsWith('https://x.com/')) {
    console.error(`POST.json in ${repoRoot} does not name an X post URL`);
    process.exit(1);
  }
  return url;
}

function handOverPostAddress(): void {
  const url = readPostAddress();
  mkdirSync(outDir, { recursive: true });
  const from = join(repoRoot, 'POST.json');
  const to = join(outDir, 'POST.json');
  try {
    copyFileSync(from, to);
  } catch (error) {
    console.error(`could not copy POST.json from ${repoRoot}: ${(error as Error).message}`);
    process.exit(1);
  }
  console.log(`handed over post ${url}`);
}

handOverPostAddress();
