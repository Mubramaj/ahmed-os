import { Controller } from "@hotwired/stimulus"

// ahmed-os entry terminal — boot sequence + fake shell challenge.
//
// First visit: overlay shows, runs a fake dmesg boot, then drops into a
// minimal shell. The unlock is: ./enter.sh → Permission denied → sudo ./enter.sh.
// State persisted in localStorage (v2). Reopen any time with Ctrl/Cmd+`.

const PROMPT = "ahmed@ahmed-os:~$"

// Fake kernel boot lines shown sequentially before the shell appears.
const BOOT_LINES = [
  "[    0.000000] Linux version 6.8.0-ahmed-os #1 SMP x86_64",
  "[    0.218441] Initializing cgroup subsys cpuset",
  "[    0.431002] ACPI: Core revision 20240827",
  "[    0.887552] Mounting /dev/sda1... OK",
  "[    1.104910] Mounting /home/ahmed... OK",
  "[    1.447831] Starting system services... OK",
  "[    2.001203] ahmed-os tty1",
  "[    2.001204] ahmed-os login: ahmed (automatic)",
]

// Message of the day printed after boot, before input is enabled.
const MOTD_LINES = [
  "Welcome to ahmed-os 1.0.0 LTS (GNU/Linux 6.8.0-ahmed x86_64)",
  "",
  "Last login: Thu Apr 30 2026 from 127.0.0.1",
  'Type "ls" to look around.',
]

// Fake home directory contents accessible via cat.
const FS = {
  "README":   "Boot sequence complete.\nRun ./enter.sh to proceed.",
  "enter.sh": "#!/bin/bash\necho 'Permission denied. Hint: try sudo.'",
  ".profile": "# ~/.profile — loaded by bash for login shells.\n# Hint: sudo ./enter.sh",
}

// Printed once when sudo is first invoked.
const SUDO_LECTURE = [
  "We trust you have received the usual lecture from the local System",
  "Administrator. It usually boils down to these three things:",
  "",
  "    #1) Respect the privacy of others.",
  "    #2) Think before you type.",
  "    #3) With great power comes great responsibility.",
]

const FAKE_HISTORY = [
  "    1  uname -a",
  "    2  ls -la",
  "    3  cat README",
  "    4  ./enter.sh",
  "    5  sudo ./enter.sh",
]

export default class extends Controller {
  static targets = ["screen", "input"]
  static values  = { storageKey: { type: String, default: "ahmed-os.intro.v2" } }

  // Bound global listener reference — must be a private field for clean removal.
  #onGlobalKeydown = null

  // Tracks pending boot timeouts so stale ones can be cancelled on reopen.
  #pendingTimers = []

  #hasBooted       = false  // true after first boot completes
  #shellReady      = false  // gates submit() so nothing fires mid-boot
  #sudoLectureDone = false  // show the lecture only once per session

  connect() {
    this.#onGlobalKeydown = this.#handleGlobalKeydown.bind(this)
    window.addEventListener("keydown", this.#onGlobalKeydown, true)

    if (this.#alreadyCleared()) { this.#hide(); return }

    this.#show()
    this.#runBootSequence()
  }

  disconnect() {
    this.#cancelTimers()
    if (this.#onGlobalKeydown) {
      window.removeEventListener("keydown", this.#onGlobalKeydown, true)
      this.#onGlobalKeydown = null
    }
  }

  // Called by the form submit action.
  submit(event) {
    event.preventDefault()
    if (!this.#shellReady) return

    const raw = (this.inputTarget.value || "").trim()
    this.inputTarget.value = ""
    if (!raw) return

    this.#echo(raw)
    this.#handleCommand(raw)
  }

  // Called by the skip button and Escape key.
  skip() { this.#unlock() }

  // ── Shell command dispatcher ──────────────────────────────────────────────

  #handleCommand(raw) {
    const cmd = raw.toLowerCase()

    if (cmd === "help" || cmd === "?") {
      this.#print("commands: help, ls [-la|-a], cat <file>, pwd, whoami, uname [-a], echo, man, history, clear, sudo ./enter.sh")
      return
    }
    if (cmd === "ls")              { this.#print("README  enter.sh"); return }
    if (cmd === "ls -la" || cmd === "ls -al") { this.#printRaw(this.#lsLong()); return }
    if (cmd === "ls -a")           { this.#print("README  enter.sh  .profile"); return }
    if (cmd === "pwd")             { this.#print("/home/ahmed"); return }
    if (cmd === "whoami")          { this.#print("ahmed"); return }
    if (cmd === "uname")           { this.#print("Linux"); return }
    if (cmd === "uname -a")        { this.#print("Linux ahmed-os 6.8.0-ahmed #1 SMP Thu Apr 30 2026 x86_64 GNU/Linux"); return }
    if (cmd === "history")         { FAKE_HISTORY.forEach(l => this.#print(l)); return }
    if (cmd === "clear")           { this.screenTarget.innerHTML = ""; return }
    if (cmd === "./enter.sh" || cmd === "bash enter.sh") {
      this.#print("bash: ./enter.sh: Permission denied")
      return
    }
    if (cmd === "sudo" || cmd === "sudo --help") {
      this.#print("usage: sudo <command>")
      return
    }
    if (cmd === "sudo !!" || cmd === "sudo -i" || cmd === "sudo su") {
      this.#print("sudo: nice try.")
      return
    }
    if (cmd === "sudo ./enter.sh" || cmd === "sudo enter.sh" || cmd === "sudo enter") {
      this.#runSudo()
      return
    }
    if (cmd.startsWith("echo ")) {
      this.#print(raw.slice(5))
      return
    }
    if (cmd.startsWith("man ")) {
      this.#print(`No manual entry for ${this.#escape(raw.slice(4).trim())}. You're on your own.`)
      return
    }
    if (cmd.startsWith("cat ")) {
      const filename = cmd.slice(4).trim().replace(/^\.\//, "")
      const key = Object.keys(FS).find(k => k.toLowerCase() === filename)
      if (key) { this.#printMultiline(FS[key]) }
      else     { this.#print(`cat: ${this.#escape(filename)}: No such file or directory`, "error") }
      return
    }

    this.#print(`bash: ${this.#escape(raw)}: command not found`, "error")
  }

  // Simulate sudo: lecture → password prompt → access granted → unlock.
  #runSudo() {
    if (!this.#sudoLectureDone) {
      this.#sudoLectureDone = true
      SUDO_LECTURE.forEach(l => this.#print(l || "\u00a0", "muted"))
    }
    this.#print("[sudo] password for ahmed: ••••••••")
    this.#shellReady = false

    const id = setTimeout(() => {
      this.#print("access granted.")
      this.#print("welcome, ahmed. loading ahmed-os...", "success")
      this.#unlock()
    }, 700)
    this.#pendingTimers.push(id)
  }

  // ── Boot sequence ─────────────────────────────────────────────────────────

  #runBootSequence() {
    this.#cancelTimers()
    this.#shellReady = false
    this.inputTarget.disabled = true
    this.screenTarget.innerHTML = ""

    let delay = 0

    BOOT_LINES.forEach(line => {
      delay += 80 + Math.random() * 100
      const id = setTimeout(() => this.#printBoot(line), delay)
      this.#pendingTimers.push(id)
    })

    MOTD_LINES.forEach(line => {
      delay += 180
      const id = setTimeout(() => this.#print(line || "\u00a0"), delay)
      this.#pendingTimers.push(id)
    })

    const id = setTimeout(() => this.#enableShell(), delay + 160)
    this.#pendingTimers.push(id)
  }

  #enableShell() {
    this.#hasBooted   = true
    this.#shellReady  = true
    this.inputTarget.disabled = false
    requestAnimationFrame(() => this.inputTarget?.focus())
  }

  // ── Screen helpers ────────────────────────────────────────────────────────

  // Echo the user's typed command back with the shell prompt prefix.
  #echo(text) {
    this.#append(`<p class="intro__line"><span class="intro__prompt">${PROMPT}</span> ${this.#escape(text)}</p>`)
  }

  // Print a plain output line with an optional variant (muted, error, success).
  #print(text, variant = "") {
    const cls = variant ? `intro__line intro__line--${variant}` : "intro__line"
    this.#append(`<p class="${cls}">${this.#escape(text)}</p>`)
  }

  // Print pre-built HTML (only used for internal, safe content).
  #printRaw(html) {
    this.#append(html)
  }

  // Print a multi-line string split on newlines.
  #printMultiline(text) {
    text.split("\n").forEach(line => this.#print(line || "\u00a0", "muted"))
  }

  // Print a dmesg-style boot line; highlights trailing " OK" in green.
  #printBoot(line) {
    const safe = this.#escape(line).replace(/ OK$/, ' <span class="intro__ok">OK</span>')
    this.#append(`<p class="intro__line intro__line--boot">${safe}</p>`)
  }

  #append(html) {
    if (!this.hasScreenTarget) return
    this.screenTarget.insertAdjacentHTML("beforeend", html)
    this.screenTarget.scrollTop = this.screenTarget.scrollHeight
  }

  #escape(text) {
    const div = document.createElement("div")
    div.textContent = String(text)
    return div.innerHTML
  }

  // ── ls -la output (safe, hardcoded) ──────────────────────────────────────

  #lsLong() {
    const rows = [
      "total 16",
      "drwxr-xr-x 2 ahmed ahmed 4096 Apr 30 12:00 .",
      "drwxr-xr-x 8 root  root  4096 Apr 30 12:00 ..",
      "-rw-r--r-- 1 ahmed ahmed  156 Apr 30 12:00 .profile",
      "-rw-r--r-- 1 ahmed ahmed   48 Apr 30 12:00 README",
      "-rwxr-xr-x 1 ahmed ahmed   72 Apr 30 12:00 enter.sh",
    ]
    return rows.map(r => `<p class="intro__line intro__line--muted">${r}</p>`).join("")
  }

  // ── Persistence ───────────────────────────────────────────────────────────

  #alreadyCleared() {
    try   { return window.localStorage.getItem(this.storageKeyValue) === "1" }
    catch { return true }
  }

  #remember() {
    try   { window.localStorage.setItem(this.storageKeyValue, "1") }
    catch { /* storage failures are non-fatal; the challenge is not security */ }
  }

  // ── Overlay lifecycle ─────────────────────────────────────────────────────

  #unlock() {
    this.#remember()
    this.element.classList.add("intro--leaving")
    setTimeout(() => this.#hide(), 280)
  }

  #show() { this.element.removeAttribute("hidden") }

  #hide() {
    this.element.setAttribute("hidden", "")
    this.element.classList.remove("intro--leaving")
  }

  // ── Timer management ──────────────────────────────────────────────────────

  #cancelTimers() {
    this.#pendingTimers.forEach(clearTimeout)
    this.#pendingTimers = []
  }

  // ── Global keyboard shortcuts ─────────────────────────────────────────────

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
      // Already open: reset to a fresh shell (skip re-boot after first visit).
      this.#resetScreen()
      requestAnimationFrame(() => this.inputTarget?.focus())
      return
    }

    this.element.classList.remove("intro--leaving")
    this.#resetScreen()
    this.#show()
    requestAnimationFrame(() => this.inputTarget?.focus())
  }

  // Ctrl/Cmd + backtick — same shortcut as IDE terminal toggles.
  #isTerminalShortcut(event) {
    if (event.repeat || event.altKey) return false
    if (event.code !== "Backquote") return false
    return event.ctrlKey || event.metaKey
  }

  #isTypingInField(node) {
    if (!node || typeof node.closest !== "function") return false
    if (node.isContentEditable) return true
    return Boolean(node.closest("input, textarea, select, [contenteditable='true']"))
  }

  // On reopen: replay the full boot only on the very first visit;
  // after that, skip straight to the shell.
  #resetScreen() {
    this.#cancelTimers()
    this.screenTarget.innerHTML = ""
    this.inputTarget.value = ""
    this.#shellReady = false

    if (this.#hasBooted) {
      MOTD_LINES.forEach(l => this.#print(l || "\u00a0"))
      this.#enableShell()
    } else {
      this.#runBootSequence()
    }
  }
}
