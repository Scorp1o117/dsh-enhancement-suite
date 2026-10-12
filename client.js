window.__ModuleLoader__.load({
  id: "dsh-enhancement-suite",
  factory: function (require) {
    var react = require("react"), h = react.createElement;
    var zh = {
      title: "增强套件", intro: "在当前 Profile 安装和更新六个增强插件。完成后请重启 DSH。",
      installAll: "一键安装全部", updateAll: "一键更新已安装插件", refresh: "刷新列表",
      install: "安装", update: "更新", missing: "未安装", busy: "正在处理…", ok: "操作完成，请重启 DSH", error: "操作失败", unavailable: "配置未加载", hostTimeout: "宿主尚未确认请求，请检查插件是否启用。",
    };
    var en = {
      title: "Enhancement Suite", intro: "Install and update six enhancement plugins in the current profile. Restart DSH afterwards.",
      installAll: "Install all", updateAll: "Update installed plugins", refresh: "Refresh list",
      install: "Install", update: "Update", missing: "Not installed", busy: "Working…", ok: "Completed; restart DSH", error: "Operation failed", unavailable: "Configuration is not loaded", hostTimeout: "The host has not acknowledged the request; check that the plugin is enabled.",
    };
    var plugins = [
      ["dsh-tool-vision", "Vision"], ["dsh-soul-md", "Soul / Persona"], ["dsh-tdai-memory", "Memory"],
      ["dsh-plugin-marketplace", "Marketplace"], ["dsh-reasoning-options", "Reasoning"], ["dsh-motion-ui", "Motion UI"],
    ];
    function SuitePage(props) {
      var scope = props.scope, t = props.t;
      var [snapshot, setSnapshot] = react.useState(function () { return scope.getSnapshot(); });
      var [sending, setSending] = react.useState(false);
      var [error, setError] = react.useState("");
      var refreshLocale = react.useState(0)[1];
      react.useEffect(function () { return props.locale.subscribe(function () { refreshLocale(function (v) { return v + 1; }); }); }, [props.locale]);
      react.useEffect(function () { setSnapshot(scope.getSnapshot()); return scope.subscribe(function () { setSnapshot(scope.getSnapshot()); }); }, [scope]);
      var channel = snapshot.status === "ready" ? snapshot.value : {};
      var request = channel.install || {}, state = channel.installState || {};
      react.useEffect(function () {
        if (!request.ts) return;
        var timer = setTimeout(function () { setError("hostTimeout"); }, 15000);
        return function () { clearTimeout(timer); };
      }, [request.ts]);
      if (snapshot.status !== "ready") return h("p", null, t("unavailable"));
      var busy = sending || Boolean(request.ts) || state.status === "running";
      function run(pkg, action) {
        if (busy || !snapshot.writable) return;
        setSending(true); setError("");
        var value = { pkg: pkg, action: action, ts: Date.now() };
        Promise.resolve().then(function () { return scope.mutate([{ op: "set", path: ["install"], value: value }], snapshot.revision); }).then(function (accepted) {
          setSnapshot(scope.getSnapshot());
          if (!accepted) setError("error");
        }).catch(function () { setError("error"); }).finally(function () { setSending(false); });
      }
      var rows = channel.inventory && channel.inventory.packages || [];
      var button = function (label, pkg, action) { return h("button", { type: "button", disabled: busy || !snapshot.writable, onClick: function () { run(pkg, action); }, style: { padding: "8px 12px", borderRadius: 6, cursor: "pointer", font: "inherit" } }, t(label)); };
      return h("section", { style: { maxWidth: 720, display: "flex", flexDirection: "column", gap: 16, fontSize: 13, color: "var(--dsw-alias-label-primary)" } },
        h("h3", { style: { margin: 0 } }, t("title") + " · " + (channel.inventory?.profile || "")),
        h("p", { style: { margin: 0 } }, t("intro")),
        h("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, button("installAll", "~suite", "suite-install"), button("updateAll", "~suite", "suite-update"), button("refresh", "~refresh", "refresh")),
        plugins.map(function (plugin) {
          var installed = rows.find(function (row) { return row.name === plugin[0]; });
          return h("div", { key: plugin[0], style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", padding: "12px 0", borderBottom: "1px solid var(--dsw-alias-border-l2)" } },
            h("span", { style: { flex: "1 1 250px", overflowWrap: "anywhere" } }, plugin[0] + " · " + (installed?.version || t("missing"))), button(installed ? "update" : "install", plugin[0], installed ? "update" : "install"));
        }),
        error ? h("p", { role: "alert" }, t(error)) : null,
        busy ? h("p", { role: "status" }, t("busy")) : state.status === "error" ? h("p", { role: "alert" }, t("error") + ": " + state.message) : state.status === "ok" ? h("p", { role: "status" }, t("ok")) : null);
    }
    return {
      inject: ["slots", "locale", "configForms"],
      apply: function (ctx) {
        ctx.effect(function () { return ctx.locale.register("enhancementSuite", { zh: zh, en: en }); });
        var scope = ctx.configForms.get("enhancement-suite"), t = ctx.locale.bind("enhancementSuite");
        ctx.slots.inject("plugins.bundle.config", function () {
          return ctx.slots.register({ name: "plugins.bundle.config", key: "dsh-enhancement-suite", locale: "enhancementSuite" }, function (props) {
            return h(SuitePage, Object.assign({}, props, { scope: scope, t: t, locale: ctx.locale }));
          });
        });
      },
    };
  },
});
