# DeepSeek Harness Enhancement Suite

[![English](https://img.shields.io/badge/English-blue)](README.md) [![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE) [![Node](https://img.shields.io/badge/node-%3E%3D22.18-green)](package.json)

**Vision · Soul / Persona · Long-term Memory · Plugin Marketplace**

四个 Scorp1o117 插件的官方总入口和一键安装套件，为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）增强能力。这是一个真正可用的一键安装器，而不是链接合集：它驱动官方 `dsh plugin` CLI、自动处理挂载、并检查结果。

0.1.3 已针对 DSH `0.1.1-rc.1` 验证，并会明确识别 pnpm 原生依赖构建策略导致的安装失败。

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
dsh-enhance install                       把四个插件安装进 profile
dsh-enhance update                        更新已安装插件到最新版本
dsh-enhance doctor                        检查 Node、dsh CLI、profile 与各插件状态

  --profile <name>     目标 profile（默认：web）
  --only <keys>        逗号分隔的选择：vision,soul,memory,marketplace（或包名）
  --dry-run            只打印将要执行的操作，不实际执行
```

示例：

```bash
dsh-enhance install --dry-run                    # 预览全部操作
dsh-enhance install --profile web --only vision,soul
dsh-enhance update --profile headless
```

## 安装方式

1. 每个插件都通过**官方 CLI** 安装：`dsh plugin --profile <profile> add <package>`。本套件绝不通过自身的依赖图或自己的 cordis patch 间接加载插件——四个 upstream 包在 profile 中保持独立。
2. `dsh-plugin-marketplace` 声明了 `dsh.bundle.patch`，`dsh plugin add` 会把它对账进 `dsh.profile.bundles`，由 bundle 层自动挂载。
3. 其余三个是普通依赖；套件用与 marketplace 一键安装相同的安全、幂等逻辑，把挂载行追加到 profile 的 `cordis.patch.yml`（空 `[]` 补丁会被正确替换、重复挂载会被跳过、流式数组会被拒绝而不是损坏）。
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
