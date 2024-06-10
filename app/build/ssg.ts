// Imports
import { copy, emptyDir, ensureDir, expandGlob } from "jsr:@std/fs@0.229.1"
import { dirname, fromFileUrl } from "jsr:@std/path@0.225.1"
import { root } from "./root.ts"
import { html, html_builder, html_builder_demo } from "./html.ts"
import { compatibility } from "jsr:@libs/bundle@5/css"

/** Highlight.js CDN */
export const highlight = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"

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
  const dist = fromFileUrl(new URL("dist", root)).replaceAll("\\", "/")
  for await (const { path, name } of expandGlob("**/*.css", { root: dist })) {
    await copy(path, new URL(`.pages/${name}`, root))
    console.log(`Created .pages/${name}`)
  }
  // Generate compatibility table
  const table = await compatibility(new URL(".pages/matcha.css", root), { output: "html", style: false, verbose: true })
  await Deno.writeTextFile(new URL(".pages/compatibility.html", root), table)
  console.log("Created .pages/compatibility.html")
  // Generate HTML
  await Deno.writeTextFile(new URL(".pages/index.html", root), await html())
  console.log("Created .pages/index.html")
  await Deno.writeTextFile(new URL(".pages/build.html", root), await html_builder())
  console.log("Created .pages/build.html")
  await ensureDir(new URL(".pages/build", root))
  await Deno.writeTextFile(new URL(".pages/build/demo.html", root), await html_builder_demo())
  console.log("Created .pages/build/demo.html")
  // Copy styles
  await ensureDir(new URL(".pages/styles", root))
  console.log("Created .pages/styles")
  const styles = fromFileUrl(new URL("styles", root)).replaceAll("\\", "/")
  for await (const { path, name } of expandGlob("**/*.css", { root: styles })) {
    const subpath = path.replaceAll("\\", "/").replace(styles, "").slice(1)
    await ensureDir(`.pages/styles/${dirname(subpath)}`)
    await copy(path, new URL(`.pages/styles/${subpath}`, root))
    console.log(`Created .pages/styles/${subpath}`)
    if (name === "mod.css") {
      const alias = `${dirname(subpath)}.css`
      await copy(path, new URL(`.pages/${alias}`, root))
      console.log(`Created .pages/${alias}`)
    }
  }
  // Download highlight.js
  await Deno.writeTextFile(new URL(".pages/highlight.js", root), await fetch(highlight).then((response) => response.text()))
  console.log("Created .pages/highlight.js")
  console.log("Done!")
}
