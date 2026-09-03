# DeepSeek Harness Enhancement Suite

[![English](https://img.shields.io/badge/English-blue)](README.md) [![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE) [![Node](https://img.shields.io/badge/node-%3E%3D22.18-green)](package.json)

**Vision · Soul / Persona · Long-term Memory · Plugin Marketplace · Reasoning Options**

Scorp1o117 DSH 插件（增强 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)）的官方总入口和一键安装套件。这是一个真正可用的一键安装器，而不是链接合集：它驱动官方 `dsh plugin` CLI、自动处理挂载、并检查结果。

从 `0.1.4` 起最低支持 DSH `0.1.0-rc.7`，已针对 `0.1.0-rc.7`、
`0.1.0-rc.8` 和 `0.1.1-rc.1` 验证，并会明确识别 pnpm 原生依赖构建策略导致的安装失败。

仍使用 DSH `0.1.0-rc.6` 的用户请直接安装最后兼容的插件版本：
`dsh-tool-vision@0.6.1`、`dsh-soul-md@0.5.6`、`dsh-tdai-memory@0.2.11`
和 `dsh-plugin-marketplace@0.2.6`。不要在 rc.6 上使用套件不锁版本的 `install`
命令，因为它会按设计安装当前最新版。`dsh-reasoning-options` 要求 DSH
`0.1.0-rc.7` 或更高（没有 rc.6 兼容版本）。

> **本仓库不复制、不替代任何独立插件。**
> **每个插件都在各自的 upstream 仓库独立维护。**

---

## 👁️ dsh-tool-vision

给文本模型增加视觉能力和图片桥接。

[![npm](https://img.shields.io/npm/v/dsh-tool-vision)](https://www.npmjs.com/package/dsh-tool-vision) [![license](https://img.shields.io/npm/l/dsh-tool-vision)](https://github.com/Scorp1o117/dsh-tool-vision/blob/main/LICENSE)

[→ upstream 仓库](https://github.com/Scorp1o117/dsh-tool-vision)

## 🎭 dsh-soul-md

为 Agent 增加 soul.md 人设、会话/工作区 Persona 和可演化人格。

[![npm](https://img.shields.io/npm/v/dsh-soul-md)](https://www.npmjs.com/package/dsh-soul-md) [![license](https://img.shields.io/npm/l/dsh-soul-md)](https://github.com/Scorp1o117/dsh-soul-md/blob/main/LICENSE)

[→ upstream 仓库](https://github.com/Scorp1o117/dsh-soul-md)

## 🧠 dsh-tdai-memory

完整的长期分层记忆、召回与搜索。

[![npm](https://img.shields.io/npm/v/dsh-tdai-memory)](https://www.npmjs.com/package/dsh-tdai-memory) [![license](https://img.shields.io/npm/l/dsh-tdai-memory)](https://github.com/Scorp1o117/dsh-tdai-memory/blob/main/LICENSE)

[→ upstream 仓库](https://github.com/Scorp1o117/dsh-tdai-memory)

## 🛒 dsh-plugin-marketplace

直接在 DSH Web UI 中发现和浏览插件。

[![npm](https://img.shields.io/npm/v/dsh-plugin-marketplace)](https://www.npmjs.com/package/dsh-plugin-marketplace) [![license](https://img.shields.io/npm/l/dsh-plugin-marketplace)](https://github.com/Scorp1o117/dsh-plugin-marketplace/blob/main/LICENSE)

[→ upstream 仓库](https://github.com/Scorp1o117/dsh-plugin-marketplace)

## 🎚️ dsh-reasoning-options

为所有第三方（pi-ai）模型自动添加推理强度选项（off → max 七档，默认 high）。

[![npm](https://img.shields.io/npm/v/dsh-reasoning-options)](https://www.npmjs.com/package/dsh-reasoning-options) [![license](https://img.shields.io/npm/l/dsh-reasoning-options)](https://github.com/Scorp1o117/dsh-reasoning-options/blob/main/LICENSE)

[→ upstream 仓库](https://github.com/Scorp1o117/dsh-reasoning-options)

---

## 环境要求

- **Node.js >= 22.18** —— 完整套件继承 `dsh-tdai-memory` 的引擎要求
- **dsh CLI** 在 `PATH` 上 —— 安装机制是官方 CLI：`dsh plugin --profile <p> add <pkg>`
- 目标 profile（默认：`web`）

## 安装与使用

从本仓库直接运行（无需安装）：

```bash
node bin/dsh-enhance.mjs list
node bin/dsh-enhance.mjs install --dry-run
node bin/dsh-enhance.mjs install
node bin/dsh-enhance.mjs doctor
```

发布到 npm 后作为全局命令使用：

```bash
npm install -g dsh-enhancement-suite
dsh-enhance list
dsh-enhance install
```

## CLI

```
dsh-enhance list                          查看插件清单（含 profile 内的安装状态）
dsh-enhance install                       把全部插件安装进 profile
dsh-enhance update                        更新已安装插件到最新版本
dsh-enhance doctor                        检查 Node、dsh CLI、profile 与各插件状态

  --profile <name>     目标 profile（默认：web）
  --only <keys>        逗号分隔的选择：vision,soul,memory,marketplace,reasoning（或包名）
  --dry-run            只打印将要执行的操作，不实际执行
```

示例：

```bash
dsh-enhance install --dry-run                    # 预览全部操作
dsh-enhance install --profile web --only vision,soul
dsh-enhance update --profile headless
```

## 安装方式

1. 每个插件都通过**官方 CLI** 安装：`dsh plugin --profile <profile> add <package>`。本套件绝不通过自身的依赖图或自己的 cordis patch 间接加载插件——各 upstream 包在 profile 中保持独立。
2. 所有插件都声明了 `dsh.bundle.patch`（vision 0.3.9 / soul-md 0.5.4 / tdai-memory 0.2.9 / marketplace 0.2.4 / reasoning-options 0.1.0 起），`dsh plugin add` 会把它对账进 `dsh.profile.bundles`，由各自的 bundle 层自动挂载。
3. 对于在获得 bundle 声明前就已手动挂载的插件，套件会**移除 cordis.patch.yml 里的过期手动行**——同一 entry id 挂两次会启动失败。（非 bundle 第三方插件仍会用安全、幂等的挂载逻辑处理：空 `[]` 补丁会被正确替换、重复挂载会被跳过、流式数组会被拒绝而不是损坏。）
4. 重启 `dsh web` 即可加载。

每一步都有清晰的 `✓` / `✗` 反馈，失败绝不吞掉，且不读取、不打印任何 API Key。

## 集成 / 采用

以下插件已被 **Deepseek Harness EAC** 桌面客户端内置采用：

- 👁️ `dsh-tool-vision`
- 🎭 `dsh-soul-md`
- 🧠 `dsh-tdai-memory`

[Deepseek-Harness-EAC](https://github.com/zouyuxuan122/Deepseek-Harness-EAC)

> 注意：EAC 内置的 marketplace 实现是另一个项目，并没有使用 `dsh-plugin-marketplace`。

## 文档

- [架构说明](docs/architecture.md) —— 设计决策、manifest 结构、安全规则
- [plugins.json](plugins.json) —— 插件 manifest（npm 包名、仓库、分类、显示名、描述）

## License

MIT —— 见 [LICENSE](LICENSE)。各插件在各自 upstream 仓库保留独立的 MIT License。
