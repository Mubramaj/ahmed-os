import { Controller } from "@hotwired/stimulus"

// Skippable entry challenge + optional manual reopen (keyboard shortcut).
//
// First visit: overlay shows until solved or skipped; state is stored in
// localStorage. After that, visitors can reopen the terminal anytime with
// Ctrl+` (Windows/Linux) or Cmd+` / Ctrl+` on macOS — similar to IDE
// terminal toggles. The shortcut is ignored while typing in form fields.

// Must stay in sync with `app/views/shared/_intro.html.erb` boot lines.
const INTRO_INITIAL_HTML = `
<p class="intro__line"><span class="intro__prompt">$</span> boot personal-os</p>
<p class="intro__line intro__line--muted">A small entry challenge. Type <code>help</code> for commands, or click skip.</p>
<p class="intro__line intro__line--muted">Tip: reopen anytime with <kbd class="intro__kbd">Ctrl</kbd>+<kbd class="intro__kbd">\`</kbd> or <kbd class="intro__kbd">⌘</kbd>+<kbd class="intro__kbd">\`</kbd>. <kbd class="intro__kbd">Esc</kbd> closes.</p>
`.trim()

export default class extends Controller {
  static targets = ["screen", "input"]
  static values = { storageKey: { type: String, default: "ahmed-os.intro.v1" } }

  static ENTER_COMMANDS = ["enter", "open", "start", "boot", "go"]

  connect() {
    this.#onGlobalKeydown = this.#handleGlobalKeydown.bind(this)
    window.addEventListener("keydown", this.#onGlobalKeydown, true)

    if (this.#alreadyCleared()) {
      this.#hide()
      return
    }

    this.#show()
    requestAnimationFrame(() => this.inputTarget?.focus())
  }

  disconnect() {
    window.removeEventListener("keydown", this.#onGlobalKeydown, true)
  }

  submit(event) {
    event.preventDefault()
    const raw = (this.inputTarget.value || "").trim().toLowerCase()
    this.inputTarget.value = ""

    if (!raw) return

    this.#echo(raw)

    switch (raw) {
      case "help":
      case "?":
        this.#print("commands available: help, whoami, open, enter, skip")
        break
      case "whoami":
        this.#print("guest@ahmed-os :: visitor")
        break
      case "skip":
        this.skip()
        break
      default:
        if (this.constructor.ENTER_COMMANDS.includes(raw)) {
          this.#print("access granted. welcome.")
          this.#unlock()
        } else {
          this.#print(`unknown command: ${raw}. try "help".`, true)
        }
    }
  }

  skip() {
    this.#unlock()
  }

  #unlock() {
    this.#remember()
    this.element.classList.add("intro--leaving")
    setTimeout(() => this.#hide(), 280)
  }

  #show() {
    this.element.removeAttribute("hidden")
  }

  #hide() {
    this.element.setAttribute("hidden", "")
    this.element.classList.remove("intro--leaving")
  }

  #echo(text) {
    this.#append(`<p class="intro__line"><span class="intro__prompt">$</span> ${this.#escape(text)}</p>`)
  }

  #print(text, isError = false) {
    const cls = isError ? "intro__line intro__line--error" : "intro__line intro__line--muted"
    this.#append(`<p class="${cls}">${this.#escape(text)}</p>`)
  }

  #append(html) {
    if (!this.hasScreenTarget) return
    this.screenTarget.insertAdjacentHTML("beforeend", html)
    this.screenTarget.scrollTop = this.screenTarget.scrollHeight
  }

  #escape(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  #alreadyCleared() {
    try {
      return window.localStorage.getItem(this.storageKeyValue) === "1"
    } catch {
      return true
    }
  }

  #remember() {
    try {
      window.localStorage.setItem(this.storageKeyValue, "1")
    } catch {
      // Ignore storage failures; the challenge is not security.
    }
  }

  // Ctrl/Cmd + backtick — reopen terminal from anywhere on the public site.
  #handleGlobalKeydown(event) {
    if (this.#isTypingInField(event.target)) return

    if (event.key === "Escape" && !this.element.hasAttribute("hidden")) {
      event.preventDefault()
      this.skip()
      return
    }

    if (!this.#isTerminalShortcut(event)) return

    event.preventDefault()

    if (!this.element.hasAttribute("hidden")) {
      this.#resetScreen()
      requestAnimationFrame(() => this.inputTarget?.focus())
      return
    }

    this.element.classList.remove("intro--leaving")
    this.#resetScreen()
    this.#show()
    requestAnimationFrame(() => this.inputTarget?.focus())
  }

  #isTerminalShortcut(event) {
    if (event.repeat || event.altKey) return false
    if (event.code !== "Backquote") return false
    return event.ctrlKey || event.metaKey
  }

  #isTypingInField(node) {
    if (!node || typeof node.closest !== "function") return false
    if (node.isContentEditable) return true
    const el = node.closest("input, textarea, select, [contenteditable='true']")
    return Boolean(el)
  }

  #resetScreen() {
    if (!this.hasScreenTarget) return
    this.screenTarget.innerHTML = INTRO_INITIAL_HTML
    if (this.hasInputTarget) this.inputTarget.value = ""
  }
}
