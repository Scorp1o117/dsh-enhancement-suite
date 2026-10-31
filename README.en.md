# DeepSeek Harness Enhancement Suite

[简体中文](README.md) | English

Install and update six enhancements for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) from one plugin page or the `dsh-enhance` CLI. Each plugin can also be installed and maintained independently.

## Included plugins

| Plugin | Purpose | CLI key |
| --- | --- | --- |
| [dsh-tool-vision](https://github.com/Scorp1o117/dsh-tool-vision) | Vision endpoint, image bridge and image tools | `vision` |
| [dsh-soul-md](https://github.com/Scorp1o117/dsh-soul-md) | Persona cards, session / workspace personas and file-based memory | `soul` |
| [dsh-tdai-memory](https://github.com/Scorp1o117/dsh-tdai-memory) | Layered long-term memory, extraction and recall | `memory` |
| [dsh-plugin-marketplace](https://github.com/Scorp1o117/dsh-plugin-marketplace) | Discover, install and manage plugins | `marketplace` |
| [dsh-reasoning-options](https://github.com/Scorp1o117/dsh-reasoning-options) | OpenCode session headers, provider defaults and opt-in reasoning levels | `reasoning` |
| [dsh-motion-ui](https://github.com/Scorp1o117/dsh-motion-ui) | Interactive interfaces, diagrams, animation and local video production | `motion` |

The suite is an installer and does not merge these projects into a single plugin. See each plugin for its features, model connections and runtime dependencies.

## Compatibility

- DSH Web and Desktop. The suite declares support for `0.2.0-rc.2`, `0.2.1-rc.1` / `rc.2` / `rc.3` / `rc.4` / `rc.5`, and versions matching `>=0.2.0-rc.2 <0.3.0`. See [package.json](package.json) for the complete prerelease range.
- The suite requires Node.js `>=22.19`. Individual plugins can have different requirements; in particular, Motion UI explicitly lists its supported DSH versions.

## Installation and use

For Desktop, first install its `dsh` command using **Application → Manage dsh Command**, then run:

```sh
dsh plugin --profile desktop add dsh-enhancement-suite
```

For Web, replace `desktop` with `web`. Restart DSH and open **Plugins → Installed → dsh-enhancement-suite**:

1. Choose **Install all**, or install only the plugins you need.
2. **Update installed plugins** skips plugins that are not installed.
3. Check progress, actual installed versions and errors; restart DSH after changes.

The suite shares its operations engine with the marketplace without mounting a duplicate. Install all adds the marketplace as an independent plugin. Use the marketplace to uninstall or manage other plugins. Built-in DSH bundles remain managed by the host.

### Command line

```sh
# List the registry and installation state for the Desktop profile
npx dsh-enhancement-suite list --profile desktop

# Preview, then install all
npx dsh-enhancement-suite install --profile desktop --dry-run
npx dsh-enhancement-suite install --profile desktop

# Update only the installed Motion UI and Reasoning Options plugins
npx dsh-enhancement-suite update --profile desktop --only motion,reasoning
```

`--only` accepts comma-separated keys or package names. The default profile is `web`. Desktop users should use the command installed by the Desktop app. If a global Web CLI shadows it on Windows, set `DSH_ENHANCE_DESKTOP_EXECUTABLE` to the absolute path of `DeepSeek Harness.exe`.

## Development and feedback

- `npm run check` checks syntax, the plugin registry and CLI; `npm test` runs the suite tests.
- [Plugin registry](plugins.json) · [Architecture](docs/architecture.md) · [Issues](https://github.com/Scorp1o117/dsh-enhancement-suite/issues) · [npm](https://www.npmjs.com/package/dsh-enhancement-suite)
- [MIT License](LICENSE)
