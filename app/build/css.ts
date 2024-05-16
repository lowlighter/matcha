// Imports
import { expandGlob } from "jsr:@std/fs@0.223.0"
import { fromFileUrl } from "jsr:@std/path@0.223.0"
import { bundle } from "jsr:@libs/bundle@1.0.2/css"
import { root } from "./root.ts"

/** Banner */
export const banner = [
  "matcha.css",
  `Copyright © ${new Date().getFullYear()} Lecoq Simon (@lowlighter)`,
  "MIT license — https://github.com/lowlighter/matcha",
].join("\n")

/** Generate CSS */
export async function css(exclude = [] as string[]) {
  let css = ""
  const files = await Array.fromAsync(expandGlob("styles/**/*.css", { root: fromFileUrl(root), exclude: exclude.map((directory) => `styles/${directory}/*.css`) }))
  files.sort((a, b) => a.path.localeCompare(b.path))
  for (const { path } of files) {
    css += await Deno.readTextFile(path)
  }
  return bundle(css, { minify: true, banner, rules: { "no-descending-specificity": false, "no-duplicate-selectors": false } })
}
