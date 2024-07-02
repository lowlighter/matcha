/// <reference lib="dom" />
const prefers = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
const html = document.querySelector("html")
html.dataset.colorScheme = prefers
document.querySelectorAll(`body > header .color-scheme`).forEach((element) => {
  element.querySelector(`svg.${prefers}`).style.display = "inline-block"
  element.addEventListener("click", () => {
    toggleColorScheme(html.dataset, element)
  })
})
document.querySelectorAll(".example-tabs li.color-scheme").forEach((element) => {
  element.querySelector(`svg.${prefers}`).style.display = "inline-block"
  element.addEventListener("click", () => {
    const example = element.parentNode.nextElementSibling
    if (example.tagName === "IFRAME") {
      example.contentWindow.document.documentElement.dataset.colorScheme = (example.contentWindow.document.documentElement.dataset.colorScheme ?? prefers) === "light" ? "dark" : "light"
    }
    toggleColorScheme(example.dataset, element)
  })
})

function toggleColorScheme(dataset, element) {
  dataset.colorScheme = (dataset.colorScheme ?? prefers) === "light" ? "dark" : "light"
  element.querySelector("svg.light").style.display = dataset.colorScheme === "light" ? "inline-block" : "none"
  element.querySelector("svg.dark").style.display = dataset.colorScheme === "dark" ? "inline-block" : "none"
}
