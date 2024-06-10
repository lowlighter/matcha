/// <reference lib="dom" />
const dialog = document.currentScript.previousElementSibling
dialog.querySelector('[type="button"]').addEventListener("click", (event) => {
  event.preventDefault()
  dialog.close()
  dialog.style = "position: fixed;"
  dialog.showModal()
})
dialog.querySelector('[type="submit"]').addEventListener("click", (event) => {
  event.preventDefault()
  dialog.close()
  dialog.style = "position: relative;"
  dialog.show()
})
