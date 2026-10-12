import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import vm from "node:vm";
import { Config, inject } from "../index.js";

const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const registry = JSON.parse(readFileSync(new URL("../plugins.json", import.meta.url)));
test("suite is a Desktop/Web bundle with six independent plugin packages", () => {
  assert.equal(registry.plugins.length, 6);
  assert.ok(registry.plugins.some(p => p.key === "motion" && p.name === "dsh-motion-ui"));
  assert.deepEqual(manifest.dsh.compatibility.profiles, ["web", "desktop"]);
  assert.equal(typeof Config, "function"); assert.ok(inject.includes("profileContext"));
  assert.match(readFileSync(new URL("../cordis.patch.yml", import.meta.url), "utf8"), /name: 'dsh-enhancement-suite'/);
  assert.doesNotMatch(readFileSync(new URL("../cordis.patch.yml", import.meta.url), "utf8"), /name: 'dsh-plugin-marketplace'/);
});

test("suite configuration follows DSH locale and sends a revision-checked batch request", async () => {
  let bundle, page, dictionaries, hook = 0;
  const states = [], writes = [];
  const snapshot = { status: "ready", writable: true, revision: 7, value: { inventory: { profile: "desktop", packages: [] } } };
  const scope = { getSnapshot: () => snapshot, subscribe: () => () => {}, mutate: async (ops, revision) => { writes.push({ ops, revision }); return true; } };
  const react = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat() }),
    useState: initial => { const index = hook++; if (!(index in states)) states[index] = typeof initial === "function" ? initial() : initial; return [states[index], next => { states[index] = typeof next === "function" ? next(states[index]) : next; }]; }, useEffect() {},
  };
  vm.runInNewContext(readFileSync(new URL("../client.js", import.meta.url), "utf8"), { window: { __ModuleLoader__: { load: value => { bundle = value; } } }, setTimeout, clearTimeout });
  bundle.factory(() => react).apply({
    locale: { register: (_ns, value) => { dictionaries = value; return () => {}; }, bind: () => key => key },
    effect: fn => fn(), configForms: { get: ns => { assert.equal(ns, "enhancement-suite"); return scope; } },
    slots: { inject: (_name, fn) => fn(), register: (spec, render) => { assert.equal(spec.key, manifest.name); page = render; } },
  });
  assert.deepEqual(Object.keys(dictionaries.en).sort(), Object.keys(dictionaries.zh).sort());
  const element = page({}), tree = element.type(element.props);
  const buttons = [];
  function visit(node) { if (!node || typeof node !== "object") return; if (node.type === "button") buttons.push(node); node.children?.forEach(visit); }
  visit(tree); assert.equal(buttons.length, 9);
  buttons[0].props.onClick(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(writes.length, 1); assert.equal(writes[0].revision, 7);
  assert.equal(writes[0].ops[0].value.action, "suite-install");
});

test("CLI list includes Motion UI and honors the desktop profile", () => {
  const output = execFileSync(process.execPath, [new URL("../bin/dsh-enhance.mjs", import.meta.url).pathname.replace(/^\/(.:)/, "$1"), "list", "--profile", "desktop"], { encoding: "utf8" });
  assert.match(output, /6 plugins/); assert.match(output, /Profile: desktop/); assert.match(output, /dsh-motion-ui/);
});
