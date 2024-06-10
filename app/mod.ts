/// <reference lib="dom" />
// Imports
import { css } from "./build/css.ts"
import { html, html_builder, html_builder_demo } from "./build/html.ts"
import { highlight, ssg } from "./build/ssg.ts"
import { dist } from "./build/dist.ts"
import { serveDir, STATUS_CODE, STATUS_TEXT } from "jsr:@std/http@0.224.1"
import { root } from "./build/root.ts"
import api_minify from "../api/brew.ts"
import api_preview from "../api/preview.ts"
import { fromFileUrl } from "jsr:@std/path"

// Serve files
switch (Deno.args[0]) {
  case "serve":
    Deno.serve(async (request) => {
      try {
        const url = new URL(request.url)
        switch (true) {
          case new URLPattern("/{index.html}?", url.origin).test(url.href) && request.headers.get("Accept")?.includes("text/html"):
            return new Response(await html(), { headers: { "Content-Type": "text/html" } })
          case new URLPattern("/build{.html}?", url.origin).test(url.href) && request.headers.get("Accept")?.includes("text/html"):
            return new Response(await html_builder(), { headers: { "Content-Type": "text/html" } })
          case new URLPattern("/matcha.css", url.origin).test(url.href):
            return new Response(await css(), { headers: { "Content-Type": "text/css" } })
          case new URLPattern("/build/demo{.html}?", url.origin).test(url.href):
            return new Response(await html_builder_demo(), { headers: { "Content-Type": "text/html" } })
          case new URLPattern("/mod.css", url.origin).test(url.href):
            return new Response(await Deno.readFile(new URL("mod.css", import.meta.url)), { headers: { "Content-Type": "text/css" } })
          case new URLPattern("/mod.svg", url.origin).test(url.href):
            return new Response(await Deno.readFile(new URL("mod.svg", import.meta.url)), { headers: { "Content-Type": "image/svg+xml" } })
          case new URLPattern("/*.png", url.origin).test(url.href):
            return new Response(await Deno.readFile(new URL(url.pathname.slice(1), new URL("app/icons/", root))), { headers: { "Content-Type": "image/png" } })
          case new URLPattern("/*.svg", url.origin).test(url.href):
            return new Response(await Deno.readFile(new URL(url.pathname.slice(1), new URL("app/icons/", root))), { headers: { "Content-Type": "image/svg+xml" } })
          case new URLPattern("/styles/*", url.origin).test(url.href):
            return new Response(await Deno.readFile(new URL(url.pathname.slice(1), root)), { headers: { "Content-Type": "text/css" } })
          case new URLPattern("/api/brew", url.origin).test(url.href):
            return api_minify(request)
          case new URLPattern("/api/preview", url.origin).test(url.href.replace(url.search, "")):
            return api_preview(request)
          case new URLPattern("/highlight.js", url.origin).test(url.href):
            return fetch(highlight)
          case new URLPattern("/v/*", url.origin).test(url.href):
            return serveDir(request, { fsRoot: fromFileUrl(new URL(".pages/v", root)), urlRoot: "v", showDirListing: true, quiet: true })
          default:
            return new Response(STATUS_TEXT[STATUS_CODE.NotFound], { status: STATUS_CODE.NotFound })
        }
      } catch (error) {
        return new Response(`Server was unable to respond to request for the following reason:\n\n${error}`, { status: STATUS_CODE.InternalServerError })
      }
    })
    break
  case "build":
    await dist()
    await ssg()
    break
}
