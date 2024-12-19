/// <reference lib="dom" />
const banner = [
  "/**",
  ` * matcha.css — Custom build (${new Date().toDateString()})`,
  ` * Copyright © ${new Date().getFullYear()} Lecoq Simon (@lowlighter)`,
  " * MIT license — https://github.com/lowlighter/matcha",
  " */",
].join("\n")
const form = document.currentScript.previousElementSibling
// Manage meta-checkboxes
form.querySelectorAll("legend input").forEach((input) => {
  input.addEventListener("change", () => {
    form.querySelectorAll(`input[name="${input.dataset.for}"]`).forEach((child) => child.checked = input.checked)
  })
})
// Manage checkboxes
form.querySelectorAll('input[type="checkbox"]').forEach((input) => {
  if (input.name) {
    input.addEventListener("change", () => {
      const checked = Array.from(form.querySelectorAll(`input[name="${input.name}"]`)).reduce((checked, input) => checked && input.checked, true)
      form.querySelector(`input[data-for="${input.name}"]`).checked = checked
    })
  }
})
// Manage variables
function reset(element) {
  element.querySelectorAll("input[name]").forEach((input) => {
    if ((!input.name) || (input.name.endsWith("@opacity"))) {
      return
    }
    let value = getComputedStyle(element).getPropertyValue(input.name)
    if ((input.type === "color") && (/^#[a-f0-9]{8}$/i.test(value))) {
      const [color, opacity] = [value.slice(0, 7), value.slice(7)]
      value = color
      element.querySelector(`input[name="${input.name}@opacity"]`).value = opacity
      element.querySelector(`input[name="${input.name}@opacity"]`).dataset.default = opacity
    }
    input.value = value
    input.dataset.default = value
  })
}
form.querySelectorAll('.variables button[type="reset"]').forEach((button) =>
  button.addEventListener("click", (event) => {
    event.preventDefault()
    reset(button.closest(".variables"))
  })
)
form.querySelectorAll(".variables").forEach((group) => reset(group))
// Manage preview
const preview = form.querySelector(".preview button")
preview.addEventListener("click", (event) => {
  event.preventDefault()
  const iframe = form.querySelector(".preview iframe")
  iframe.src = "/build/demo"
  iframe.onload = async function () {
    const style = iframe.contentDocument.createElement("style")
    style.innerText = await brew()
    iframe.contentDocument.head.appendChild(style)
  }
})
// Manage brewing
const brewing = form.querySelector(".brewing button")
const teapot = { styling: [], extra: [], variables: [] }
form.addEventListener("change", () => {
  const styling = Array.from(form.querySelectorAll('input[name="styling"]'))
  const extra = Array.from(form.querySelectorAll('input[name="extra"]'))
  const variables = Array.from(form.querySelectorAll(".variables input"))
  Object.assign(teapot, {
    styling: styling.filter(({ checked }) => checked).map(({ value }) => value),
    extra: extra.filter(({ checked }) => checked).map(({ value }) => value),
    variables: variables.filter(({ name, value, dataset }) => (!name.endsWith("@opacity")) && (value !== dataset.default)).map(({ name, value }) => ({ name, value })),
  })
  variables.filter(({ name, value, dataset }) => (name.endsWith("@opacity")) && (value !== dataset.default)).forEach(({ name, value: opacity }) => {
    const color = form.querySelector(`input[name="${name.replace("@opacity", "")}"]`).value
    if (!teapot.variables.find((variable) => variable.name === name.replace("@opacity", ""))) {
      teapot.variables.push({ name: name.replace("@opacity", ""), value: `${color}${opacity}` })
    }
    teapot.variables.find((variable) => variable.name === name.replace("@opacity", "")).value = `${color}${opacity}`
  })
})
async function brew() {
  const custom = form.querySelector('textarea[name="custom"]').value
  const root = await fetch("/styles/@root/mod.css").then((response) => response.text())
  const parts = await Promise.all(
    [...teapot.styling, ...teapot.extra].sort((a, b) => a.localeCompare(b)).map(async (name) => await fetch(`/styles/${name}/mod.css`).then((response) => response.text())),
  )
  if (teapot.variables.length) {
    const [_, defined, computed] = root.match(/^(?<defined>:root\s*\{[\s\S]*?\})(?<computed>[\s\S*]*)$/)
    const stylesheet = new CSSStyleSheet()
    stylesheet.insertRule(defined)
    for (const { name, value } of teapot.variables) {
      stylesheet.rules[0].style.setProperty(name, value)
    }
    parts.unshift(stylesheet.rules[0].cssText, computed)
  } else {
    parts.unshift(root)
  }
  return [banner, ...parts, custom.trim()].join("\n")
}
// Manage brewed download
form.querySelector(".brewing button").addEventListener("click", async (event) => {
  event.preventDefault()
  const minify = false // form.querySelector('input[name="minify"]').checked
  const stylesheet = await brew()
  try {
    brewing.toggleAttribute("disabled", true)
    brewing.style.cursor = "loading"
    let url = URL.createObjectURL(new Blob([new TextEncoder().encode(stylesheet)], { type: "text/css;charset=utf-8" }))
    if (minify) {
      const response = await fetch("/api/brew", { method: "POST", body: stylesheet })
      if (response.status !== 200) {
        throw new Error(await response.text())
      }
      url = URL.createObjectURL(new Blob([await response.blob()], { type: "text/css;charset=utf-8" }))
    }
    globalThis.open(url, "_blank")
  } catch (error) {
    document.querySelector(".brewing-error").classList.remove("hidden")
    document.querySelector(".brewing-error").innerText = error.message
    setTimeout(() => document.querySelector(".brewing-error").classList.add("hidden"), 15 * 1000)
  } finally {
    brewing.toggleAttribute("disabled", false)
    brewing.style.removeProperty("cursor")
  }
})
form.dispatchEvent(new Event("change"))
