# v0.3.1 validation — 2026-10-12

- npm run check and npm test passed (3 tests).
- Six-plugin registry includes dsh-motion-ui; suite page submits revision-checked batch requests and follows DSH locale.
- Packed suite started on the installed Desktop 0.2.0-rc.2 runtime in an isolated profile alongside the marketplace without duplicate mounts.
- Browser showed all six plugin rows and one-click install/update controls. Refresh completed through the actual Host settings channel.
- The shared engine's real Desktop install/update/uninstall path was exercised by the marketplace smoke; batch selection and serialization are covered by engine tests.

- The real shared backend completed installation of all six plugins and updated an explicitly pinned reasoning package from 0.4.1 to 0.5.0. Minimum backend is marketplace 0.5.2 to include bounded subprocess cleanup.

## 2026-10-17: 0.3.2, DSH 0.2.1-rc.1

- Full npm test command passed in a fresh npm dependency tree using the published DSH 0.2.1-rc.1 packages (3 Node test-runner cases, plus any script assertions). No skipped test-runner cases.
- Packed package installed with the official DSH CLI into an isolated Web profile. Configuration composition succeeded; the Web service started and authenticated HTTP returned 200. All six plugin bundles appeared enabled in the running UI.
- engines.dsh and every DSH peer range accept 0.2.0-rc.2 and 0.2.1-rc.1; unverified 0.2.1 alpha releases remain excluded.
- Reasoning page was opened, left, reopened, edited, saved, and refreshed. The saved value persisted and automatic reasoning augmentation remained off. Backend regressions cover repeated reconciliation after native removal, explicit opt-in, preserved custom declarations, and gateway-only writes.
- New packaged Desktop 0.2.1 was not exercised; these results verify Web. Motion UI was excluded from the adaptation.

## 2026-10-17: 0.3.3, DSH 0.2.1-rc.2

- Full npm test passed in fresh dependencies using published DSH 0.2.1-rc.2 packages: 3 Node test-runner cases plus script assertions, with no failed or skipped cases.
- Official CLI installed the packed plugins in an isolated Web profile. Configuration composition, service startup and authenticated HTTP 200 passed.
- engines.dsh and DSH peer ranges accept 0.2.0-rc.2, 0.2.1-rc.1 and 0.2.1-rc.2, while unverified alpha releases remain excluded.
- Source comparison found no change to the tool, system-prompt, settings or pi-ai interfaces used by these plugins. Native reasoning settings retain the opt-in augmentation policy.
- This verification covers Web. Motion UI and the Desktop application are handled separately. No real-model generation was requested.
