#!/usr/bin/env DENO_DIR=/tmp deno run
// Imports
import { bundle } from "jsr:@libs/bundle@1.0.2/css"
import { banner as _banner } from "../app/build/css.ts"
import { STATUS_CODE, STATUS_TEXT } from "jsr:@std/http@0.224.0"

/** API: Minify css */
export default async function (request: Request) {
  if (request.method !== "POST") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  if (new URL(`https://${request.headers.get("Host")}`).hostname !== new URL(`https://${Deno.env.get("VERCEL_URL") || "localhost"}`).hostname) {
    return new Response(STATUS_TEXT[STATUS_CODE.Forbidden], { status: STATUS_CODE.Forbidden })
  }
  try {
    const body = await request.text()
    const banner = _banner.replace("matcha.css\n", `matcha.css — Custom build (${new Date().toDateString()})\n`)
    const bundled = await bundle(body, { minify: true, banner, rules: { "no-descending-specificity": false, "no-duplicate-selectors": false } })
    return new Response(bundled, { headers: { "Content-Type": "text/css" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
