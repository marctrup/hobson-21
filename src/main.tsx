import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootEl = document.getElementById("root")!

// Prerendered snapshots (public/<route>/index.html) already show the finished
// page. createRoot would wipe them and briefly show the loading spinner while
// the page's code downloads — a visible flash. Keep the snapshot on top as a
// frozen shell until React has rendered the real page, then remove it.
let shell: HTMLDivElement | null = null
if (rootEl.querySelector("h1") && !rootEl.querySelector("[data-static-summary]")) {
  shell = document.createElement("div")
  shell.setAttribute("aria-hidden", "true")
  shell.style.cssText =
    "position:absolute;top:0;left:0;right:0;z-index:2147483646;pointer-events:none;background:hsl(var(--background,0 0% 100%))"
  while (rootEl.firstChild) shell.appendChild(rootEl.firstChild)
  document.body.appendChild(shell)

  const removeShell = () => {
    if (!shell) return
    observer.disconnect()
    shell.remove()
    shell = null
  }
  const observer = new MutationObserver(() => {
    if (rootEl.querySelector("h1")) requestAnimationFrame(() => requestAnimationFrame(removeShell))
  })
  observer.observe(rootEl, { childList: true, subtree: true })
  setTimeout(removeShell, 4000)
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
)
