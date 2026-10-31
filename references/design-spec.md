# Design specification — Edge Fluent Appearance

This document records what was extracted from the reference Edge Settings page and how it was translated into a reusable system. It is intentionally more precise than the summary in `SKILL.md`.

> Source: a 2026 Microsoft Edge Settings → Appearance screenshot (light theme, sage accent, 2796×1500), plus the Fluent design conventions visible across the page. This project is not affiliated with Microsoft. Measurements are normalized to CSS pixels at a 1440 px desktop viewport.

---

## 1. The read: what makes the reference feel like Edge

1. **A warm neutral canvas, not white.** The page background is a low-chroma warm gray (`#f3f3f1`); the main settings surface is white. The contrast between them is only a few percent. This is what makes the page feel calm rather than “dashboard”.
2. **One large surface.** The main content is a single rounded white panel with a 1 px border, not a stack of floating cards. Inside it, secondary cards use a slightly darker neutral (`#f7f7f4`), not another elevation.
3. **A narrow, quiet rail.** The 264 px sidebar carries all navigation. The active row is the only saturated surface: a muted sage tint with a short 3 px accent bar. Everything else is 13–14 px text and 17 px line icons.
4. **Dense but breathing.** Controls are 32–40 px tall; rows are 56–90 px; section gaps are 24–32 px. The page is compact by web standards but never cramped.
5. **A single accent.** Sage appears in the active nav row, selected segment, active tab, links, focus ring, swatch check, and tiny status dots. It never becomes a large fill.
6. **Soft geometry.** Cards use 10–12 px radii; controls 6–8 px; pills only for swatches, badges, and circular icons. Nothing is 20 px+.
7. **Borders, not shadows.** A 1 px `#e4e4df` border does most of the separation. Shadows are 2–8 px and almost invisible; only the floating panel gets a deeper shadow.
8. **A real hierarchy in typography.** 26 px page title → 20 px panel title → 14 px row title → 12.5 px description → 11 px meta. Weight jumps are modest (400/500/600/650), never 800.
9. **Feedback is quiet.** Hover is a 5% black wash. Selected controls gain a 1 px accent border and a 14% accent tint. The only motion is a 120–180 ms fade/rise.
10. **Art is optional and subordinate.** Color is the default; image themes are scenes that sit behind 82% opaque glass surfaces and a scrim. The content never competes with the art.

---

## 2. Layout geometry

| Item | Value | Notes |
| --- | --- | --- |
| Sidebar width | 264 px (238 px below 1120 px) | Sticky, full height, scrolls independently. |
| Sidebar padding | 26 px top, 14 px sides, 16 px bottom | 10 px inner padding for the wordmark. |
| Nav row | 38 px high, 11 px horizontal padding, 8 px radius | 2 px gap; 20 px between groups. |
| Main padding | 18 px top, 30 px sides, 56 px bottom | 22 px sides below 1120 px. |
| Content max width | 1160 px | Centered; the reference is roughly 1150 px at 1792. |
| Top bar | 40 px search, 18 px gap below | Search flexes; actions stay right. |
| Page surface | 1 px border, 12 px radius | Header padding 24/28, body 18/28/28. |
| Settings card | 10 px radius, 18–20 px padding | Background `--edge-surface-2`. |
| Section gap | 24 px heading top, 10 px below | Notice 14 px above/below. |
| Swatch | 42 px circle, 4 px ring offset | 18 px gap; 38 px on mobile. |
| Image card | 16:9 thumbnail, 8 px radius | 5 columns desktop, 3 tablet, 2 mobile. |
| Panel | 420 px wide, 12 px radius | Anchored 20 px right, 78 px above launcher. |
| Launcher | 46 px circle, 20 px inset | 44 px on mobile. |

---

## 3. Color tokens

The system uses CSS `light-dark()` so a single declaration resolves per `color-scheme`. This keeps the CSS half the size of duplicated dark blocks and makes system mode work without JavaScript.

### Neutral surfaces

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--edge-bg` | `#f3f3f1` | `#1b1b1a` | Page canvas |
| `--edge-bg-2` | `#f8f8f6` | `#20201f` | Subtle page variation |
| `--edge-surface-solid` | `#ffffff` | `#272725` | Opaque surface base |
| `--edge-surface` | `#ffffff` | `#272725` | Cards, dialogs, page surface |
| `--edge-surface-2` | `#f7f7f4` | `#2d2d2a` | Secondary card, preview shell |
| `--edge-surface-3` | `#eeeeea` | `#343431` | Segmented track, inset control |
| `--edge-panel-bg` | 92% `#fbfbf9` | 92% `#232322` | Floating panel with blur |

When an image theme is active, `--edge-surface` becomes 82% opaque and `--edge-surface-2/3` become 80%/76% opaque. The blur on the surface plus the scrim keeps text contrast while letting the art read at the edges.

### Text and lines

| Token | Light | Dark | Contrast on surface |
| --- | --- | --- | --- |
| `--edge-text` | `#1d1d1f` | `#f3f3ef` | 16.8:1 / 13.5:1 |
| `--edge-text-2` | `#3f3f44` | `#d7d7d2` | 10.4:1 / 9.1:1 |
| `--edge-muted` | `#5f5f66` | `#b0b0aa` | 6.3:1 / 6.9:1 |
| `--edge-faint` | `#6e6e74` | `#92928c` | 5.1:1 / 4.8:1 |
| `--edge-border` | `#e4e4df` | `#3a3a37` | Decorative 1 px |
| `--edge-border-strong` | `#d0d0c8` | `#4c4c47` | Control outline |

`--edge-faint` is 10.5–11 px meta only; do not use it for body copy. The light value was raised from the reference's lighter gray to meet 4.5:1 on the canvas.

### State washes

| Token | Light | Dark |
| --- | --- | --- |
| `--edge-hover` | `rgba(28,28,30,.05)` | `rgba(255,255,255,.06)` |
| `--edge-active` | `rgba(28,28,30,.09)` | `rgba(255,255,255,.10)` |
| `--edge-accent-soft` | 14% accent + surface | same recipe |
| `--edge-accent-soft-2` | 24% accent + surface | same recipe |
| `--edge-accent-line` | 42% accent + border | same recipe |

### Accent pairs

Each palette defines a light and dark accent, plus a dark-enough “accent text” for links and a contrasting ink for filled buttons.

| ID | Light accent | Dark accent | Light text | Dark text | Swatch light / deep |
| --- | --- | --- | --- | --- | --- |
| `azure` | `#2f6fed` | `#8ab8ff` | `#1f5bc4` | `#a9cbff` | `#cfe0ff` / `#2f6fed` |
| `sage` | `#4f7a5b` | `#a8c9a6` | `#3f6549` | `#b9d8b6` | `#dfe9d9` / `#50765a` |
| `amber` | `#a96418` | `#e9b36a` | `#7f4a0f` | `#f0c68c` | `#f3dfc3` / `#b06b1d` |
| `rose` | `#b04d6c` | `#e8a4b8` | `#8b3854` | `#f0b9c7` | `#f3d7df` / `#b04d6c` |
| `iris` | `#6a57c8` | `#b9a8ff` | `#4e3da6` | `#ccbfff` | `#e2dcff` / `#6a57c8` |

Filled button ink: white for azure/sage/rose/iris in light mode; `#2a1704` for amber in dark mode; white for amber in light mode (4.64:1 on `#a96418`). Dark fills use the dark accent with a dark ink.

---

## 4. Typography

| Level | Size | Weight | Line height | Use |
| --- | --- | --- | --- | --- |
| Page title | 24 px | 650 | 1.1 | “设置” wordmark |
| Page heading | 20 px | 650 | 1.2 | “外观” |
| Panel title | 17 px | 650 | 1.2 | Floating panel |
| Section heading | 15 px | 600 | 1.3 | “主题” |
| Row title | 14 px | 600 | 1.35 | “整体外观” |
| Navigation | 14 px | 400/600 | 1.4 | Sidebar |
| Body | 14 px | 400 | 1.45 | Base |
| Description | 12.5 px | 400 | 1.55 | Muted copy |
| Tab / segment | 12.5 px | 500/600 | 1 | Controls |
| Meta | 10.5–11 px | 400/500 | 1.4–1.6 | Badges, footnotes |
| Kicker | 10 px | 600 | 1.2 | Uppercase, 0.09em tracking |

Font stack: `"Segoe UI Variable Text", "Segoe UI", -apple-system, ... "PingFang SC", "Microsoft YaHei UI"`. The display stack uses `Segoe UI Variable Display` for headings. Letter-spacing is only slightly negative on large headings (`-0.03em` at 24–26 px); body text is normal. Do not import a fashionable geometric sans; the neutrality is the point.

---

## 5. Shape, elevation, motion

| Token | Value |
| --- | --- |
| `--edge-r-xs` | 4 px |
| `--edge-r-sm` | 6 px |
| `--edge-r-md` | 8 px |
| `--edge-r-lg` | 10 px |
| `--edge-r-xl` | 12 px |
| `--edge-r-pill` | 999 px (badges/swatches only) |
| Shadow 1 | `0 1px 2px rgba(24,24,28,.04), 0 2px 8px rgba(24,24,28,.035)` |
| Shadow 2 | `0 2px 6px …, 0 12px 32px …` |
| Shadow 3 | `0 4px 10px …, 0 24px 64px …` (panel only) |
| Ease | `cubic-bezier(.2,0,0,1)` |
| Duration | 120 ms hover, 180 ms panel, 280 ms entrance |
| Hover lift | none or 1 px max |

The reference is almost static. Do not add scale-on-hover cards, glow, or gradient buttons. The only notable motion is the panel rising 10 px and fading in.

---

## 6. Component anatomy

### 6.1 Sidebar

- 264 px wide, 26 px top padding, translucent canvas background with 32 px blur when an image theme is active.
- Wordmark: 32 px rounded square with accent-soft fill, accent icon, 24 px “设置” + 10.5 px uppercase “EDGE FLUENT”.
- Nav group: 2 px gap; 38 px rows; 11 px icon gap; 17 px line icons.
- Active row: `--edge-accent-soft` fill, 600 weight, 3 px accent bar at the left edge, icon switches to accent text.
- Groups separated by a 1 px border and 20 px margin.
- Footer: 10.5 px note + full-width 32 px “发送反馈” button.

### 6.2 Top bar

- 40 px search field, 8 px radius, 1 px border, search icon 16 px, `Ctrl K` keycap.
- Focus: accent border + 3 px accent-soft halo; background becomes solid surface.
- Actions: one compact 32 px button and a small uppercase note. No global header bar; the search floats over the canvas.

### 6.3 Page surface

- 1 px border, 12 px radius, white/dark surface, very soft shadow.
- Header: 24 px top, 28 px sides; title left, feedback prompt right.
- Quick chips: 32 px high, 8 px radius, 1 px strong border, icon + label.
- Body: 18 px top, 28 px sides, 28 px bottom.

### 6.4 Overall appearance row

- Left: 30 px circular icon plate + title + 12.5 px description.
- Right: segmented control in a `--edge-surface-3` track, 3 px padding, 1 px border, 9 px radius.
- Segment: 34 px high, 84 px min width, 7 px radius, icon + label.
- Selected: accent-soft fill, accent-line border, 600 weight, subtle shadow. This is the signature Edge state.
- On mobile the row stacks, and the segmented control becomes full width.

### 6.5 Theme toolbar and tabs

- Tabs in a `--edge-surface-2` track, 3 px padding, 9 px radius.
- Tab: 32 px high, icon + label, 12.5 px.
- Active: solid surface, 1 px border, tiny shadow, accent icon.
- “恢复默认值” is a text link with a 13 px reset icon, aligned right.

### 6.6 Color swatches

- 42 px circle; background `linear-gradient(135deg, tint 0 50%, deep 50% 100%)`.
- 1 px hairline border and an inset white highlight to keep the circle crisp.
- Active: 2 px accent ring at -4 px, plus a 17 px check badge at bottom-right. The check is a second signal, not the only one.
- Label 11 px under the circle; selected label becomes 600.
- Swatches are `role="radio"` inside a `role="radiogroup"`; arrow-key support is provided in the floating panel.

### 6.7 Image theme cards

- 16:9 thumbnail, 8 px radius, 1 px border; name strip 8/9 px padding.
- Active: 1 px accent border + 1 px accent ring, check badge.
- Hover: 1 px lift and stronger border. No zoom.
- Below the grid: an 11 px info line and a “移除图像主题” text button.

### 6.8 Notice

- 14/16 px padding, 10 px radius, 1 px border, secondary surface.
- 28 px accent-soft icon tile; 12.5 px 600 title; 12 px muted description; inline link in accent text.

### 6.9 Preview

- 12 px padded secondary card; title row; browser chrome 32 px; dots; centered address.
- Viewport: mini sidebar (126 px) + mini surface; skeleton lines; mini segmented control; mini swatches; art strip.
- The preview is a real DOM miniature using the same tokens, so it updates instantly without a canvas or duplicate styles.

### 6.10 Floating panel

- 420 px wide, max 760 px tall; 12 px radius; 92% panel background + 40 px blur.
- Header 16/18 px; 17 px title; 10.5 px kicker and subtitle.
- Sections separated by 1 px borders; 15/18 px padding.
- Three-option segmented control full width; 33 px high; 11.5 px labels.
- Tab track 3 px; 30 px tabs.
- Five 29 px swatches or five 56 px art tiles in a 5-column grid.
- Footer: 10 px status + “已保存” badge. Reset in the section footer, not duplicated.
- Focus: open focuses the close button; Tab is trapped; Escape closes; outside click closes without stealing focus.

---

## 7. Image theme treatment

The image theme is not a full-bleed wallpaper behind text. It is a three-layer recipe:

1. **Art** — a 1600×1000 abstract SVG, embedded as a data URI, `background-size: cover`, fixed.
2. **Scrim** — a linear gradient from 74% to 90% `--edge-bg` in light mode, 60% to 82% in dark. This is what guarantees text contrast.
3. **Glass surfaces** — cards use 82% opaque surface + 24 px blur, so the art reads as color and atmosphere, not as a busy photo.

A subtle accent tint (`--edge-art-tint`, 16% accent) sits on top of the art to tie the image theme to the selected color. This is why `iris + aurora` feels deliberately paired rather than randomly combined.

On the sidebar, the art is allowed through at 58% background opacity. On the page surface, only the margins and preview show the art clearly. That restraint is the Edge behavior.

---

## 8. Responsive rules

| Breakpoint | Behavior |
| --- | --- |
| ≥ 1120 px | 264 px sidebar; 30 px main padding; 5-across art grid. |
| 920–1120 px | 238 px sidebar; 22 px padding. |
| < 920 px | Sidebar hidden; compact mobile wordmark; search moves to its own row; rows stack; art grid 3 columns. |
| < 720 px | Page padding 15 px; full-width segmented; quick chips scroll horizontally; tabs split the row; art grid 2 columns; preview nav narrows. |
| < 480 px | Search keycap remains; top action label hides; 36 px swatches; mini nav hidden; code wraps. |
| < 560 px | Panel becomes a near-full-width sheet 10 px from the edges. |

At 390 px the document must have no horizontal scroll. The quick-chip strip is the one intentional horizontal scroller; it must contain its own overflow.

---

## 9. Accessibility

- **Contrast:** body text 15:1; muted 5.7–7.9:1; faint 4.6–5.5:1; accent text 6.3–9.7:1; filled-button ink 4.55–9.1:1. Amber's light fill was adjusted to pure white ink to clear 4.5:1.
- **Focus:** 2 px accent outline with 2 px offset on all interactive controls. The dialog container itself has no outline; focus lands on the close button.
- **Semantics:** segmented controls are `role="radiogroup"`/`radio` with `aria-checked`; tabs are `role="tablist"`/`tab`/`tabpanel`; the panel is `role="dialog" aria-modal="false"`; the launcher has `aria-expanded` and `aria-controls`.
- **Keyboard:** arrow keys move between modes and tabs; Tab is trapped inside the open panel; Escape closes; focus returns to the launcher or the previously focused control.
- **Reduced motion:** all transitions collapse to 0.01 ms under `prefers-reduced-motion`.
- **Color independence:** selected swatches have a ring and a check, not just color; active nav has a bar and weight change.
- **Zoom:** layouts remain usable at 200% because widths are in px but content wraps and the sidebar collapses.

---

## 10. What to copy, what not to copy

**Copy the grammar:** the warm canvas, one surface, quiet rail, 1 px borders, compact controls, single accent, 8–12 px radii, half-light/half-dark swatches, and the separation of appearance from theme.

**Do not copy:** the Microsoft/Edge logo, the exact screenshot, Microsoft product names in the UI, the “Copilot” brand, or the claim that this is an official Edge surface. The demo uses original copy and an abstract wordmark.

**Do not over-generalize:** Edge Settings is a desktop-first, information-dense product surface. It is not a marketing hero, a mobile app, or a gaming UI. If the target is a landing page, keep the tokens and panel but allow a larger display type; see `demo/any-page.html` for that adaptation.
