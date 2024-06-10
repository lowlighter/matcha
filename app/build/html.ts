// Imports
import { root } from "./root.ts"
import { default as syntax } from "https://esm.sh/highlight.js@11.9.0/lib/core"
import { default as hlxml } from "https://esm.sh/highlight.js@11.9.0/lib/languages/xml"
import { default as hlcss } from "https://esm.sh/highlight.js@11.9.0/lib/languages/css"
import { default as hllisp } from "https://esm.sh/highlight.js@11.9.0/lib/languages/lisp"
import { default as hljs } from "https://esm.sh/highlight.js@11.9.0/lib/languages/javascript"
import { default as hlts } from "https://esm.sh/highlight.js@11.9.0/lib/languages/typescript"
import { default as hlmd } from "https://esm.sh/highlight.js@11.9.0/lib/languages/markdown"
import { default as hlsh } from "https://esm.sh/highlight.js@11.9.0/lib/languages/diff"
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts"
import { gzipSize } from "https://deno.land/x/gzip_size@v0.3.0/mod.ts"
syntax.registerLanguage("xml", hlxml)
syntax.registerLanguage("css", hlcss)
syntax.registerLanguage("lisp", hllisp)
syntax.registerLanguage("js", hljs)
syntax.registerLanguage("ts", hlts)
syntax.registerLanguage("md", hlmd)
syntax.registerLanguage("diff", hlsh)

/** Generate HTML */
export async function html() {
  // Include mod.html files
  let html = await Deno.readTextFile(new URL("app/mod.html", root))
  for (const _ of [1, 2]) {
    for (const match of html.matchAll(/<!--\/(?<path>[\s\S]+?\/.*\.html)-->/g)) {
      const path = match.groups!.path.trim()
      const content = await Deno.readTextFile(new URL(path, root))
      html = html.replace(match[0], content)
    }
  }
  // Generate code examples
  const document = new DOMParser().parseFromString(html, "text/html")!
  document.querySelector('header nav menu a[href="/"]')?.parentElement?.remove()
  Array.from(document.querySelectorAll("[data-hl]")).forEach((_element) => {
    const element = _element as unknown as HTMLElement
    element.innerHTML = syntax.highlight(element.innerText, { language: element.getAttribute("data-hl")! }).value.trim()
    element.removeAttribute("data-hl")
  })
  Array.from(document.querySelectorAll(".example:not([data-codeless])")).forEach((_element) => {
    const element = _element as unknown as HTMLElement
    const clone = element.cloneNode(true) as unknown as HTMLElement
    clone.querySelectorAll("script:not([data-keep]),.note").forEach((element) => element.remove())
    clone.querySelectorAll("script[data-keep]").forEach((element) => element.removeAttribute("data-keep"))
    const html = clone.innerHTML.replaceAll(/<template>[\s\S]*?<\/template>/g, "")
    const indent = html.match(/^( *)(?=\S)/m)?.[1]?.length || 0
    const code = html
      .replaceAll(new RegExp(`^ {${indent}}`, "gm"), "")
      .replaceAll('=""', "")
      .trim()
    const details = document.createElement("details") as unknown as HTMLDetailsElement
    details.innerHTML = `<summary>See code</summary><pre><code></code></pre>`
    details.querySelector("code")!.innerHTML = syntax.highlight(code, { language: "html" }).value.trim()
    element.after(details)
  })
  Array.from(document.querySelectorAll(".example:not([data-codeless]), .example[data-color-schemeable]")).forEach((_element) => {
    const element = _element as unknown as HTMLElement
    const tabs = document.createElement("menu") as unknown as HTMLMenuElement
    tabs.classList.add("example-tabs")
    tabs.innerHTML = `<li class="color-scheme">${document.querySelector(".color-scheme")!.innerHTML}</li>`
    element.before(tabs)
  })
  // Generate table of contents
  const nav = [] as string[]
  Array.from(document.querySelectorAll("main > section")).forEach((_element) => {
    const element = _element as unknown as HTMLElement
    const h1 = element.querySelector("h1") as unknown as HTMLElement
    if (h1) {
      const lv1 = (h1.querySelector("a") as unknown as HTMLElement).outerHTML
      const lv2 = Array.from(element.querySelectorAll("section > :is(h1, h2, h3, h4, h5, h6)"))
        .filter((hx) => (hx as HTMLElement).parentElement?.parentElement === element)
        .map((hx) => {
          const lv3 = Array.from(hx.parentElement!.querySelectorAll("section > section > section > :is(h1, h2, h3, h4, h5, h6), summary :is(h1, h2, h3, h4, h5, h6)"))
            .map((hy) => `<li><small>${emojiless((hy.querySelector("a") as unknown as HTMLElement).outerHTML)}</small></li>`)
            .join("")
          const a = (hx.querySelector("a") as unknown as HTMLElement).outerHTML
          return `<li>${a}${lv3 ? `<ul>${lv3}</ul>` : ""}</li>`
        })
        .join("")
      nav.push(`<li><b>${lv1}</b><ul>${lv2}</ul></li>`)
    }
  })
  if (document.querySelector("aside > nav")) {
    document.querySelector("aside > nav")!.innerHTML = `<ul>${nav.join("")}</ul>`
  }
  // Compute gzip size
  Array.from(document.querySelectorAll("[data-matcha-size]")).forEach((_element) => {
    const element = _element as unknown as HTMLElement
    let size = 0
    try {
      size = gzipSize(Deno.readTextFileSync(new URL(`dist/${element.dataset.matchaSize}`, root)))
    } catch {
      // Ignore
    }
    element.innerText = `~${new Intl.NumberFormat("en-US", { style: "unit", unit: "kilobyte", unitDisplay: "narrow", maximumSignificantDigits: 3 }).format(size / 1000)}`
  })
  return `<!DOCTYPE html>${document.documentElement!.outerHTML}`
}

/** Strip emojis */
function emojiless(string: string) {
  return string.replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]+/gu, "")
}

/** Generate HTML for custom builder */
export async function html_builder() {
  // Clean mod.html
  const html = await Deno.readTextFile(new URL("app/mod.html", root))
  const document = new DOMParser().parseFromString(html, "text/html")!
  document.querySelector('header nav menu a[href="/build"]')?.parentElement?.remove()
  for (const selection of ["body > aside", " main > section:not(.matcha)", "section.matcha section"]) {
    document.querySelectorAll(selection).forEach((element) => (element as unknown as HTMLElement).remove())
  }
  // Include uncollapsed builder
  const builder = new DOMParser().parseFromString(await Deno.readTextFile(new URL("app/sections/custom-build.html", root)), "text/html")!
  const section = document.createElement("section")
  section.innerHTML = builder.querySelector("details")!.innerHTML
  section.querySelector("summary")?.remove()
  document.querySelector("main")!.append(section)
  // Syntax highlighting
  Array.from(document.querySelectorAll("[data-hl]")).forEach((_element) => {
    const element = _element as unknown as HTMLElement
    element.innerHTML = syntax.highlight(element.innerText, { language: element.getAttribute("data-hl")! }).value.trim()
    element.removeAttribute("data-hl")
  })
  return `<!DOCTYPE html>${document.documentElement!.outerHTML}`
}

/** Generate HTML for custom builder demo */
export async function html_builder_demo() {
  // Include mod.html files and clean it
  let html = await Deno.readTextFile(new URL("app/mod.html", root))
  for (const _ of [1, 2]) {
    for (const match of html.matchAll(/<!--\/(?<path>[\s\S]+?\/.*\.html)-->/g)) {
      const path = match.groups!.path.trim()
      const content = await Deno.readTextFile(new URL(path, root))
      html = html.replace(match[0], content)
    }
  }
  const document = new DOMParser().parseFromString(html, "text/html")!
  document.querySelector('header nav menu a[href="/build"]')?.parentElement?.remove()
  document.querySelector('header nav menu a[href="/"]')?.parentElement?.remove()
  document.querySelector('link[rel="stylesheet"][href="/matcha.css"]')?.remove()
  for (
    const selection of [
      "body > aside",
      "body > header",
      "body > footer",
      "body > script",
      "section.matcha",
      '[id="nav"] ~ p',
      '[id="utilities"] ~ :is(p, div)',
      '[id="utilities-colors"] ~ :is(p, div)',
      '[id="syntax-highlighting"] ~ p',
    ]
  ) {
    document.querySelectorAll(selection).forEach((element) => (element as unknown as HTMLElement).remove())
  }
  for (const id of ["html", "layouts", "utilities-classes", "utilities-synergies", "code-editor", "istanbul-coverage", "unstyled"]) {
    document.querySelector(`[id="${id}"]`)?.parentElement?.remove()
  }
  document.querySelectorAll(".example").forEach((_element) => {
    const element = _element as unknown as HTMLElement
    Array.from(element.parentElement?.children ?? []).forEach((element) => {
      if (element.classList.contains("example")) {
        return
      }
      if (/^H[1-6]$/.test(element.tagName)) {
        return
      }
      element.remove()
    })
  })
  // Clean background image
  const style = document.createElement("style")
  style.innerText = `body { background-image: none; }`
  document.head.append(style)
  // Syntax highlighting
  Array.from(document.querySelectorAll("[data-hl]")).forEach((_element) => {
    const element = _element as unknown as HTMLElement
    element.innerHTML = syntax.highlight(element.innerText, { language: element.getAttribute("data-hl")! }).value.trim()
    element.removeAttribute("data-hl")
  })
  return `<!DOCTYPE html>${document.documentElement!.outerHTML}`
}
