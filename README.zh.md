# DeepSeek Harness Enhancement Suite

在 DSH 插件配置页或 dsh-enhance 命令行中安装、更新 **视觉、Soul / Persona、长期记忆、插件市场、推理强度、Motion UI** 六个插件。0.3.1 需要 DSH 0.2.0-rc.2 或后续 0.2.x，以及 Node >=22.19。

## Desktop / Web 配置页

使用 Desktop 提供的 dsh 命令（应用 → 管理 dsh 命令）：

```sh
dsh plugin --profile desktop add dsh-enhancement-suite@0.3.1
```

Web 使用 --profile web。重启后打开 **插件 → 已安装 → dsh-enhancement-suite**，可一键安装全部、一键更新已安装插件，或单独安装/更新。Motion UI 对应 dsh-motion-ui。页面展示真实安装版本、进度和错误，不需要 API 密钥。更新已安装插件会跳过未安装项；安装全部则安装或更新全部六项。完成后重启 DSH。

套件共用插件市场的操作后端，不重复挂载市场插件。一键安装全部后，市场作为独立 bundle 挂载。卸载插件和管理套件之外的插件，请使用插件市场配置页。内置 DSH bundle 由 DSH 自身管理。

## 命令行

```sh
npx dsh-enhancement-suite list --profile desktop
npx dsh-enhancement-suite install --profile desktop
npx dsh-enhancement-suite update --profile desktop --only motion,reasoning
```

Desktop 的 PATH 命令应通过 Desktop 安装。如果被全局 Web CLI 遮挡，Windows 可设置 DSH_ENHANCE_DESKTOP_EXECUTABLE 为 DeepSeek Harness.exe 的绝对路径，命令行会调用 Desktop 自带 CLI 和 pnpm。--dry-run 预览操作；--only 支持短名称和完整包名。各插件保持独立维护并直接安装到 Profile。

npm run check 验证语法、六插件清单和 CLI help/list；npm test 验证 bundle、配置页和命令行选择。
