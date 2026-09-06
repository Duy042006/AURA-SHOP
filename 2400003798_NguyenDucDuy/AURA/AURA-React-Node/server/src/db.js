import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data', 'store');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

export function readCollection(name, defaultValue = []) {
  ensureStore();
  const fp = filePath(name);
  if (!fs.existsSync(fp)) {
    writeCollection(name, defaultValue);
    return defaultValue;
  }
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch {
    return defaultValue;
  }
}

export function writeCollection(name, data) {
  ensureStore();
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf8');
}

export function nextId(items, key = 'id') {
  if (!items.length) return 1;
  return Math.max(...items.map((x) => Number(x[key]) || 0)) + 1;
}
