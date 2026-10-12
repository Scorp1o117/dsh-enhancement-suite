import z from "@deepseek-ai/schemastery";
import { readFileSync } from "node:fs";
import { managementFields, installManagement } from "dsh-plugin-marketplace/management";

export const name = "enhancement-suite";
export const inject = ["settings", "profileContext"];
export const Config = z.object(managementFields).volatile();
const manifest = JSON.parse(readFileSync(new URL("./plugins.json", import.meta.url), "utf8"));

/** Mount the same Desktop-aware operation engine used by the marketplace. */
export function apply(ctx, config) {
  installManagement(ctx, config, name, { packages: manifest.plugins.map(plugin => plugin.name) });
}
