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

## 2026-10-24: 0.3.4, DSH 0.2.1-rc.3

- Full npm test passed in fresh dependencies resolving dsh-plugin-marketplace 0.5.6 (rc.3 peers) with @deepseek-ai/dsh-settings 0.2.1-rc.3: 3 Node test-runner cases plus script assertions, with no failed or skipped cases.
- Official CLI installed the packed suite in an isolated Web profile built from the shipped web template. Configuration composition, service startup and authenticated HTTP 200 passed.
- engines.dsh and every DSH peer range accept 0.2.0-rc.2, 0.2.1-rc.1, 0.2.1-rc.2 and 0.2.1-rc.3, while unverified alpha releases remain excluded.
- Source comparison of dsh-v0.2.1-rc.2...dsh-v0.2.1-rc.3 found no change to the tool, system-prompt, settings or pi-ai interfaces used by these plugins. The removed ctx.layout.entryVisibility and agentPresetNavigation APIs were not in use.
- This verification covers Web. The Desktop application was not exercised. No real-model generation was requested.

## 2026-10-31: DSH 0.2.1-rc.4 / rc.5 (local, unreleased)

- `npm test` passed. The suite test tree still resolves its existing marketplace dependency against DSH rc.3; the real-host checks below use rc.4 and rc.5.
- Local package tarballs for all seven plugins installed into separate isolated Web profiles built from the official rc.4 and rc.5 templates. Each host started, served the authenticated Web UI, and showed all seven plugin pages as running without browser page exceptions.
- DSH rc.3→rc.5 source comparison found a changed reasoning Body slot, which these plugins do not use. DSH compatibility and SDK peer ranges accept rc.4 and rc.5 while retaining prior declared versions; 0.2.2-alpha.2 is not claimed.
- The suite still resolves the published marketplace 0.5.6 as a nested dependency; its management implementation matches this local marketplace source, but its published peer metadata does not include rc.4/rc.5. Publish the updated marketplace first and raise the suite dependency minimum when preparing a release.
- Native Desktop, external model calls, publication, and deployment were not exercised.

## 2026-10-31: v0.3.5 release candidate

- The suite dependency minimum is updated to marketplace 0.5.7. A clean test tree using the local marketplace 0.5.7 package and DSH settings rc.5 passed `npm test` and `npm run check`.
- After marketplace 0.5.7 became available on npm, a fresh registry lock and installed dependency tree resolved both marketplace and DSH settings/llm rc.5 without peer conflicts; `npm test` and `npm run check` passed again.
- The earlier rc.4/rc.5 host checks used the prior suite package; native Desktop was not tested.
- All seven final versioned package tarballs were then installed together in a fresh rc.5 Web profile. Their configuration pages reported running, the Soul selector switch was hidden and restored, and the browser reported no page exceptions.
