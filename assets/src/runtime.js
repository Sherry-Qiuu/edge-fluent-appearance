/* ==========================================================================
   Edge Fluent Appearance · runtime
   One script: injects the design system, resolves appearance, mounts the panel.
   ========================================================================== */

(function () {
  "use strict";

  if (window.EdgeTheme && window.EdgeTheme.version) {
    return;
  }

  var VERSION = "1.1.0";
  var STORAGE_DEFAULT = "edge-fluent-appearance:v1";
  var CSS = "__EDGE_CSS_PLACEHOLDER__";

  var THEMES = Object.freeze({
    color: Object.freeze([
      Object.freeze({ id: "azure", label: "湖蓝", en: "Azure" }),
      Object.freeze({ id: "sage", label: "鼠尾草", en: "Sage" }),
      Object.freeze({ id: "amber", label: "暖砂", en: "Amber" }),
      Object.freeze({ id: "rose", label: "玫瑰", en: "Rose" }),
      Object.freeze({ id: "iris", label: "鸢尾", en: "Iris" })
    ]),
    image: Object.freeze([
      Object.freeze({ id: "aurora", label: "极光", en: "Aurora" }),
      Object.freeze({ id: "dune", label: "沙丘", en: "Dune" }),
      Object.freeze({ id: "tide", label: "潮汐", en: "Tide" }),
      Object.freeze({ id: "bloom", label: "花期", en: "Bloom" }),
      Object.freeze({ id: "nocturne", label: "夜航", en: "Nocturne" }),
      Object.freeze({ id: "alpine", label: "高山", en: "Alpine" }),
      Object.freeze({ id: "forest", label: "雾林", en: "Forest" }),
      Object.freeze({ id: "coast", label: "海岸", en: "Coast" }),
      Object.freeze({ id: "meadow", label: "花野", en: "Meadow" }),
      Object.freeze({ id: "canyon", label: "峡谷", en: "Canyon" })
    ])
  });

  var COPY = {
    zh: {
      panelTitle: "外观",
      panelKicker: "EDGE FLUENT APPEARANCE",
      close: "关闭外观设置",
      open: "打开外观设置",
      appearance: "整体外观",
      appearanceHint: "跟随系统时，会随设备的深色模式自动切换。",
      theme: "主题",
      colorTab: "颜色主题",
      imageTab: "图像主题",
      system: "系统",
      light: "浅色",
      dark: "深色",
      none: "不使用",
      reset: "恢复默认值",
      saved: "自动保存到此浏览器",
      savedShort: "已保存",
      custom: "内置主题",
      builtIn: "5 个颜色 · 10 个图像",
      deep: "深色",
      following: "跟随系统",
      imageClear: "不使用图像主题",
      status: "外观已更新"
    },
    en: {
      panelTitle: "Appearance",
      panelKicker: "EDGE FLUENT APPEARANCE",
      close: "Close appearance settings",
      open: "Open appearance settings",
      appearance: "Overall appearance",
      appearanceHint: "System follows your device's dark mode automatically.",
      theme: "Theme",
      colorTab: "Color theme",
      imageTab: "Image theme",
      system: "System",
      light: "Light",
      dark: "Dark",
      none: "None",
      reset: "Reset to default",
      saved: "Saved in this browser",
      savedShort: "Saved",
      custom: "Built-in",
      builtIn: "5 colors · 10 images",
      deep: "Dark",
      following: "Following system",
      imageClear: "Remove image theme",
      status: "Appearance updated"
    }
  };

  var ICONS = {
    contrast:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.2"/><path d="M12 3.8a8.2 8.2 0 0 0 0 16.4Z" fill="currentColor" stroke="none"/></svg>',
    system:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.2" y="4.3" width="17.6" height="12.2" rx="1.8"/><path d="M9 20h6M12 16.5V20"/></svg>',
    light:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.1"/><path d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5"/></svg>',
    dark:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.1 14.3A8.4 8.4 0 0 1 9.7 3.9 8.5 8.5 0 1 0 20.1 14.3Z"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 6.8"/></svg>',
    palette:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.2a8.8 8.8 0 1 0 0 17.6c1.5 0 2.2-1 2.2-2.1 0-1.5-1.2-2-1.2-3.1 0-1 .8-1.7 2-1.7h1.8a4 4 0 0 0 4-4c0-3.7-3.9-6.7-8.8-6.7Z"/><circle cx="7.6" cy="10.1" r="1"/><circle cx="10.2" cy="6.8" r="1"/><circle cx="15" cy="7.2" r="1"/><circle cx="17.9" cy="10.4" r="1"/></svg>',
    image:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.2" y="4.5" width="17.6" height="15" rx="2"/><circle cx="8.3" cy="9.2" r="1.5"/><path d="m4.4 17.2 4.9-4.6a1.3 1.3 0 0 1 1.8 0l3.1 3 1.6-1.5a1.3 1.3 0 0 1 1.8 0l1.8 1.7"/></svg>',
    reset:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5v5h5"/><path d="M4.6 10a8 8 0 1 1 1 7.4"/></svg>',
    info:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><path d="M12 10.5v5.2M12 7.6v.2"/></svg>',
    spark:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7L4.5 11 10.1 9Z"/><path d="M18.6 16.4 19.4 19l2.6.8-2.6.8-.8 2.6-.8-2.6-2.6-.8 2.6-.8Z"/></svg>',
    save:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4.5h11l3 3v12H5Z"/><path d="M8.5 4.5v5h7v-5M8.5 19.5v-6h7v6"/></svg>'
  };

  function resolveScript() {
    if (document.currentScript) {
      return document.currentScript;
    }
    var scripts = document.querySelectorAll('script[src*="edge-theme"]');
    return scripts.length ? scripts[scripts.length - 1] : null;
  }

  var script = resolveScript();
  var data = (script && script.dataset) || {};

  function isFalse(value) {
    return value === "false" || value === "0" || value === "off";
  }

  function readConfig() {
    var lang = data.edgeLang || "zh";
    if (lang !== "zh" && lang !== "en") {
      lang = /^en\b/i.test(document.documentElement.lang || "") ? "en" : "zh";
    }
    return {
      appearance: data.edgeAppearance || "system",
      colorTheme: data.edgeColorTheme || "sage",
      imageTheme: data.edgeImageTheme || "none",
      panel: !isFalse(data.edgePanel),
      launcher: !isFalse(data.edgeLauncher),
      skin: data.edgeSkin === "none" ? "none" : "canvas",
      query: data.edgeQuery === "true",
      open: data.edgeOpen === "true",
      position: data.edgePosition === "bottom-left" ? "bottom-left" : "bottom-right",
      lang: lang,
      persist: !isFalse(data.edgePersist),
      injectCss: !isFalse(data.edgeInjectCss),
      storageKey: data.edgeStorageKey || STORAGE_DEFAULT
    };
  }

  var config = readConfig();
  var copy = COPY[config.lang];

  function isAppearance(value) {
    return value === "system" || value === "light" || value === "dark";
  }

  function isTheme(kind, value) {
    if (kind === "image" && value === "none") {
      return true;
    }
    return THEMES[kind].some(function (item) {
      return item.id === value;
    });
  }

  function labelFor(kind, id) {
    var list = THEMES[kind];
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === id) {
        return config.lang === "en" ? list[i].en : list[i].label;
      }
    }
    return id;
  }

  function readStored() {
    if (!config.persist) {
      return null;
    }
    try {
      var raw = window.localStorage.getItem(config.storageKey);
      if (!raw) {
        return null;
      }
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function writeStored(state) {
    if (!config.persist) {
      return;
    }
    try {
      window.localStorage.setItem(
        config.storageKey,
        JSON.stringify({
          appearance: state.appearance,
          colorTheme: state.colorTheme,
          imageTheme: state.imageTheme
        })
      );
    } catch (error) {
      /* Private mode, file://, or a blocked storage partition. */
    }
  }

  function clearStored() {
    if (!config.persist) {
      return;
    }
    try {
      window.localStorage.removeItem(config.storageKey);
    } catch (error) {
      /* no-op */
    }
  }

  function readQuery() {
    if (!config.query) {
      return {};
    }
    var params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (error) {
      return {};
    }
    return {
      appearance: params.get("edge_appearance") || params.get("appearance") || undefined,
      colorTheme: params.get("edge_color") || params.get("color") || undefined,
      imageTheme: params.get("edge_image") || params.get("image") || undefined,
      panel: params.get("edge_panel") || params.get("panel") || undefined
    };
  }

  function normalize(source) {
    return {
      appearance: isAppearance(source.appearance) ? source.appearance : "system",
      colorTheme: isTheme("color", source.colorTheme) ? source.colorTheme : "sage",
      imageTheme: isTheme("image", source.imageTheme) ? source.imageTheme : "none"
    };
  }

  var query = readQuery();
  var stored = readStored() || {};
  var baseState = normalize({
    appearance: config.appearance,
    colorTheme: config.colorTheme,
    imageTheme: config.imageTheme
  });
  var state = normalize({
    appearance: query.appearance || stored.appearance || baseState.appearance,
    colorTheme: query.colorTheme || stored.colorTheme || baseState.colorTheme,
    imageTheme: query.imageTheme || stored.imageTheme || baseState.imageTheme
  });

  var mql = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;
  var panelEl = null;
  var launcherEl = null;
  var panelRefs = null;
  var lastFocused = null;
  var panelOpen = false;
  var activeTab = "color";
  var mounted = false;

  function resolvedMode() {
    if (state.appearance === "system") {
      return mql && mql.matches ? "dark" : "light";
    }
    return state.appearance;
  }

  function injectCss() {
    if (!config.injectCss || document.getElementById("edge-fluent-appearance-css")) {
      return;
    }
    var style = document.createElement("style");
    style.id = "edge-fluent-appearance-css";
    style.setAttribute("data-edge-fluent-appearance", VERSION);
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function apply() {
    var mode = resolvedMode();
    var root = document.documentElement;
    root.setAttribute("data-edge-appearance", state.appearance);
    root.setAttribute("data-edge-mode", mode);
    root.setAttribute("data-edge-color-theme", state.colorTheme);
    root.setAttribute("data-edge-image-theme", state.imageTheme);
    root.setAttribute("data-edge-skin", config.skin);
    root.classList.toggle("edge-skinned", config.skin === "canvas");
  }

  function detail(changed) {
    return {
      appearance: state.appearance,
      mode: resolvedMode(),
      colorTheme: state.colorTheme,
      imageTheme: state.imageTheme,
      changed: changed || null,
      version: VERSION
    };
  }

  function emit(name, changed) {
    var event;
    try {
      event = new CustomEvent("edge-theme:" + name, {
        detail: detail(changed),
        bubbles: false
      });
    } catch (error) {
      return;
    }
    window.dispatchEvent(event);
  }

  function setState(patch) {
    patch = patch || {};
    var changed = {};
    var next = normalize({
      appearance: isAppearance(patch.appearance)
        ? patch.appearance
        : state.appearance,
      colorTheme: isTheme("color", patch.colorTheme)
        ? patch.colorTheme
        : state.colorTheme,
      imageTheme: isTheme("image", patch.imageTheme)
        ? patch.imageTheme
        : state.imageTheme
    });
    if (next.appearance !== state.appearance) {
      changed.appearance = { from: state.appearance, to: next.appearance };
    }
    if (next.colorTheme !== state.colorTheme) {
      changed.colorTheme = { from: state.colorTheme, to: next.colorTheme };
    }
    if (next.imageTheme !== state.imageTheme) {
      changed.imageTheme = { from: state.imageTheme, to: next.imageTheme };
    }
    state = next;
    apply();
    syncPanel();
    if (Object.keys(changed).length) {
      writeStored(state);
      emit("change", changed);
      announce();
    }
    return getState();
  }

  function announce() {
    if (!panelRefs || !panelRefs.status) {
      return;
    }
    panelRefs.status.textContent =
      copy.status + " · " + modeLabel() + " · " + labelFor("color", state.colorTheme) +
      (state.imageTheme === "none" ? "" : " · " + labelFor("image", state.imageTheme));
  }

  function modeLabel() {
    if (state.appearance === "system") {
      return copy.following + " · " + (resolvedMode() === "dark" ? copy.dark : copy.light);
    }
    return state.appearance === "dark" ? copy.dark : copy.light;
  }

  function panelSubtitle() {
    var parts = [modeLabel(), labelFor("color", state.colorTheme)];
    if (state.imageTheme !== "none") {
      parts.push(labelFor("image", state.imageTheme));
    }
    return parts.join(" · ");
  }

  function appearanceButton(value) {
    var icons = { system: "system", light: "light", dark: "dark" };
    var labels = { system: copy.system, light: copy.light, dark: copy.dark };
    return (
      '<button class="edge-seg" type="button" role="radio" data-edge-appearance="' +
      value +
      '" aria-checked="false">' +
      ICONS[icons[value]] +
      "<span>" +
      labels[value] +
      "</span></button>"
    );
  }

  function colorButton(theme) {
    return (
      '<button class="edge-panel-theme" type="button" role="radio" data-edge-color="' +
      theme.id +
      '" aria-checked="false" title="' +
      theme.label +
      ' · ' +
      theme.en +
      '">' +
      '<span class="edge-panel-swatch" data-theme="' +
      theme.id +
      '"></span>' +
      '<span class="edge-panel-name">' +
      (config.lang === "en" ? theme.en : theme.label) +
      "</span></button>"
    );
  }

  function artButton(theme) {
    return (
      '<button class="edge-panel-theme" type="button" role="radio" data-edge-art="' +
      theme.id +
      '" aria-checked="false" title="' +
      theme.label +
      ' · ' +
      theme.en +
      '">' +
      '<span class="edge-panel-art" data-art="' +
      theme.id +
      '"></span>' +
      '<span class="edge-panel-name">' +
      (config.lang === "en" ? theme.en : theme.label) +
      "</span></button>"
    );
  }

  function buildPanel() {
    if (!config.panel || panelEl || !document.body) {
      return;
    }
    var root = document.createElement("div");
    root.className = "edge-theme-ui" + (config.position === "bottom-left" ? " is-left" : "");
    root.id = "edge-theme-ui";
    root.innerHTML =
      '<button class="edge-launcher" type="button" aria-label="' +
      copy.open +
      '" aria-expanded="false" aria-controls="edge-panel">' +
      ICONS.contrast +
      '<span class="edge-launcher-dot" aria-hidden="true"></span>' +
      "</button>" +
      '<section class="edge-panel" id="edge-panel" role="dialog" aria-modal="false" aria-labelledby="edge-panel-title" aria-hidden="true" tabindex="-1" inert>' +
      '<header class="edge-panel-head">' +
      '<div class="edge-panel-title"><p>' +
      copy.panelKicker +
      "</p><h2 id=\"edge-panel-title\">" +
      copy.panelTitle +
      '</h2><p data-edge-subtitle></p></div>' +
      '<button class="edge-icon-btn edge-panel-close" type="button" data-edge-close aria-label="' +
      copy.close +
      '">' +
      ICONS.close +
      "</button></header>" +
      '<div class="edge-panel-body">' +
      '<section class="edge-panel-section"><div class="edge-panel-label">' +
      copy.appearance +
      '<span>' +
      copy.custom +
      '</span></div><div class="edge-segmented edge-segmented--full" role="radiogroup" aria-label="' +
      copy.appearance +
      '">' +
      appearanceButton("system") +
      appearanceButton("light") +
      appearanceButton("dark") +
      '</div><p class="edge-panel-hint">' +
      copy.appearanceHint +
      "</p></section>" +
      '<section class="edge-panel-section"><div class="edge-panel-label">' +
      copy.theme +
      '<span data-edge-image-clear-wrap class="edge-panel-clear-wrap"><button class="edge-panel-reset" type="button" data-edge-clear-art>' +
      copy.none +
      "</button></span></div>" +
      '<div class="edge-panel-tabs" role="tablist" aria-label="' +
      copy.theme +
      '">' +
      '<button class="edge-panel-tab" type="button" role="tab" id="edge-tab-color" aria-selected="true" aria-controls="edge-panel-color" data-edge-tab="color">' +
      ICONS.palette +
      copy.colorTab +
      "</button>" +
      '<button class="edge-panel-tab" type="button" role="tab" id="edge-tab-image" aria-selected="false" aria-controls="edge-panel-image" data-edge-tab="image">' +
      ICONS.image +
      copy.imageTab +
      "</button></div>" +
      '<div class="edge-panel-grid" id="edge-panel-color" role="tabpanel" aria-labelledby="edge-tab-color" data-edge-panel="color">' +
      THEMES.color.map(colorButton).join("") +
      "</div>" +
      '<div class="edge-panel-grid" id="edge-panel-image" role="tabpanel" aria-labelledby="edge-tab-image" data-edge-panel="image" hidden>' +
      THEMES.image.map(artButton).join("") +
      "</div>" +
      '<div class="edge-panel-reset-row"><span>' +
      copy.builtIn +
      '</span><button class="edge-panel-reset" type="button" data-edge-reset>' +
      ICONS.reset +
      copy.reset +
      "</button></div></section>" +
      "</div>" +
      '<footer class="edge-panel-foot"><span class="edge-panel-foot-status" role="status" aria-live="polite">' +
      ICONS.save +
      "<span>" +
      copy.saved +
      '</span></span><span class="edge-badge">' +
      copy.savedShort +
      "</span></footer>" +
      "</section>";

    document.body.appendChild(root);
    panelEl = root.querySelector(".edge-panel");
    launcherEl = root.querySelector(".edge-launcher");
    panelRefs = {
      subtitle: root.querySelector("[data-edge-subtitle]"),
      appearance: Array.prototype.slice.call(
        root.querySelectorAll("[data-edge-appearance]")
      ),
      color: Array.prototype.slice.call(root.querySelectorAll("[data-edge-color]")),
      art: Array.prototype.slice.call(root.querySelectorAll("[data-edge-art]")),
      tabs: Array.prototype.slice.call(root.querySelectorAll("[data-edge-tab]")),
      panels: Array.prototype.slice.call(root.querySelectorAll("[data-edge-panel]")),
      clearArt: root.querySelector("[data-edge-clear-art]"),
      clearWrap: root.querySelector("[data-edge-image-clear-wrap]"),
      status: root.querySelector(".edge-panel-foot-status span:last-child")
    };

    launcherEl.addEventListener("click", toggle);
    panelEl.addEventListener("click", onPanelClick);
    panelEl.addEventListener("keydown", onPanelKeydown);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onDocumentKeydown);
    syncPanel();
    mounted = true;
  }

  function onPanelClick(event) {
    var target = event.target;
    if (!(target instanceof Element) || !panelEl.contains(target)) {
      return;
    }

    // Never let `.closest()` walk past the panel to the <html> state attributes.
    function match(selector) {
      var node = target.closest(selector);
      return node && panelEl.contains(node) ? node : null;
    }

    var tab = match("[data-edge-tab]");
    if (tab) {
      setTab(tab.getAttribute("data-edge-tab"));
      return;
    }
    var color = match("[data-edge-color]");
    if (color) {
      setState({ colorTheme: color.getAttribute("data-edge-color") });
      return;
    }
    var art = match("[data-edge-art]");
    if (art) {
      setState({ imageTheme: art.getAttribute("data-edge-art") });
      return;
    }
    var appearance = match("[data-edge-appearance]");
    if (appearance) {
      setState({ appearance: appearance.getAttribute("data-edge-appearance") });
      return;
    }
    if (match("[data-edge-clear-art]")) {
      setState({ imageTheme: "none" });
      return;
    }
    if (match("[data-edge-reset]")) {
      reset();
      return;
    }
    if (match("[data-edge-close]")) {
      close(true);
    }
  }

  function onPanelKeydown(event) {
    if (event.key === "Escape") {
      event.stopPropagation();
      close(true);
      return;
    }

    function match(selector) {
      if (!event.target.closest) {
        return null;
      }
      var node = event.target.closest(selector);
      return node && panelEl.contains(node) ? node : null;
    }

    var tab = match("[data-edge-tab]");
    if (tab && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      event.preventDefault();
      var tabs = panelRefs.tabs;
      var tabIndex = tabs.indexOf(tab);
      var nextTab =
        event.key === "ArrowRight"
          ? (tabIndex + 1) % tabs.length
          : (tabIndex - 1 + tabs.length) % tabs.length;
      setTab(tabs[nextTab].getAttribute("data-edge-tab"));
      tabs[nextTab].focus();
      return;
    }

    var selected = match("[data-edge-appearance]");
    if (selected && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      event.preventDefault();
      var modes = panelRefs.appearance;
      var modeIndex = modes.indexOf(selected);
      var nextMode =
        event.key === "ArrowRight"
          ? modes[(modeIndex + 1) % modes.length]
          : modes[(modeIndex - 1 + modes.length) % modes.length];
      nextMode.click();
      nextMode.focus();
      return;
    }

    var colorOption = match("[data-edge-color]");
    if (colorOption && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      event.preventDefault();
      var colors = panelRefs.color;
      var colorIndex = colors.indexOf(colorOption);
      var nextColor =
        event.key === "ArrowRight"
          ? colors[(colorIndex + 1) % colors.length]
          : colors[(colorIndex - 1 + colors.length) % colors.length];
      nextColor.click();
      nextColor.focus();
      return;
    }

    var artOption = match("[data-edge-art]");
    if (artOption && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      event.preventDefault();
      var arts = panelRefs.art;
      var artIndex = arts.indexOf(artOption);
      var nextArt =
        event.key === "ArrowRight"
          ? arts[(artIndex + 1) % arts.length]
          : arts[(artIndex - 1 + arts.length) % arts.length];
      nextArt.click();
      nextArt.focus();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }
    var focusable = Array.prototype.filter.call(
      panelEl.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ),
      function (element) {
        return !element.closest("[hidden]") && element.offsetWidth > 0;
      }
    );
    if (!focusable.length) {
      return;
    }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panelEl)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onDocumentKeydown(event) {
    if (event.key === "Escape" && panelOpen) {
      close(true);
    }
  }

  function onPointerDown(event) {
    if (!panelOpen || !panelEl) {
      return;
    }
    var target = event.target;
    if (panelEl.contains(target) || (launcherEl && launcherEl.contains(target))) {
      return;
    }
    close(false);
  }

  function setTab(tab) {
    if (tab !== "color" && tab !== "image") {
      return;
    }
    activeTab = tab;
    if (panelRefs) {
      panelRefs.tabs.forEach(function (button) {
        var selected = button.getAttribute("data-edge-tab") === tab;
        button.setAttribute("aria-selected", selected ? "true" : "false");
        button.tabIndex = selected ? 0 : -1;
      });
      panelRefs.panels.forEach(function (section) {
        section.hidden = section.getAttribute("data-edge-panel") !== tab;
      });
    }
  }

  function syncPanel() {
    if (!panelRefs) {
      return;
    }
    panelRefs.subtitle.textContent = panelSubtitle();
    panelRefs.appearance.forEach(function (button) {
      button.setAttribute(
        "aria-checked",
        button.getAttribute("data-edge-appearance") === state.appearance
          ? "true"
          : "false"
      );
    });
    panelRefs.color.forEach(function (button) {
      button.setAttribute(
        "aria-checked",
        button.getAttribute("data-edge-color") === state.colorTheme ? "true" : "false"
      );
    });
    panelRefs.art.forEach(function (button) {
      button.setAttribute(
        "aria-checked",
        button.getAttribute("data-edge-art") === state.imageTheme ? "true" : "false"
      );
    });
    if (panelRefs.clearWrap) {
      panelRefs.clearWrap.classList.toggle(
        "is-hidden",
        state.imageTheme === "none"
      );
    }
    setTab(activeTab);
  }

  function open() {
    if (!config.panel) {
      return;
    }
    if (!mounted) {
      buildPanel();
    }
    if (!panelEl) {
      return;
    }
    lastFocused = document.activeElement;
    panelOpen = true;
    panelEl.classList.add("is-open");
    panelEl.removeAttribute("inert");
    panelEl.setAttribute("aria-hidden", "false");
    if (launcherEl) {
      launcherEl.setAttribute("aria-expanded", "true");
    }
    var closeButton = panelEl.querySelector("[data-edge-close]");
    if (closeButton) {
      closeButton.focus({ preventScroll: true });
    } else {
      panelEl.focus({ preventScroll: true });
    }
  }

  function close(restoreFocus) {
    if (!panelEl) {
      return;
    }
    panelOpen = false;
    panelEl.classList.remove("is-open");
    panelEl.setAttribute("inert", "");
    panelEl.setAttribute("aria-hidden", "true");
    if (launcherEl) {
      launcherEl.setAttribute("aria-expanded", "false");
    }
    if (restoreFocus) {
      var target =
        lastFocused && lastFocused !== document.body && lastFocused.isConnected
          ? lastFocused
          : launcherEl;
      if (target && typeof target.focus === "function") {
        target.focus({ preventScroll: true });
      }
    }
  }

  function toggle() {
    if (panelOpen) {
      close(true);
    } else {
      open();
    }
  }

  function getState() {
    return detail(null);
  }

  function set(patch) {
    return setState(patch || {});
  }

  function reset() {
    state = normalize(baseState);
    clearStored();
    apply();
    syncPanel();
    emit("change", { reset: true });
    announce();
    return getState();
  }

  function onSystemChange() {
    if (state.appearance !== "system") {
      return;
    }
    apply();
    syncPanel();
    emit("change", {
      appearance: { from: "system", to: "system" },
      system: resolvedMode()
    });
  }

  injectCss();
  apply();

  if (mql) {
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onSystemChange);
    } else if (typeof mql.addListener === "function") {
      mql.addListener(onSystemChange);
    }
  }

  function start() {
    buildPanel();
    if (!config.launcher && launcherEl) {
      launcherEl.hidden = true;
    }
    var openOnLoad = config.open || query.panel === "open" || query.panel === "1";
    if (openOnLoad && config.panel) {
      open();
    }
    emit("ready", null);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  window.EdgeTheme = Object.freeze({
    version: VERSION,
    themes: THEMES,
    get: getState,
    set: set,
    setAppearance: function (value) {
      return set({ appearance: value });
    },
    setColorTheme: function (value) {
      return set({ colorTheme: value });
    },
    setImageTheme: function (value) {
      return set({ imageTheme: value });
    },
    reset: reset,
    open: open,
    close: close,
    toggle: toggle
  });
})();

