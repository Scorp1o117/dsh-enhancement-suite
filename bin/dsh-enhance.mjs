#!/usr/bin/env node
/**
 * dsh-enhance — DeepSeek Harness Enhancement Suite CLI.
 *
 * Zero-dependency, cross-platform (Windows / Linux / macOS) installer and
 * registry for the four Scorp1o117 DSH plugins:
 *
 *   vision      dsh-tool-vision          Vision
 *   soul        dsh-soul-md              Persona
 *   memory      dsh-tdai-memory          Memory
 *   marketplace dsh-plugin-marketplace   Marketplace
 *
 * Install always prefers the official DeepSeek Harness plugin CLI
 * (`dsh plugin --profile <profile> add <package>`); this suite never loads
 * the plugins through its own dependency graph. Non-bundle plugins are then
 * mounted into the profile's cordis.patch.yml with the same safe, idempotent
 * logic the marketplace itself uses.
 *
 * Safety rules:
 *  - subprocesses are spawned with argument ARRAYS, never shell strings;
 *  - no API keys are read, printed, or forwarded;
 *  - every failure is reported explicitly with a non-zero exit code.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const MANIFEST = JSON.parse(readFileSync(join(ROOT, "plugins.json"), "utf8"));
const PKG = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const PLUGINS = MANIFEST.plugins;
const DEFAULT_PROFILE = MANIFEST.defaultProfile ?? "web";
/** Short keys and full package names are both accepted for --only. */
const KEY_ALIASES = new Map(PLUGINS.map((p) => [p.key, p.name]));
const NODE_MIN = MANIFEST.node ?? ">=22.18";

const ok = (msg) => console.log(`  ✓ ${msg}`);
const bad = (msg) => console.log(`  ✗ ${msg}`);
const info = (msg) => console.log(`  · ${msg}`);
const head = (msg) => console.log(`\n${msg}`);

// ── tiny helpers ────────────────────────────────────────────────────────────

class CliError extends Error {}

function dshHome() {
  return process.env.DSH_HOME || join(homedir(), ".dsh");
}

function profileDir(profile) {
  return join(dshHome(), "profiles", profile);
}

function profileManifest(profile) {
  try {
    return JSON.parse(readFileSync(join(profileDir(profile), "package.json"), "utf8"));
  } catch {
    return null;
  }
}

function installedManifest(pkg, profile) {
  try {
    return JSON.parse(readFileSync(join(profileDir(profile), "node_modules", pkg, "package.json"), "utf8"));
  } catch {
    return null;
  }
}

/** Locate the dsh CLI on PATH (dsh.cmd / dsh.exe on Windows, dsh elsewhere). */
function findDsh() {
  const override = process.env.DSH_ENHANCE_DSH_BIN;
  if (override) return override;
  const names = process.platform === "win32" ? ["dsh.cmd", "dsh.exe", "dsh"] : ["dsh"];
  const entries = (process.env.PATH ?? "").split(process.platform === "win32" ? ";" : ":").filter(Boolean);
  for (const dir of entries) {
    for (const name of names) {
      const candidate = join(dir, name);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

/**
 * Spawn one subprocess with an argument array (never a shell string).
 * On Windows the resolved .cmd shim is executed through the shell with
 * per-argument quoting applied by Node, which keeps every argument opaque.
 */
function run(bin, args, { capture = false } = {}) {
  return new Promise((resolve) => {
    const child = spawn(bin, args, {
      shell: process.platform === "win32",
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    if (capture) {
      child.stdout.on("data", (d) => { stdout += d; });
      child.stderr.on("data", (d) => { stderr += d; });
    }
    child.on("error", (error) => resolve({ code: -1, stdout, stderr, error }));
    child.on("close", (code) => resolve({ code: code ?? -1, stdout, stderr }));
  });
}

/** Minimal semver compare (numeric dotted triples), enough for the Node gate. */
function parseVersion(v) {
  const m = /^(\d+)\.(\d+)(?:\.(\d+))?/.exec(String(v).trim());
  return m ? [Number(m[1]), Number(m[2]), Number(m[3] ?? 0)] : null;
}
function versionGte(current, minimum) {
  const c = parseVersion(current);
  const m = parseVersion(minimum);
  if (!c || !m) return false;
  for (let i = 0; i < 3; i += 1) {
    if (c[i] > m[i]) return true;
    if (c[i] < m[i]) return false;
  }
  return true;
}

function installedVersion(pkg, profile) {
  return installedManifest(pkg, profile)?.version ?? null;
}

/** Bundle plugins are auto-mounted by their own dsh.bundle layer. */
function isBundlePackage(pkg, profile) {
  const manifest = installedManifest(pkg, profile);
  return Boolean(manifest && typeof manifest.dsh?.bundle?.patch === "string" && manifest.dsh.bundle.patch.length > 0);
}

function isInProfileBundles(pkg, profile) {
  return (profileManifest(profile)?.dsh?.profile?.bundles ?? []).includes(pkg);
}

function isMountedInPatch(pkg, profile) {
  try {
    const src = readFileSync(join(profileDir(profile), "cordis.patch.yml"), "utf8");
    return src.includes(`name: '${pkg}'`) || src.includes(`name: "${pkg}"`);
  } catch {
    return false;
  }
}

/**
 * Append a mount row for `pkg` to the profile's cordis.patch.yml (idempotent).
 * Mirrors the marketplace's own logic: bundle plugins are skipped (their
 * bundle layer auto-mounts them), an empty `[]` patch is replaced with a
 * block-style insert list, and a non-empty flow-style array is refused
 * rather than corrupted.
 */
function ensureMounted(pkg, profile) {
  const patch = join(profileDir(profile), "cordis.patch.yml");
  if (!existsSync(patch)) return { changed: false, note: "cordis.patch.yml not found; mount manually" };
  if (isInProfileBundles(pkg, profile)) return { changed: false, note: "already mounted via dsh.profile.bundles" };
  if (isBundlePackage(pkg, profile)) return { changed: false, note: "bundle plugin: auto-mounted via its own dsh.bundle layer" };
  let src = readFileSync(patch, "utf8");
  if (src.includes(`name: '${pkg}'`) || src.includes(`name: "${pkg}"`)) return { changed: false, note: "already mounted in cordis.patch.yml" };
  const id = pkg.replace(/^@[^/]+\//, "").replace(/[^a-z0-9-]/g, "-") || pkg;
  const row = `\n    - id: ${id}\n      name: '${pkg}'`;
  const emptyArray = /^(\s*(?:#[^\n]*\n?)*)\[\s*\]\s*$/.exec(src);
  if (emptyArray) {
    const next = `${emptyArray[1]}- insert:${row}\n`;
    if (process.env.DSH_ENHANCE_DRY_RUN !== "1") writeFileSync(patch, next, "utf8");
    return { changed: true, note: "mounted in cordis.patch.yml" };
  }
  const insertAt = src.search(/^- insert:\s*$/m);
  if (insertAt >= 0) {
    const next = src.slice(0, insertAt + "- insert:".length) + row + src.slice(insertAt + "- insert:".length);
    if (process.env.DSH_ENHANCE_DRY_RUN !== "1") writeFileSync(patch, next, "utf8");
    return { changed: true, note: "mounted in cordis.patch.yml" };
  }
  if (/^\s*\[/.test(src)) return { changed: false, note: "patch file uses a flow-style array; mount manually" };
  if (process.env.DSH_ENHANCE_DRY_RUN !== "1") writeFileSync(patch, `${src}\n- insert:${row}\n`, "utf8");
  return { changed: true, note: "mounted in cordis.patch.yml" };
}

function resolveSelection(only) {
  if (only.length === 0) return [...PLUGINS];
  const seen = new Set();
  const selected = [];
  for (const raw of only) {
    const token = raw.trim();
    const name = KEY_ALIASES.get(token) ?? token;
    const plugin = PLUGINS.find((p) => p.name === name);
    if (!plugin) throw new CliError(`unknown plugin "${token}" (valid: ${PLUGINS.map((p) => `${p.key} (${p.name})`).join(", ")})`);
    if (!seen.has(plugin.name)) {
      seen.add(plugin.name);
      selected.push(plugin);
    }
  }
  return selected;
}

function parseArgs(argv) {
  const out = {
    command: null,
    profile: DEFAULT_PROFILE,
    only: [],
    dryRun: false,
    help: false,
    version: false,
    unknown: [],
  };
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") out.help = true;
    else if (arg === "--version" || arg === "-V") out.version = true;
    else if (arg === "--dry-run") out.dryRun = true;
    else if (arg === "--profile") {
      out.profile = argv[i + 1];
      if (!out.profile) throw new CliError("--profile requires a value");
      i += 1;
    } else if (arg.startsWith("--profile=")) out.profile = arg.slice("--profile=".length);
    else if (arg === "--only") {
      const value = argv[i + 1];
      if (!value) throw new CliError("--only requires a value (comma-separated keys or package names)");
      out.only.push(...value.split(",").map((s) => s.trim()).filter(Boolean));
      i += 1;
    } else if (arg.startsWith("--only=")) {
      out.only.push(...arg.slice("--only=".length).split(",").map((s) => s.trim()).filter(Boolean));
    } else if (arg.startsWith("-") && arg !== "-") out.unknown.push(arg);
    else positional.push(arg);
  }
  out.command = positional[0] ?? null;
  return out;
}

function printHelp() {
  console.log(`dsh-enhance — DeepSeek Harness Enhancement Suite v${PKG.version}

Usage:
  dsh-enhance <command> [options]

Commands:
  list                          Show the plugin registry (installed state per profile)
  install                       Install all four plugins into a profile
  update                        Update installed plugins to the latest versions
  doctor                        Check Node, dsh CLI, profile and per-plugin state

Options:
  --profile <name>              Target profile (default: ${DEFAULT_PROFILE})
  --only <keys>                 Comma-separated selection: ${PLUGINS.map((p) => p.key).join(",")} (or package names)
  --dry-run                     Print what would run without executing anything
  --help, -h                    Show this help
  --version, -V                 Show the suite version

Examples:
  dsh-enhance list
  dsh-enhance install --dry-run
  dsh-enhance install --profile web --only vision,soul
  dsh-enhance doctor

Notes:
  - Install prefers the official CLI: dsh plugin --profile <profile> add <package>
  - Requires Node ${NODE_MIN} (dsh-tdai-memory constraint)
  - This suite never loads plugins through its own dependency graph`);
}

// ── commands ────────────────────────────────────────────────────────────────

function cmdList(profile) {
  console.log(`DeepSeek Harness Enhancement Suite v${PKG.version} — ${PLUGINS.length} plugins`);
  console.log(`Profile: ${profile}`);
  head("");
  for (const p of PLUGINS) {
    const version = installedVersion(p.name, profile);
    const state = version ? `✓ installed (${version})` : "✗ not installed";
    console.log(`  ${p.emoji} ${p.key.padEnd(12)} ${p.name.padEnd(26)} ${state}`);
    console.log(`     ${p.descriptionEn} — ${p.repo}`);
  }
  head("");
  console.log(`Node requirement: ${NODE_MIN} (running ${process.version})`);
}

async function cmdInstall(profile, only, dryRun) {
  const plugins = resolveSelection(only);
  const dsh = findDsh();
  if (!dsh) {
    bad("dsh CLI not found on PATH — install dsh first (https://github.com/deepseek-ai/deepseek-harness)");
    process.exitCode = 1;
    return;
  }
  head(`Installing ${plugins.length} plugin(s) into profile "${profile}"`);
  const failures = [];
  for (const p of plugins) {
    info(`${p.emoji} ${p.name}`);
    const addArgs = ["plugin", "--profile", profile, "add", p.name];
    if (dryRun) {
      ok(`would run: dsh ${addArgs.join(" ")}`);
    } else {
      const result = await run(dsh, addArgs);
      if (result.code !== 0) {
        const tail = (result.stderr || result.stdout || "").trim().split("\n").slice(-3).join(" ");
        bad(`${p.name} install failed (${result.code}): ${tail || result.error?.message || "unknown error"}`);
        failures.push(`${p.name}: dsh plugin add exited ${result.code}`);
        continue;
      }
      ok(`installed via dsh plugin add`);
    }
    const mount = ensureMounted(p.name, profile);
    if (dryRun) {
      info(`would ${mount.changed ? "mount" : "skip mounting"}: ${mount.note}`);
      ok(`OK (dry-run)`);
    } else if (mount.changed) {
      ok(mount.note);
    } else {
      info(mount.note);
    }
  }
  head("");
  const failed = failures.length;
  const succeeded = plugins.length - failed;
  console.log(`${succeeded}/${plugins.length} plugin(s) OK${failed > 0 ? `, ${failed} failed` : ""}.`);
  if (failed > 0) {
    console.log("Failures:");
    for (const f of failures) console.log(`  ✗ ${f}`);
    console.log("Fix the reported plugin(s) and re-run dsh-enhance install. No partial state was hidden.");
    process.exitCode = 1;
  } else {
    console.log("Restart dsh web for the new plugins to load.");
  }
}

async function cmdUpdate(profile, only, dryRun) {
  const plugins = resolveSelection(only);
  const dsh = findDsh();
  if (!dsh) {
    bad("dsh CLI not found on PATH");
    process.exitCode = 1;
    return;
  }
  head(`Updating ${plugins.length} plugin(s) in profile "${profile}"`);
  const failures = [];
  for (const p of plugins) {
    if (!installedManifest(p.name, profile)) {
      info(`${p.emoji} ${p.name}: not installed — run "dsh-enhance install" first`);
      continue;
    }
    const args = ["plugin", "--profile", profile, "update", p.name];
    if (dryRun) {
      ok(`would run: dsh ${args.join(" ")}`);
    } else {
      const result = await run(dsh, args);
      if (result.code !== 0) {
        const tail = (result.stderr || result.stdout || "").trim().split("\n").slice(-3).join(" ");
        bad(`${p.name} update failed (${result.code}): ${tail || result.error?.message || "unknown error"}`);
        failures.push(`${p.name}: dsh plugin update exited ${result.code}`);
        continue;
      }
      ok(`updated: ${p.name} → ${installedVersion(p.name, profile) ?? "latest"}`);
    }
    const mount = ensureMounted(p.name, profile);
    if (!dryRun && mount.changed) ok(mount.note);
  }
  head("");
  if (failures.length > 0) {
    for (const f of failures) console.log(`  ✗ ${f}`);
    process.exitCode = 1;
  } else {
    console.log("Update finished. Restart dsh web to load the new versions.");
  }
}

function cmdDoctor(profile) {
  head("DeepSeek Harness Enhancement Suite — doctor");
  const nodeOk = versionGte(process.versions.node, NODE_MIN.replace(/^>=\s*/, ""));
  if (nodeOk) ok(`Node ${process.versions.node} (>= ${NODE_MIN.replace(/^>=\s*/, "")})`);
  else {
    bad(`Node ${process.versions.node} — this suite requires ${NODE_MIN} (dsh-tdai-memory constraint)`);
    process.exitCode = 1;
  }
  const dsh = findDsh();
  if (dsh) {
    ok(`dsh CLI found: ${dsh}`);
  } else {
    bad("dsh CLI not found on PATH — install DeepSeek Harness first");
    process.exitCode = 1;
  }
  const pdir = profileDir(profile);
  if (existsSync(pdir)) ok(`profile "${profile}" exists: ${pdir}`);
  else {
    bad(`profile "${profile}" not found at ${pdir} — create it with "dsh plugin --profile ${profile} add <package>"`);
    process.exitCode = 1;
  }
  head("");
  for (const p of PLUGINS) {
    const version = installedVersion(p.name, profile);
    if (!version) {
      bad(`${p.emoji} ${p.name}: not installed`);
      continue;
    }
    ok(`${p.emoji} ${p.name}: installed (${version})`);
    const mounted = isInProfileBundles(p.name, profile) || isMountedInPatch(p.name, profile) || isBundlePackage(p.name, profile);
    if (mounted) info(`   mounted: ${isInProfileBundles(p.name, profile) ? "dsh.profile.bundles" : isMountedInPatch(p.name, profile) ? "cordis.patch.yml" : "own dsh.bundle layer"}`);
    else bad(`   not mounted — run "dsh-enhance install"`);
  }
  head("");
  console.log("Doctor finished. No API keys are read or printed.");
}

// ── entry ───────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.unknown.length > 0) {
    bad(`unknown option(s): ${args.unknown.join(", ")}`);
    printHelp();
    process.exitCode = 1;
    return;
  }
  if (args.version) {
    console.log(PKG.version);
    return;
  }
  if (args.help || !args.command) {
    printHelp();
    if (!args.help) process.exitCode = 1;
    return;
  }
  if (args.dryRun) process.env.DSH_ENHANCE_DRY_RUN = "1";
  try {
    switch (args.command) {
      case "list":
        cmdList(args.profile);
        break;
      case "install":
        await cmdInstall(args.profile, args.only, args.dryRun);
        break;
      case "update":
        await cmdUpdate(args.profile, args.only, args.dryRun);
        break;
      case "doctor":
        cmdDoctor(args.profile);
        break;
      default:
        bad(`unknown command "${args.command}"`);
        printHelp();
        process.exitCode = 1;
    }
  } catch (error) {
    if (error instanceof CliError) {
      bad(error.message);
      process.exitCode = 1;
    } else {
      bad(`unexpected error: ${error?.stack ?? error}`);
      process.exitCode = 1;
    }
  }
}

main();
