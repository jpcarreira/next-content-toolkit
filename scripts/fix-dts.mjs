#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

function fixDtsFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  // Remove .js and .mjs extensions from re-exports (TypeScript will resolve .d.ts automatically)
  const fixed = content
    .replace(/from ['"](.*)\.js['"]/g, 'from \'$1\'')
    .replace(/from ['"](.*)\.mjs['"]/g, 'from \'$1\'');

  if (content !== fixed) {
    writeFileSync(filePath, fixed, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.d.ts') || file.endsWith('.d.mts')) {
      fixDtsFile(filePath);
    }
  }
}

processDirectory(distDir);
console.log('✓ Fixed all .d.ts files');
