/// <reference lib="dom" />
// Imports
import { css } from "./build/css.ts"
import { html } from "./build/html.ts"
import { ssg } from "./build/ssg.ts"
import { STATUS_CODE, STATUS_TEXT } from "jsr:@std/http@0.224.0"
import { root } from "./build/root.ts"
import api_minify from "../api/brew.ts"

// Serve files
switch (Deno.args[0]) {
  case "serve":
    Deno.serve(async (request) => {
      const url = new URL(request.url)
      switch (true) {
        case new URLPattern("/{index.html}?", url.origin).test(url.href) && request.headers.get("Accept")?.includes("text/html"):
          return new Response(await html(), { headers: { "Content-Type": "text/html" } })
        case new URLPattern("/matcha.css", url.origin).test(url.href):
          return new Response(await css(), { headers: { "Content-Type": "text/css" } })
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
        default:
          return new Response(STATUS_TEXT[STATUS_CODE.NotFound], { status: STATUS_CODE.NotFound })
      }
    })
    break
  case "build":
    await ssg()
    break
}
