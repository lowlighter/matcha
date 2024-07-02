// Imports
import { fromFileUrl } from "jsr:@std/path@0.225.1"
import * as JSONC from "jsr:@std/jsonc@0.224.3"

/** Matcha version. */
const { version } = JSONC.parse(await Deno.readTextFile(fromFileUrl(import.meta.resolve("../../deno.jsonc")))) as { version: string }
export { version }
