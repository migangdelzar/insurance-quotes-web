import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const readJson = (path) =>
  JSON.parse(readFileSync(resolve(directory, path), 'utf8'));
const elements = readJson('data/elements.json');
const enUS = readJson('data/translations/en-US.json');
const esMX = readJson('data/translations/es-MX.json');
let exitCode = 0;

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function checkTranslationKeys(enNode, esNode, path = '') {
  for (const key of Object.keys(enNode)) {
    const fullPath = path ? `${path}.${key}` : key;
    if (!(key in esNode)) {
      console.error(`MISSING: es-MX.${fullPath}`);
      exitCode = 1;
    } else if (isObject(enNode[key])) {
      if (!isObject(esNode[key])) {
        console.error(`TYPE: es-MX.${fullPath} must be an object`);
        exitCode = 1;
        continue;
      }
      checkTranslationKeys(enNode[key], esNode[key], fullPath);
    } else if (typeof enNode[key] !== typeof esNode[key]) {
      console.error(`TYPE: es-MX.${fullPath} must be a ${typeof enNode[key]}`);
      exitCode = 1;
    }
  }

  for (const key of Object.keys(esNode)) {
    const fullPath = path ? `${path}.${key}` : key;
    if (!(key in enNode)) {
      console.error(`EXTRA: es-MX.${fullPath}`);
      exitCode = 1;
    }
  }
}

function getValue(root, path) {
  return path.split('.').reduce((value, key) => value?.[key], root);
}

const testIds = new Set();
function checkTestId(testId, path) {
  if (!/^[a-z0-9-]+$/.test(testId)) {
    console.error(`INVALID: ${path} has malformed testId ${testId}`);
    exitCode = 1;
  }
  if (testIds.has(testId)) {
    console.error(`DUPLICATE: testId ${testId}`);
    exitCode = 1;
  }
  testIds.add(testId);
}

function checkElements(node, path = '') {
  for (const [key, value] of Object.entries(node)) {
    const fullPath = path ? `${path}.${key}` : key;

    if (typeof value === 'string') {
      checkTestId(value, fullPath);
      continue;
    }

    if (isObject(value) && typeof value.testId === 'string') {
      checkTestId(value.testId, fullPath);
      if (value.i18nKey && typeof getValue(enUS, value.i18nKey) !== 'string') {
        console.error(
          `INVALID: ${fullPath} references missing ${value.i18nKey}`
        );
        exitCode = 1;
      }
      continue;
    }

    if (isObject(value)) {
      checkElements(value, fullPath);
      continue;
    }

    console.error(
      `INVALID: ${fullPath} must define a testId or an object containing one`
    );
    exitCode = 1;
  }
}

checkTranslationKeys(enUS, esMX);
checkElements(elements);

if (exitCode === 0)
  console.log('All locale keys, element references, and testIds are valid.');
process.exit(exitCode);
