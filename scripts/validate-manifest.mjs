import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const manifestPath = 'manifest.json';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const missingFiles = [];

for (const contentScript of manifest.content_scripts ?? []) {
  for (const scriptPath of contentScript.js ?? []) {
    missingFiles.push(...(await missingPath(scriptPath)));
  }

  for (const stylePath of contentScript.css ?? []) {
    missingFiles.push(...(await missingPath(stylePath)));
  }
}

if (missingFiles.length > 0) {
  console.error('Manifest references missing files:');

  for (const filePath of missingFiles) {
    console.error(`  - ${filePath}`);
  }

  process.exit(1);
}

console.log('manifest ok');

async function missingPath(filePath) {
  try {
    await access(path.resolve(filePath));
    return [];
  } catch {
    return [filePath];
  }
}
