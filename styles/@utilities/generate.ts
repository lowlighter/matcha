import { fromFileUrl } from "jsr:@std/path/from-file-url"
const rules = ["/* This file is auto-generated, please do not edit manually */"]
const values = [0, .125, .25, .5, .75, 1, 1.25, 1.5, 1.75, 2, 3, 4].map((value) => `${value}`.replace(/^0./, "."))

// Margin and padding utilities
for (const property of ["margin", "padding"]) {
  for (const direction of ["", "x", "y", "top", "right", "bottom", "left"]) {
    for (const value of values) {
      let rule = `.${property.charAt(0)}${direction.charAt(0)}-${value.replace(".", "\\.")} { `
      switch (direction) {
        case "":
          rule += `${property}: ${value}rem;`
          break
        case "x":
          rule += `${property}-left: ${value}rem; ${property}-right: ${value}rem;`
          break
        case "y":
          rule += `${property}-top: ${value}rem; ${property}-bottom: ${value}rem;`
          break
        default:
          rule += `${property}-${direction}: ${value}rem;`
      }
      rule += " }"
      rules.push(rule)
    }
  }
}

// Spacing utilities
for (const property of ["spacing"]) {
  for (const direction of ["x", "y"]) {
    for (const value of values) {
      let rule = `.${property}-${direction.charAt(0)}-${value.replace(".", "\\.")} > * + * { `
      switch (direction) {
        case "x":
          rule += `margin-left: ${value}rem;`
          break
        case "y":
          rule += `margin-top: ${value}rem;`
          break
      }
      rule += " }"
      rules.push(rule)
    }
  }
}

// Save generated CSS
await Deno.writeTextFile(fromFileUrl(import.meta.resolve("./mod+generated.css")), rules.join("\n"))
