# Enhancement suite architecture

The suite has two entry points: a DSH bundle with a configuration page, and the standalone dsh-enhance CLI. plugins.json owns the six-plugin registry, including dsh-motion-ui.

The Host bundle registers enhancement-suite with the same management schema and request consumer exported by dsh-plugin-marketplace/management. It passes the six package names as the allowed batch selection. The browser uses configForms to submit revision-checked requests. The suite does not mount the marketplace Host itself; installing the marketplace as a profile dependency gives it its own independent bundle entry.

The shared engine discovers the active profile from profileContext and settings.documentPath. Desktop subprocesses use the packaged dsh-desktop-host CLI under Electron Node mode, which carries Desktop profile authorization and bundled pnpm. Web subprocesses use their active dsh CLI. A process-wide profile queue serializes suite and marketplace package operations, including when module copies differ.

Install and update invoke the official CLI with add package@latest. DSH reconciles bundle registrations. Uninstall invokes remove and structurally removes legacy manual YAML mounts and their configuration patches. Inventory reads direct profile dependencies plus built-in bundle names; built-ins remain managed by DSH. Progress, completion and errors use the plugin settings namespace outside HMR transactions. A failed batch reports partial installed state.

The CLI retains list/install/update/doctor and --only/--profile/--dry-run. Windows Desktop installations shadowed by a global Web CLI can set DSH_ENHANCE_DESKTOP_EXECUTABLE to select the packaged carrier explicitly. The UI always uses the active Host carrier. Package changes require restarting DSH.
