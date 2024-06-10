/// <reference lib="dom" />
document.currentScript.previousElementSibling.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", (event) => event.preventDefault())
})
