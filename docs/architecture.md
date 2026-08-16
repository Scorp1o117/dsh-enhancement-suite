# Architecture — dsh-enhancement-suite

## Positioning

`dsh-enhancement-suite` is the **official entry point and installer** for the four
Scorp1o117 DeepSeek Harness plugins. It is deliberately **not** a wrapper that
owns the plugins:

- The four upstream repositories are the single source of truth for each plugin.
- This repository vendors **no plugin source code**.
- The suite's only runtime artifact is a zero-dependency CLI plus a manifest.

```
┌─────────────────────────────────────────────────────────────┐
│ dsh-enhancement-suite (this repo)                            │
│   README / docs / manifest / CLI                            │
│   └── bin/dsh-enhance.mjs  ── spawns ──▶  dsh plugin CLI    │
│                                              │              │
│   plugins.json (registry metadata only)      │ installs     │
└──────────────────────────────────────────────│──────────────┘
                                               ▼
        ┌───────────────┬───────────────┬───────────────┬──────────────────┐
        │ dsh-tool-vision│ dsh-soul-md   │ dsh-tdai-memory│ dsh-plugin-      │
        │ (upstream)     │ (upstream)    │ (upstream)     │ marketplace      │
        └───────────────┴───────────────┴───────────────┴──────────────────┘
```

## Why the official CLI, and why not transitive dependencies

Installing through `dsh plugin --profile <p> add <pkg>` (which forwards to pnpm
inside the profile and reconciles `dsh.profile.bundles`) keeps the plugins
resolvable from the **profile root**, exactly as if the user installed them by
hand. Loading the plugins as dependencies of this suite package would make them
resolve through the suite's `node_modules` chain, which pnpm may place outside
the profile — plugins then fail to load at boot. Hence:

- `package.json` has **zero dependencies**.
- The suite never emits its own cordis patch for the four plugins.
- Mounting (when required) is written into the **profile's own**
  `cordis.patch.yml`, with the same idempotent logic the marketplace uses.

## Plugin manifest (`plugins.json`)

| Field | Meaning |
|---|---|
| `key` | Short CLI key (`vision`, `soul`, `memory`, `marketplace`) |
| `name` | npm package name (also the `dsh plugin add` argument) |
| `displayName` | Display name |
| `emoji` | Card emoji used by the CLI/README |
| `category` | Suite category |
| `repo` | Upstream GitHub repository (source of truth) |
| `description` / `descriptionEn` | Bilingual one-line descriptions |

CI validates: exactly four plugins, no duplicate names/keys, all required
fields present, `repo` is an https GitHub URL.

## Install flow

1. `dsh plugin --profile <profile> add <package>` (official CLI).
2. If the installed package declares `dsh.bundle.patch` (currently only
   `dsh-plugin-marketplace`) → the reconcile step already registered it in
   `dsh.profile.bundles`; the bundle layer auto-mounts it. **No patch edit.**
3. Otherwise (plain dependency) → append a mount row to the profile's
   `cordis.patch.yml`:
   - idempotent (scans for `name: '<pkg>'`);
   - an empty `[]` patch (optionally after comment lines) is **replaced**
     with a block-style `- insert:` list — appending after `[]` would create
     two top-level YAML documents and crash boot;
   - a non-empty flow-style array is **refused** with a manual-mount message;
   - a package already in `dsh.profile.bundles` is skipped.
4. `update` maps to `dsh plugin --profile <profile> update <package>`, then
   re-runs the idempotent mount check.

## Safety rules

- **No shell string concatenation.** Every subprocess is spawned with an
  argument array; on Windows the `.cmd` shim is executed with Node's
  per-argument quoting (`shell: true` + args array, never a joined command
  string).
- **No secrets.** The CLI never reads, prints, or forwards API keys; it does
  not touch environment secrets or the credentials store.
- **No swallowed failures.** Each plugin's install/update reports its own
  `✓`/`✗`; failures are collected, summarized, and reflected in the exit code
  (non-zero on any failure). Partial state is never hidden.
- **`--dry-run`** prints the exact commands and patch edits without executing.

## Doctor checks

- Node version ≥ `22.18` (suite-wide requirement inherited from
  `dsh-tdai-memory`).
- `dsh` CLI present on `PATH` (override with `DSH_ENHANCE_DSH_BIN`).
- Target profile directory exists.
- Per plugin: installed version, mount state (bundles / patch / own bundle
  layer).

## Versioning and release

- Suite version follows semver; the README badges query npm **live** for the
  four plugins, so version numbers are never hard-coded.
- npm publishing is intentionally not automated yet; CI only syntax-checks the
  CLI, validates the manifest, and optionally cross-checks npm availability
  (network failures are informational, `continue-on-error`).
