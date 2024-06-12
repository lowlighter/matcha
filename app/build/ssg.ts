// Imports
import { copy, emptyDir, ensureDir, expandGlob } from "jsr:@std/fs@0.229.1"
import { basename, dirname, fromFileUrl } from "jsr:@std/path@0.225.1"
import { root } from "./root.ts"
import { html, html_builder, html_builder_demo } from "./html.ts"
import { compatibility } from "jsr:@libs/bundle@5/css"
import { DOMParser } from " https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts"

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
  await ensureDir(new URL(".pages/v/main", root))
  console.log("Created .pages/v/main")
  for await (const { path, name } of expandGlob("**/*.css", { root: dist })) {
    await copy(path, new URL(`.pages/${name}`, root))
    console.log(`Created .pages/${name}`)
    await copy(path, new URL(`.pages/v/main/${name}`, root))
    console.log(`Created .pages/v/main/${name}`)
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
      await copy(path, new URL(`.pages/v/main/${alias}`, root))
      console.log(`Created .pages/v/main/${alias}`)
    }
  }
  await copy(new URL(".pages/styles", root), new URL(".pages/v/main/styles", root))
  console.log("Created .pages/v/main/styles")
  // Download highlight.js
  await Deno.writeTextFile(new URL(".pages/highlight.js", root), await fetch(highlight).then((response) => response.text()))
  console.log("Created .pages/highlight.js")
  // Download previous versions
  const { tags: { latest }, versions } = await fetch("https://data.jsdelivr.com/v1/package/npm/@lowlighter/matcha").then((response) => response.json())
  for (const version of versions.reverse()) {
    await ensureDir(new URL(`.pages/v/${version}`, root))
    console.log(`Created .pages/v/${version}`)
    const url = `https://cdn.jsdelivr.net/npm/@lowlighter/matcha@${version}`
    const dist = Array.from(
      new DOMParser().parseFromString(await fetch(`${url}/dist/`).then((response) => response.text()), "text/html")!.querySelectorAll(`.listing a[href^="/npm/@lowlighter/matcha@${version}"]`),
    )
    await Promise.all(dist.map(async (_file) => {
      const file = _file as unknown as HTMLAnchorElement
      const href = file.getAttribute("href")!
      await Deno.writeTextFile(new URL(`.pages/v/${version}/${basename(href)}`, root), await fetch(new URL(href, url)).then((response) => response.text()))
      console.log(`Created .pages/v/${version}/${basename(href)}`)
    }))
    const styles = Array.from(
      new DOMParser().parseFromString(await fetch(`${url}/styles/`).then((response) => response.text()), "text/html")!.querySelectorAll(`.listing a[href^="/npm/@lowlighter/matcha@${version}"]`),
    )
    await Promise.all(styles.map(async (_directory) => {
      const directory = _directory as unknown as HTMLAnchorElement
      const href = directory.getAttribute("href")!
      const files = Array.from(
        new DOMParser().parseFromString(await fetch(new URL(href, url)).then((response) => response.text()), "text/html")!.querySelectorAll(`.listing a[href^="/npm/@lowlighter/matcha@${version}"]`),
      )
      await Promise.all(Array.from(files.map(async (_file) => {
        const file = _file as unknown as HTMLAnchorElement
        const href = file.getAttribute("href")!
        if (!href.endsWith(".css")) {
          return
        }
        const subpath = `styles/${basename(directory.getAttribute("href")!)}/${basename(href)}`
        const content = await fetch(new URL(href, url)).then((response) => response.text())
        await ensureDir(new URL(`.pages/v/${version}/${dirname(subpath)}`, root))
        await Deno.writeTextFile(new URL(`.pages/v/${version}/${subpath}`, root), content)
        console.log(`Created .pages/v/${version}/${subpath}`)
        if (basename(href) === "mod.css") {
          await Deno.writeTextFile(new URL(`.pages/v/${version}/${basename(dirname(subpath))}.css`, root), content)
          console.log(`Created .pages/v/${version}/${basename(dirname(subpath))}.css`)
        }
      })))
    }))
  }
  await copy(new URL(`.pages/v/${latest}`, root), new URL(".pages/v/latest", root))
  console.log(`Created .pages/v/latest from version ${latest}`)
  for (const major of new Set<string>(versions.map((version: string) => version.split(".")[0]))) {
    if (major === "0") {
      continue
    }
    const version = versions.filter((version: string) => version.startsWith(`${major}.`)).reverse()[0]
    await copy(new URL(`.pages/v/${version}`, root), new URL(`.pages/v/${major}`, root))
    console.log(`Created .pages/v/${major} from version ${version}`)
  }
  for (const minor of new Set<string>(versions.map((version: string) => `${version.split(".")[0]}.${version.split(".")[1]}`))) {
    if (minor.startsWith("0.")) {
      continue
    }
    const version = versions.filter((version: string) => version.startsWith(`${minor}.`)).reverse()[0]
    await copy(new URL(`.pages/v/${version}`, root), new URL(`.pages/v/${minor}`, root))
    console.log(`Created .pages/v/${minor} from version ${version}`)
  }
  console.log("Done!")
}
