#!/usr/bin/env DENO_DIR=/tmp deno run
// Imports
import { STATUS_CODE, STATUS_TEXT } from "jsr:@std/http@0.224.1"

/** API: Preview website */
export default async function (request: Request) {
  if (request.method !== "GET") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  if (new URL(`https://${request.headers.get("Host")}`).hostname !== new URL(`https://${Deno.env.get("ALLOWED_HOST") || "localhost"}`).hostname) {
    return new Response(STATUS_TEXT[STATUS_CODE.Forbidden], { status: STATUS_CODE.Forbidden })
  }
  try {
    const url = new URL(request.url).searchParams.get("url")!
    const body = await fetch(url, { headers: { Accept: "text/html" } }).then((response) => response.text())
    return new Response(body, { headers: { "Content-Type": "text/html" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
