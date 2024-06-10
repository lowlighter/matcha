/// <reference lib="dom" />
const prefers = matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light"
document.querySelectorAll(".example-tabs li.color-scheme").forEach((element) => {
  element.querySelector(`svg.${prefers}`).style.display = "inline-block"
  element.addEventListener("click", (_) => {
    const example = element.parentNode.nextElementSibling
    if (example.tagName === "IFRAME") {
      example.contentWindow.document.documentElement.dataset.colorScheme = (example.contentWindow.document.documentElement.dataset.colorScheme ?? prefers) === "light" ? "dark" : "light"
    }
    example.dataset.colorScheme = (example.dataset.colorScheme ?? prefers) === "light" ? "dark" : "light"
    element.querySelector("svg.light").style.display = example.dataset.colorScheme === "light" ? "inline-block" : "none"
    element.querySelector("svg.dark").style.display = example.dataset.colorScheme === "dark" ? "inline-block" : "none"
  })
})
