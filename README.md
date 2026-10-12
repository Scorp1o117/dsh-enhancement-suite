# DeepSeek Harness Enhancement Suite

Install and update **Vision, Soul / Persona, Memory, Marketplace, Reasoning Options and Motion UI** from a DSH plugin configuration page or the dsh-enhance CLI. Version 0.3.1 requires DSH 0.2.0-rc.2 or later 0.2.x and Node >=22.19.

## Desktop and Web configuration page

Use the Desktop-provided dsh command (Application → Manage dsh Command):

```sh
dsh plugin --profile desktop add dsh-enhancement-suite@0.3.1
```

Use --profile web for Web. Restart DSH and open **Plugins → Installed → dsh-enhancement-suite**. Choose **Install all**, **Update installed plugins**, or an individual install/update button. Motion UI is included as dsh-motion-ui. The page displays installed versions, operation progress and errors. All operations target the active Host's profile and use its official CLI; no API credentials are needed. Updating installed plugins skips missing plugins; Install all installs or updates all six. Restart DSH afterwards.

The suite shares the marketplace's operation engine without mounting a duplicate marketplace plugin. Installing all adds the marketplace as its own independent bundle. Use the marketplace configuration page for uninstall and management of other installed plugins. Built-in DSH bundles are protected.

## CLI

```sh
npx dsh-enhancement-suite list --profile desktop
npx dsh-enhancement-suite install --profile desktop
npx dsh-enhancement-suite update --profile desktop --only motion,reasoning
```

On Desktop, the dsh command on PATH must be installed by Desktop. If another global CLI shadows it on Windows, set DSH_ENHANCE_DESKTOP_EXECUTABLE to the absolute DeepSeek Harness.exe path before running dsh-enhance; this uses Desktop's bundled CLI and pnpm. --dry-run previews operations. --only accepts short keys or package names. Individual plugins remain independently maintained and are installed directly into the profile.

## Validation

npm run check validates syntax, the six-plugin registry and CLI help/list. npm test validates the bundle, configuration page and CLI selection.
