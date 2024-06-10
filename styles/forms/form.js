/// <reference lib="dom" />
document.currentScript.previousElementSibling.addEventListener("reset", (event) => {
  event.preventDefault()
  const dialog = document.createElement("dialog")
  dialog.classList.add("easter-egg")
  dialog.innerHTML = `
    <header>
      <h1 class="danger">fa[T]al error</h1>
    </header>
<pre>
<b>Commencing System Check</b>
<b>Vitals:</b> <span class="danger">Unknown</span>
<b>Black Box Temperature:</b> <span class="danger">Unknown</span>
<b>Remaining Energy:</b> <span class="danger">Unknown</span>
<b class="danger">System Check Failed</b>
</pre>
    <footer>
      <form method="dialog">
        <button class="severe">Restore system ?</button>
      </form>
    </footer>
  `
  document.body.appendChild(dialog)
  const background = document.createElement("div")
  background.classList.add("easter-egg", "glitch", "background")
  for (let i = 0; i < 25; i++) {
    const artifact = document.createElement("div")
    artifact.classList.add("easter-egg", "glitch", Math.random() > .5 ? "red" : "blue")
    artifact.style.width = `${1 + Math.ceil(Math.random() * 70)}%`
    artifact.style.height = `${1 + Math.ceil(Math.random() * 70)}%`
    artifact.style.top = `${-70 + Math.ceil(Math.random() * 170)}%`
    artifact.style.left = `${-70 + Math.ceil(Math.random() * 170)}%`
    artifact.style.animationDelay = `${5 * Math.random()}s`
    background.appendChild(artifact)
  }
  document.body.appendChild(background)
  dialog.addEventListener("close", (_) => {
    document.querySelectorAll(".easter-egg.glitch").forEach((element) => element.remove())
  })
  dialog.showModal()
})
