// Imports
import { root } from "./root.ts"
import { default as syntax } from "https://esm.sh/highlight.js@11.9.0/lib/core"
import { default as hlxml } from "https://esm.sh/highlight.js@11.9.0/lib/languages/xml"
import { default as hlcss } from "https://esm.sh/highlight.js@11.9.0/lib/languages/css"
import { default as hllisp } from "https://esm.sh/highlight.js@11.9.0/lib/languages/lisp"
import { default as hljs } from "https://esm.sh/highlight.js@11.9.0/lib/languages/javascript"
import { default as hlmd } from "https://esm.sh/highlight.js@11.9.0/lib/languages/markdown"
import { default as hlsh } from "https://esm.sh/highlight.js@11.9.0/lib/languages/diff"
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts"
syntax.registerLanguage("xml", hlxml)
syntax.registerLanguage("css", hlcss)
syntax.registerLanguage("lisp", hllisp)
syntax.registerLanguage("js", hljs)
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
  Array.from(document.querySelectorAll("[data-hl]")).forEach((_element) => {
    const element = _element as unknown as HTMLElement
    element.innerHTML = syntax.highlight(element.innerText, { language: element.getAttribute("data-hl")! }).value.trim()
    element.removeAttribute("data-hl")
  })
  Array.from(document.querySelectorAll(".example:not([data-codeless])")).forEach((_element) => {
    const element = _element as unknown as HTMLElement
    const clone = element.cloneNode(true) as unknown as HTMLElement
    clone.querySelectorAll("script,.note").forEach((element) => element.remove())
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
  document.querySelector("aside > nav")!.innerHTML = `<ul>${nav.join("")}</ul>`
  return `<!DOCTYPE html>${document.documentElement!.outerHTML}`
}

/** Strip emojis */
function emojiless(string: string) {
  return string.replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]+/gu, "")
}
