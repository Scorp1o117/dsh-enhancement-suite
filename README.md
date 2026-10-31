# DeepSeek Harness Enhancement Suite

简体中文 | [English](README.en.md)

在 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 中集中安装和更新六款增强插件。通过插件配置页操作，也可以使用 `dsh-enhance` 命令行；各插件仍可独立安装和维护。

## 包含哪些插件？

| 插件 | 用途 | CLI 短名称 |
| --- | --- | --- |
| [dsh-tool-vision](https://github.com/Scorp1o117/dsh-tool-vision) | 视觉模型接入、图片桥接和图像工具 | `vision` |
| [dsh-soul-md](https://github.com/Scorp1o117/dsh-soul-md) | 人设卡、会话 / 工作区人设与文件记忆 | `soul` |
| [dsh-tdai-memory](https://github.com/Scorp1o117/dsh-tdai-memory) | 分层长期记忆、提取与召回 | `memory` |
| [dsh-plugin-marketplace](https://github.com/Scorp1o117/dsh-plugin-marketplace) | 发现、安装和管理插件 | `marketplace` |
| [dsh-reasoning-options](https://github.com/Scorp1o117/dsh-reasoning-options) | OpenCode 会话头、路由默认值与可选推理档位补齐 | `reasoning` |
| [dsh-motion-ui](https://github.com/Scorp1o117/dsh-motion-ui) | 交互界面、图解、动画与本地视频制作 | `motion` |

套件本身是安装入口，并不把六个插件的源码合并为一个插件。各插件的能力、模型连接和运行依赖见各自文档。

## 兼容性

- 支持 DSH Web 与 Desktop。套件声明兼容 `0.2.0-rc.2`、`0.2.1-rc.1` / `rc.2` / `rc.3` / `rc.4` / `rc.5` 以及符合 `>=0.2.0-rc.2 <0.3.0` 的版本；预发布版本的完整匹配规则见 [package.json](package.json)。
- 套件要求 Node.js `>=22.19`。各插件的要求可能不同，尤其是 Motion UI 的 DSH 兼容范围是明确列出的版本。

## 安装与使用

Desktop 请先在 **应用 → 管理 dsh 命令** 中安装桌面版提供的命令，然后执行：

```sh
dsh plugin --profile desktop add dsh-enhancement-suite
```

Web 用户将 `desktop` 改为 `web`。安装后重启 DSH，打开 **插件 → 已安装 → dsh-enhancement-suite**：

1. 选择**安装全部**，或只安装需要的插件。
2. **更新已安装插件**只更新已安装项；未安装项会跳过。
3. 查看进度、实际安装版本和错误；操作完成后重启 DSH。

套件和插件市场共用操作后端，不会重复挂载市场；安装全部时，市场会作为独立插件安装。卸载或管理套件之外的插件可使用插件市场。DSH 内置 bundle 由宿主管理。

### 命令行

```sh
# 查看清单和 Desktop Profile 的安装状态
npx dsh-enhancement-suite list --profile desktop

# 预览操作，再安装全部
npx dsh-enhancement-suite install --profile desktop --dry-run
npx dsh-enhancement-suite install --profile desktop

# 仅更新已安装的 Motion UI 和 Reasoning Options
npx dsh-enhancement-suite update --profile desktop --only motion,reasoning
```

`--only` 支持逗号分隔的短名称或完整包名；不指定 Profile 时默认为 `web`。Desktop 请使用桌面应用提供的 `dsh` 命令。如果 Windows 上的全局 Web CLI 遮挡了它，可将环境变量 `DSH_ENHANCE_DESKTOP_EXECUTABLE` 设为 `DeepSeek Harness.exe` 的绝对路径。

## 开发与反馈

- `npm run check` 检查语法、插件清单和 CLI；`npm test` 运行套件测试。
- [插件清单](plugins.json) · [架构说明](docs/architecture.md) · [问题反馈](https://github.com/Scorp1o117/dsh-enhancement-suite/issues) · [npm](https://www.npmjs.com/package/dsh-enhancement-suite)
- [MIT License](LICENSE)
