// Imports
import { expandGlob } from "jsr:@std/fs@0.229.1"
import { basename, dirname, fromFileUrl } from "jsr:@std/path@0.225.1"
import { bundle } from "jsr:@libs/bundle@5/css"
import { root as _root } from "./root.ts"
import { version } from "./version.ts"

/** Banner */
export const banner = [
  `matcha.css — ${version}`,
  `Copyright © ${new Date().getFullYear()} Lecoq Simon (@lowlighter)`,
  "MIT license — https://github.com/lowlighter/matcha",
].join("\n")

/**
 * Generate CSS
 *
 * Pass `exclude` to exclude specific directories from the build.
 *
 * Pass `only` to only include specific directories in the build (this takes precedence over `exclude`).
 * Use the special value `*` to include all "base styles" (`@root` and all directories not starting with `@`).
 *
 * Pass `minify` to minify the output CSS.
 */
export async function css({ only = [] as string[], exclude = ["@istanbul-coverage"] as string[], minify = true } = {}) {
  const root = fromFileUrl(_root)
  let css = ""
  if (only.length) {
    exclude = []
  }
  let files = await Array.fromAsync(expandGlob("styles/**/*.css", { root, exclude: exclude.map((directory) => `styles/${directory}/*.css`) }))
  if (only.length) {
    files = files.filter((file) => {
      const name = file.path.replace(root, "").replaceAll("\\", "/").split("/")[1]
      if ((only.includes("*")) && (!name.startsWith("@") || (name === "@root"))) {
        return true
      }
      return only.includes(name)
    })
  }
  files.sort((A, B) => {
    const a = basename(dirname(A.path))
    const b = basename(dirname(B.path))
    if (a === "@root") {
      return -1
    }
    if (b === "@root") {
      return 1
    }
    if ((a.startsWith("@")) && (b.startsWith("@"))) {
      return a.localeCompare(b)
    } else if (a.startsWith("@")) {
      return 1
    } else if (b.startsWith("@")) {
      return -1
    }
    return 0
  })
  for (const { path } of files) {
    css += await Deno.readTextFile(path)
  }
  return bundle(css, { minify, banner, rules: { "no-descending-specificity": false, "no-duplicate-selectors": false, "declaration-no-important": true } })
}
