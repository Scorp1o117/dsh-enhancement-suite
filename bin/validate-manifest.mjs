#!/usr/bin/env node
/**
 * validate-manifest — validates plugins.json for the suite.
 *
 * Checks: at least one plugin, no duplicate names/keys, all required
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
if (manifest.dsh !== ">=0.2.0-rc.2 <0.3.0 || 0.2.1-rc.1 || 0.2.1-rc.2") fail(`expected dsh requirement >=0.2.0-rc.2 <0.3.0 || 0.2.1-rc.1 || 0.2.1-rc.2, got ${manifest.dsh ?? "missing"}`);
if (!Array.isArray(manifest.plugins)) {
  fail("plugins.json: missing plugins array");
} else {
  if (manifest.plugins.length < 1) fail("plugins.json: plugins array is empty");
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
    const pin = rc6Pins[p.name];
    if (pin !== "none" && !/^\d+\.\d+\.\d+$/.test(pin ?? "")) fail(`${p.name ?? "?"}: missing rc6 compatibility pin (semver, or "none" when the plugin requires DSH rc.7+)`);
  }
}

if (failed) {
  console.error("plugins.json validation FAILED");
  process.exitCode = 1;
} else {
  console.log(`plugins.json OK: ${manifest.plugins.map((p) => p.name).join(", ")}`);
}
