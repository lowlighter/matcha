// Imports
import { emptyDir, ensureDir } from "jsr:@std/fs@0.229.1"
import { root } from "./root.ts"
import { css } from "./css.ts"

/** Distribution versions generation */
export async function dist() {
  await emptyDir(new URL("dist", root))
  await ensureDir(new URL("dist", root))
  console.log("Created dist")

  // Generate CSS
  for (
    const { name, options } of [
      { name: "matcha" },
      { name: "matcha.lite", options: { only: ["*", "@break-words", "@discrete-scrollbars"] } },
      { name: "matcha.istanbul", options: { only: ["@root", "@syntax-highlighting", "@istanbul-coverage"] } },
    ]
  ) {
    await Deno.writeTextFile(new URL(`dist/${name}.css`, root), await css(options))
    console.log(`Created dist/${name}.css`)
  }

  console.log("Done!")
}
