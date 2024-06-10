/// <reference lib="dom" />
const menu = document.currentScript.previousElementSibling
menu.addEventListener("click", (event) => {
  event.preventDefault()
  menu.querySelectorAll("li").forEach((li) => li.classList.remove("selected"))
  let li = event.target.closest("li")
  while (li) {
    li.classList.add("selected")
    li = li.parentElement.closest("li")
  }
})
