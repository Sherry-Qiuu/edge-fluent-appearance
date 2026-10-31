#!/usr/bin/env node
/**
 * Build Edge Fluent Appearance.
 *
 * 1. Inline the five SVG art themes into the stylesheet as data URIs.
 * 2. Embed the finished stylesheet in the runtime so one script is enough.
 *
 * Run from this directory: node build.mjs
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const assets = join(here, "..");
const themesDir = join(here, "..", "themes");

const svgFiles = readdirSync(themesDir).filter((file) => file.endsWith(".svg"));
const svgData = new Map();
for (const file of svgFiles) {
  const name = file.replace(/\.svg$/, "");
  const svg = readFileSync(join(themesDir, file), "utf8");
  svgData.set(name, Buffer.from(svg, "utf8").toString("base64"));
}

const cssFiles = readdirSync(here)
  .filter((file) => /^\d+-.+\.css$/.test(file))
  .sort();

let css = cssFiles
  .map((file) => readFileSync(join(here, file), "utf8").trim())
  .join("\n\n");

css = css.replace(/url\("themes\/([a-z-]+)\.svg"\)/g, (match, name) => {
  const encoded = svgData.get(name);
  if (!encoded) {
    throw new Error(`Missing theme SVG: ${name}`);
  }
  return `url("data:image/svg+xml;base64,${encoded}")`;
});

const leftover = css.match(/themes\/[a-z-]+\.svg/);
if (leftover) {
  throw new Error(`Un-inlined theme reference: ${leftover[0]}`);
}

writeFileSync(join(assets, "edge-theme.css"), `${css.trimEnd()}\n`, "utf8");

const runtime = readFileSync(join(here, "runtime.js"), "utf8");
if (!runtime.includes('"__EDGE_CSS_PLACEHOLDER__"')) {
  throw new Error("Runtime placeholder not found");
}
const bundle = runtime.replace(
  '"__EDGE_CSS_PLACEHOLDER__"',
  JSON.stringify(css)
);
writeFileSync(join(assets, "edge-theme.js"), `${bundle.trimEnd()}\n`, "utf8");

const kb = (value) => `${(Buffer.byteLength(value, "utf8") / 1024).toFixed(1)} KB`;
console.log(`Built edge-theme.css  ${kb(css)}`);
console.log(`Built edge-theme.js   ${kb(bundle)}`);
console.log(`Inlined ${svgData.size} art themes from ${cssFiles.length} CSS layers.`);
