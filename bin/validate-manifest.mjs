#!/usr/bin/env node
/**
 * validate-manifest — validates plugins.json for the suite.
 *
 * Checks: exactly four plugins, no duplicate names/keys, all required
 * fields present, repo URLs are https github.com links. Exits non-zero on
 * any violation. Used by CI and `npm run check`.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const REQUIRED = ["key", "name", "displayName", "emoji", "category", "repo", "description", "descriptionEn"];

let failed = false;
const fail = (message) => {
  failed = true;
  console.error(`✗ ${message}`);
};

const manifest = JSON.parse(readFileSync(join(ROOT, "plugins.json"), "utf8"));
if (manifest.dsh !== ">=0.1.0-rc.7") fail(`expected dsh requirement >=0.1.0-rc.7, got ${manifest.dsh ?? "missing"}`);
if (!Array.isArray(manifest.plugins)) {
  fail("plugins.json: missing plugins array");
} else {
  if (manifest.plugins.length !== 4) fail(`expected exactly 4 plugins, got ${manifest.plugins.length}`);
  const names = manifest.plugins.map((p) => p.name);
  const keys = manifest.plugins.map((p) => p.key);
  if (new Set(names).size !== names.length) fail("duplicate plugin names");
  if (new Set(keys).size !== keys.length) fail("duplicate plugin keys");
  const rc6Pins = manifest.rc6Pins ?? {};
  for (const p of manifest.plugins) {
    for (const field of REQUIRED) {
      if (typeof p[field] !== "string" || p[field].length === 0) fail(`${p.name ?? "?"}: missing required field ${field}`);
    }
    if (!/^https:\/\/github\.com\//.test(p.repo ?? "")) fail(`${p.name ?? "?"}: repo must be an https github.com URL`);
    if (!/^\d+\.\d+\.\d+$/.test(rc6Pins[p.name] ?? "")) fail(`${p.name ?? "?"}: missing rc6 compatibility pin`);
  }
}

if (failed) {
  console.error("plugins.json validation FAILED");
  process.exitCode = 1;
} else {
  console.log(`plugins.json OK: ${manifest.plugins.map((p) => p.name).join(", ")}`);
}
