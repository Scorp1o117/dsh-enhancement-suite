# DeepSeek Harness Enhancement Suite

[![中文文档](https://img.shields.io/badge/%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3-blue)](README.zh.md) [![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE) [![Node](https://img.shields.io/badge/node-%3E%3D22.18-green)](package.json)

**Vision · Soul / Persona · Long-term Memory · Plugin Marketplace**

The official entry point and one-command installer for the four Scorp1o117 plugins that enhance [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH). This suite is a real installer — not a link collection: it drives the official `dsh plugin` CLI, mounts what needs mounting, and checks the result.

> **This repository does not vendor or replace the individual plugins.**
> **Each plugin remains independently maintained in its own upstream repository.**

---

## 👁️ dsh-tool-vision

给文本模型增加视觉能力和图片桥接。

[![npm](https://img.shields.io/npm/v/dsh-tool-vision)](https://www.npmjs.com/package/dsh-tool-vision) [![license](https://img.shields.io/npm/l/dsh-tool-vision)](https://github.com/Scorp1o117/dsh-tool-vision/blob/main/LICENSE)

[→ upstream repository](https://github.com/Scorp1o117/dsh-tool-vision)

## 🎭 dsh-soul-md

为 Agent 增加 soul.md 人设、会话/工作区 Persona 和可演化人格。

[![npm](https://img.shields.io/npm/v/dsh-soul-md)](https://www.npmjs.com/package/dsh-soul-md) [![license](https://img.shields.io/npm/l/dsh-soul-md)](https://github.com/Scorp1o117/dsh-soul-md/blob/main/LICENSE)

[→ upstream repository](https://github.com/Scorp1o117/dsh-soul-md)

## 🧠 dsh-tdai-memory

完整的长期分层记忆、召回与搜索。

[![npm](https://img.shields.io/npm/v/dsh-tdai-memory)](https://www.npmjs.com/package/dsh-tdai-memory) [![license](https://img.shields.io/npm/l/dsh-tdai-memory)](https://github.com/Scorp1o117/dsh-tdai-memory/blob/main/LICENSE)

[→ upstream repository](https://github.com/Scorp1o117/dsh-tdai-memory)

## 🛒 dsh-plugin-marketplace

直接在 DSH Web UI 中发现和浏览插件。

[![npm](https://img.shields.io/npm/v/dsh-plugin-marketplace)](https://www.npmjs.com/package/dsh-plugin-marketplace) [![license](https://img.shields.io/npm/l/dsh-plugin-marketplace)](https://github.com/Scorp1o117/dsh-plugin-marketplace/blob/main/LICENSE)

[→ upstream repository](https://github.com/Scorp1o117/dsh-plugin-marketplace)

---

## Requirements

- **Node.js >= 22.18** — the full suite inherits the `dsh-tdai-memory` engine requirement
- **dsh CLI** on `PATH` — the official DeepSeek Harness CLI (`dsh plugin --profile <p> add <pkg>` is the install mechanism)
- A target profile (default: `web`)

## Install & usage

From this repository (no install needed):

```bash
node bin/dsh-enhance.mjs list
node bin/dsh-enhance.mjs install --dry-run
node bin/dsh-enhance.mjs install
node bin/dsh-enhance.mjs doctor
```

As a global command (once published to npm):

```bash
npm install -g dsh-enhancement-suite
dsh-enhance list
dsh-enhance install
```

## CLI

```
dsh-enhance list                          Show the plugin registry (installed state per profile)
dsh-enhance install                       Install all four plugins into a profile
dsh-enhance update                        Update installed plugins to the latest versions
dsh-enhance doctor                        Check Node, dsh CLI, profile and per-plugin state

  --profile <name>     target profile (default: web)
  --only <keys>        comma-separated selection: vision,soul,memory,marketplace (or package names)
  --dry-run            print what would run without executing anything
```

Examples:

```bash
dsh-enhance install --dry-run                    # preview everything
dsh-enhance install --profile web --only vision,soul
dsh-enhance update --profile headless
```

## How it installs

1. Every plugin is installed through the **official CLI**: `dsh plugin --profile <profile> add <package>`. This suite never loads the plugins through its own dependency graph or its own cordis patch — the four upstream packages stay independent in the profile.
2. All four plugins now declare `dsh.bundle.patch` (as of vision 0.3.9 / soul-md 0.5.4 / tdai-memory 0.2.9 / marketplace 0.2.4), so `dsh plugin add` reconciles each into `dsh.profile.bundles` and its own bundle layer auto-mounts it.
3. For profiles that mounted a plugin manually before it gained its bundle manifest, the suite **removes the stale manual row** from `cordis.patch.yml` — two mounts of the same entry id would abort boot. (Non-bundle third-party plugins still get the safe idempotent mount logic: empty `[]` patches are replaced correctly, duplicates are skipped, flow-style arrays are refused instead of corrupted.)
4. Restart `dsh web` and the plugins load.

Every step reports a clear `✓` / `✗`, failures are never swallowed, and no API key is read, printed, or forwarded.

## Integration / Adoption

The following plugins are adopted and shipped built-in by the **Deepseek Harness EAC** desktop client:

- 👁️ `dsh-tool-vision`
- 🎭 `dsh-soul-md`
- 🧠 `dsh-tdai-memory`

[Deepseek-Harness-EAC](https://github.com/zouyuxuan122/Deepseek-Harness-EAC)

> Note: EAC's built-in marketplace implementation is a separate project; it does not use `dsh-plugin-marketplace`.

## Documentation

- [Architecture](docs/architecture.md) — design decisions, manifest schema, safety rules
- [plugins.json](plugins.json) — the plugin manifest (npm name, repo, category, display name, description)

## License

MIT — see [LICENSE](LICENSE). Each plugin keeps its own MIT license in its upstream repository.
