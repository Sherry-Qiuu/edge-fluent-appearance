# Deployment guide

Everything below assumes the `assets/` folder is available at a stable URL. `edge-theme.js` is self-contained: it already includes the stylesheet and the ten SVG art themes.

---

## 1. Static HTML — the one-line route

Place this in `<head>`, before the page's own `<link rel="stylesheet">` and before any content. The runtime must resolve the theme before first paint.

```html
<script
  src="/assets/edge-theme.js"
  data-edge-appearance="system"
  data-edge-color-theme="sage"
  data-edge-image-theme="none"
  data-edge-panel="true"
></script>
```

Result: the page gets the Edge canvas, the five-color/five-image panel, and `window.EdgeTheme`. No build step, no framework, no font download.

If the page must not be repainted at all:

```html
<script
  src="/assets/edge-theme.js"
  data-edge-skin="none"
  data-edge-panel="true"
></script>
```

Only the panel is added; the host page's CSS is untouched. This is the safe deployment for third-party or legacy pages.

### Authoring defaults without JavaScript

The CSS is usable on its own. Put the state on `<html>` and link the stylesheet:

```html
<!doctype html>
<html
  lang="zh-CN"
  data-edge-appearance="system"
  data-edge-color-theme="amber"
  data-edge-image-theme="dune"
>
<head>
  <link rel="stylesheet" href="/assets/edge-theme.css">
  <!-- Optional: panel + persistence. Drop inject-css because it is linked. -->
  <script src="/assets/edge-theme.js" data-edge-inject-css="false"></script>
</head>
```

Without the script, `light-dark()` still follows the OS, the palette and art still apply, and the page has no panel. This is the right choice for a marketing site that only needs a fixed branded appearance.

---

## 2. CSP and strict security policies

The one-script route injects a `<style>` element and creates the panel in the light DOM. That needs one of:

- `style-src 'self' 'unsafe-inline'`; or
- a nonce/hash that covers the injected style (the runtime does not currently accept a nonce).

For strict CSP, use the external CSS route:

```html
<link rel="stylesheet" href="/assets/edge-theme.css">
<script
  src="/assets/edge-theme.js"
  data-edge-inject-css="false"
  data-edge-panel="true"
></script>
```

The runtime no longer writes inline `style` attributes in the panel, so `style-src-attr` can stay strict. The demo pages use a few inline styles for illustration; do not copy those into production.

If `script-src` blocks the bundle entirely, the CSS-only route still provides the appearance and palette; use `window.EdgeTheme` only when scripts are allowed.

### Iframes

The panel is `position: fixed` relative to its own document. If the page is embedded in an iframe, the panel stays inside the iframe and cannot escape it. Cross-origin parent/child theming is intentionally not attempted:

- Same-origin: call `iframe.contentWindow.EdgeTheme.set(...)` from the parent.
- Cross-origin: include the script in the child document; communicate preferences over `postMessage` and call the API on the child side.

---

## 3. React / Next.js

Put the script in the document head, not in a component effect. A `useEffect` runs after paint and causes a flash.

### Vite / Create React App

`index.html`:

```html
<script
  src="/edge-theme.js"
  data-edge-color-theme="sage"
  data-edge-panel="true"
></script>
```

Copy `edge-theme.js` to `public/`. Then read state where needed:

```jsx
import { useEffect, useState } from "react";

export function useEdgeTheme() {
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" && window.EdgeTheme
      ? window.EdgeTheme.get()
      : null
  );

  useEffect(() => {
    if (!window.EdgeTheme) return undefined;
    const onChange = (event) => setTheme(event.detail);
    window.addEventListener("edge-theme:change", onChange);
    return () => window.removeEventListener("edge-theme:change", onChange);
  }, []);

  return theme;
}
```

Do not render the panel yourself; the script owns it. If you want native controls, call `window.EdgeTheme.setAppearance`, `setColorTheme`, or `setImageTheme` from your own buttons.

### Next.js App Router

`app/layout.tsx`:

```tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <Script
          src="/edge-theme.js"
          strategy="beforeInteractive"
          data-edge-color-theme="sage"
          data-edge-panel="true"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

`beforeInteractive` is still not guaranteed to run before the first paint in every Next.js setup. For zero flash, add this inline boot snippet in `<head>` before the stylesheet and keep the full script at the end of `<head>`:

```html
<script>
  try {
    var saved = JSON.parse(localStorage.getItem("edge-fluent-appearance:v1") || "{}");
    var appearance = saved.appearance || "system";
    var mode = appearance === "system"
      ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : appearance;
    var root = document.documentElement;
    root.dataset.edgeAppearance = appearance;
    root.dataset.edgeMode = mode;
    root.dataset.edgeColorTheme = saved.colorTheme || "sage";
    root.dataset.edgeImageTheme = saved.imageTheme || "none";
    root.setAttribute("data-edge-mode", mode);
  } catch (error) {}
</script>
```

`suppressHydrationWarning` is needed because the boot script mutates `<html>` before React hydrates.

---

## 4. Vue / Nuxt / Svelte

### Vue 3 / Vite

`index.html`:

```html
<script src="/edge-theme.js" data-edge-panel="true"></script>
```

Component:

```vue
<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const theme = ref(null);
const onChange = (event) => { theme.value = event.detail; };

onMounted(() => {
  theme.value = window.EdgeTheme?.get() ?? null;
  window.addEventListener("edge-theme:change", onChange);
});
onUnmounted(() => window.removeEventListener("edge-theme:change", onChange));
</script>
```

### Nuxt

Add the script to `nuxt.config.ts` under `app.head.script` with `tagPosition: "head"`, or put it in `app.vue` via `useHead`. For SSR, use the boot snippet from the Next.js section; Nuxt needs `htmlAttrs` to be dynamic rather than hard-coded.

### Svelte / SvelteKit

`src/app.html`:

```html
<script src="/edge-theme.js" data-edge-panel="true"></script>
```

Because Svelte controls `<html>`, either (a) let the runtime own the `data-edge-*` attributes and avoid binding them in Svelte, or (b) bind them from a store and set `data-edge-inject-css="false"` with the external CSS. Do not do both.

---

## 5. WordPress / CMS / no-code

1. Upload `edge-theme.js` to the theme or uploads directory (prefer a child theme's `assets/`).
2. Add the script to `wp_head` with priority 1:

```php
add_action('wp_head', function () {
  ?>
  <script src="<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/edge-theme.js'); ?>"
    data-edge-color-theme="sage" data-edge-panel="true"></script>
  <?php
}, 1);
```

3. If the theme has a dark-mode plugin, disable its toggle to avoid two competing state systems, or set `data-edge-panel="false"` and drive the API from the plugin.

For Webflow/Framer/Notion-style builders, use the custom-code head slot. If the builder sanitizes `<script>`, use an embed component or a reverse proxy; do not inject via `innerHTML` after paint.

---

## 6. Userscript / bookmarklet (last resort)

Some pages cannot be edited. A userscript can add the script at runtime, but many production sites enforce CSP, which will block a remote script. This is a demo tool, not a way to bypass a site's security policy.

```js
// ==UserScript==
// @name         Edge Fluent Appearance preview
// @match        https://example.com/*
// @run-at       document-start
// ==/UserScript==
(() => {
  const script = document.createElement("script");
  script.src = "https://your-host.example/edge-theme.js";
  script.dataset.edgePanel = "true";
  script.dataset.edgeSkin = "none";
  document.documentElement.appendChild(script);
})();
```

Bookmarklet form (also CSP-limited):

```js
javascript:(()=>{const s=document.createElement('script');s.src='https://your-host.example/edge-theme.js';s.dataset.edgePanel='true';document.documentElement.append(s)})()
```

Use only on pages you own or have permission to modify.

---

## 7. Mapping an existing page

Do the minimum: change colors, not layout.

```css
/* Before */
.card { background: #fff; color: #222; border: 1px solid #ddd; }
.muted { color: #777; }
.primary { background: #2563eb; color: #fff; }

/* After */
.card {
  background: var(--edge-surface);
  color: var(--edge-text);
  border: 1px solid var(--edge-border);
  border-radius: var(--edge-r-lg);
}
.muted { color: var(--edge-muted); }
.primary {
  background: var(--edge-accent);
  color: var(--edge-accent-ink);
  border: 1px solid var(--edge-accent);
  border-radius: var(--edge-r-sm);
}
```

Rules of thumb:

- Map **all** opaque backgrounds and text colors together. Mapping only text produces light text on white cards in dark mode.
- Do not map images; keep photography untouched. Use `--edge-art` only for the page backdrop.
- Keep existing spacing and grid. Replacing every radius with 12 px makes the page look like a different product.
- If a component has a hard-coded gradient, either leave it (and accept it as brand) or replace it with `--edge-surface-2`.
- For charts, use `--edge-accent`, `--edge-accent-2` (add your own), and neutral grid lines. Do not use the image art inside charts.

### Shadow DOM

The runtime mounts into `document.body`, not a shadow root. If the host app uses a shadow root for its entire UI, the panel still renders in the light DOM and will inherit the page's font unless the panel's own `font-family` wins (it does). Tokens are on `:root`, so they cross shadow boundaries; component classes do not. Use the external CSS inside the shadow root if you need `.edge-*` components there.

### Multiple apps on one origin

Use a unique `data-edge-storage-key` per app. The default key is shared across the origin, which is usually desirable for a brand but wrong for a multi-tenant admin.

### Versioning

Pin a version in the path (`/vendor/edge-theme/1.1.0/edge-theme.js`) and keep the old file for rollback. The bundle is deterministic: `node assets/src/build.mjs` regenerates both `edge-theme.css` and `edge-theme.js`.

---

## 8. Production hardening

- **Self-host** the bundle; do not hotlink a demo server.
- Set a long cache lifetime and a content hash in the filename. The file is ~130 KB uncompressed, roughly 35 KB after Brotli.
- Add `data-edge-panel="false"` if the floating button is not part of the product. The API and tokens still work.
- Add `data-edge-persist="false"` for kiosks, embedded demos, and screenshots.
- Keep the `<meta name="color-scheme" content="light dark">` tag so form controls and scrollbars match.
- If you add a `theme-color` meta tag, update it in an `edge-theme:change` listener:

```js
window.addEventListener("edge-theme:change", (event) => {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue("--edge-bg").trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
});
```

- Test with the browser's forced-colors mode. The tokens are colors; Windows High Contrast may override them. Do not fight it.
- Test with 200% zoom and a 390 px viewport.
- If the page has its own `prefers-color-scheme` logic, remove it. Two systems will fight.

---

## 9. Adding a theme

### A sixth color theme

1. Add a block in `assets/src/00-tokens.css`:

```css
:root[data-edge-color-theme="moss"] {
  --edge-accent-l: #5b6f3a;
  --edge-accent-d: #c2d49a;
  --edge-accent-strong-l: #45562b;
  --edge-accent-strong-d: #d8e6b8;
  --edge-accent-ink-l: #ffffff;
  --edge-accent-ink-d: #1b2410;
  --edge-accent-text-l: #4c5e30;
  --edge-accent-text-d: #cfe0ae;
  --edge-swatch-1: #e4ecd4;
  --edge-swatch-2: #5b6f3a;
}
```

2. Add it to `THEMES.color` in `assets/src/runtime.js`.
3. Add a label and description in your page/panel if needed.
4. Run `node assets/src/build.mjs` and check contrast.

### A sixth image theme

1. Add `assets/themes/coast.svg` (1600×1000, abstract, no text).
2. In `assets/src/00-tokens.css`:

```css
--edge-art-coast: url("themes/coast.svg");

:root[data-edge-image-theme="coast"] {
  --edge-art: var(--edge-art-coast);
}
```

3. Add a thumbnail selector if you render cards:

```css
.edge-art-thumb[data-art="coast"],
.edge-panel-art[data-art="coast"] {
  background-image: var(--edge-art-coast);
}
```

4. Add it to `THEMES.image` in `assets/src/runtime.js`.
5. Rebuild. The build inlines every SVG referenced with `url("themes/*.svg")` as a data URI and fails if a reference is missing.

---

## 10. Testing recipe

### Visual snapshots

Use a real Chromium/Edge build. The demo supports query overrides because it sets `data-edge-query="true"`.

```powershell
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$demo = "file:///E:/path/to/demo/index.html"

& $edge --headless=new --no-sandbox --disable-gpu `
  --window-size=1440,1000 --hide-scrollbars `
  --virtual-time-budget=3000 `
  --screenshot="light.png" "$demo`?appearance=light"

& $edge --headless=new --no-sandbox --disable-gpu `
  --window-size=1440,1000 --hide-scrollbars `
  --virtual-time-budget=3000 `
  --screenshot="dark-aurora.png" "$demo`?appearance=dark&color=iris&image=aurora&tab=image"
```

Headless `--window-size=390,844` may enforce a ~500 px minimum layout viewport on Windows. Use CDP `Emulation.setDeviceMetricsOverride` for a true 390 px test.

### Behavior checks

```js
const theme = window.EdgeTheme;
console.assert(theme.get().appearance === "system");
theme.setAppearance("dark");
console.assert(document.documentElement.dataset.edgeMode === "dark");
theme.setColorTheme("iris");
theme.setImageTheme("aurora");
console.assert(localStorage.getItem("edge-fluent-appearance:v1").includes("iris"));
theme.reset();
console.assert(theme.get().appearance === "system");
```

### Checklist

- [ ] 1440 px, 1024 px, 720 px, 390 px.
- [ ] Light, dark, and OS dark with `appearance=system`.
- [ ] All 5 colors × at least 2 image themes (and `none`).
- [ ] Panel open/close, Escape, outside click, Tab cycle, arrow keys.
- [ ] Reload persistence and reset.
- [ ] No flash of incorrect theme on a cold load.
- [ ] No horizontal document scroll at 390 px.
- [ ] Contrast on every custom surface you mapped.
- [ ] `prefers-reduced-motion`.
- [ ] CSP mode with external CSS.

---

## 11. Licensing and attribution

The code and original SVG art in this skill are original work. The design is *inspired by* the Fluent language and the Edge Settings page; it is not endorsed by or affiliated with Microsoft. If you publish a derivative, keep the non-affiliation notice and do not use Microsoft logos or product screenshots as your own assets.

The demo copy mentions “Microsoft Edge” descriptively. That is nominative use; do not rename your product “Edge” or use the Edge logo.



