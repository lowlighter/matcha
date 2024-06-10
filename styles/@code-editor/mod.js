/// <reference lib="dom" />
const editor = document.currentScript.previousElementSibling
const textarea = editor.querySelector("textarea")
const highlight = editor.querySelector(".highlight")
textarea.addEventListener("input", () => coloration(textarea.value))
textarea.addEventListener("scroll", function () {
  highlight.scrollTop = this.scrollTop
  highlight.scrollLeft = this.scrollLeft
})
function coloration(value) {
  highlight.innerHTML = hljs.highlight(value, { language: "typescript" }).value
}
coloration(textarea.value)
