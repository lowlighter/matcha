/// <reference lib="dom" />
const form = document.currentScript.parentElement.querySelector("form")
const iframe = document.currentScript.parentElement.querySelector("iframe")
form.addEventListener("submit", (event) => {
  event.preventDefault()
  iframe.src = `/api/preview?url=${form.querySelector("input").value}`
  iframe.onload = function () {
    iframe.contentDocument.querySelectorAll("style,script").forEach((element) => element.remove())
    const link = iframe.contentDocument.createElement("link")
    link.href = "/matcha.css"
    link.rel = "stylesheet"
    iframe.contentDocument.head.appendChild(link)
  }
})
