// Imports
import { copy, emptyDir, ensureDir, expandGlob } from "jsr:@std/fs@0.223.0"
import { dirname, fromFileUrl } from "jsr:@std/path@0.223.0"
import { root } from "./root.ts"
import { css } from "./css.ts"
import { html } from "./html.ts"
import { compatibility } from "jsr:@libs/bundle@2.1.0/css/compatibility"

/** Static site generation */
export async function ssg() {
  await emptyDir(new URL(".pages", root))
  await ensureDir(new URL(".pages", root))
  console.log("Created .pages")
  // Copy favicons and assets
  for await (const { path, name } of expandGlob("**/*.{png,svg}", { root: fromFileUrl(new URL("app/icons", root)) })) {
    await copy(path, new URL(`.pages/${name}`, root))
    console.log(`Created .pages/${name}`)
  }
  await copy(new URL("app/mod.svg", root), new URL(".pages/mod.svg", root))
  console.log("Created .pages/mod.svg")
  await copy(new URL("app/mod.css", root), new URL(".pages/mod.css", root))
  console.log("Created .pages/mod.css")
  // Generate CSS
  await Deno.writeTextFile(new URL(".pages/matcha.css", root), await css())
  console.log("Created .pages/matcha.css")
  // Generate compatibility table
  const table = await compatibility(new URL(".pages/matcha.css", root), { output: "html", style: false, verbose: true })
  await Deno.writeTextFile(new URL(".pages/compatibility.html", root), table)
  console.log("Created .pages/compatibility.html")
  // Generate HTML
  await Deno.writeTextFile(new URL(".pages/index.html", root), await html())
  console.log("Created .pages/index.html")
  // Copy styles
  await ensureDir(new URL(".pages/styles", root))
  console.log("Created .pages/styles")
  const styles = fromFileUrl(new URL("styles", root)).replaceAll("\\", "/")
  for await (const { path } of expandGlob("**/*.css", { root: styles })) {
    const subpath = path.replaceAll("\\", "/").replace(styles, "").slice(1)
    await ensureDir(`.pages/styles/${dirname(subpath)}`)
    await copy(path, new URL(`.pages/styles/${subpath}`, root))
    console.log(`Created .pages/styles/${subpath}`)
  }
  console.log("Done!")
}
