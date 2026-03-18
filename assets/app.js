const APP_SHORTNAME = "rme";
const APP_VERSION = "2.3";
const STORAGE_KEY = `${APP_SHORTNAME}_markdown_content_v1`;
const THEME_KEY = "theme"; 

const ICON_PATHS = {
  sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>',
  moon: '<path d="M12 3a6 6 0 1 0 9 9 9 9 0 1 1-9-9"></path>'
};

function renderIcon(iconId, iconName) {
  const icon = document.getElementById(iconId);
  const pathMarkup = ICON_PATHS[iconName];
  if (!icon || !pathMarkup) return;
  icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${pathMarkup}</svg>`;
}

// Initialize Lucide icons
if (typeof lucide !== "undefined") {
  lucide.createIcons();
}

// Theme handling
const themeToggleBtn = document.getElementById("themeToggleBtn");
const hljsTheme = document.getElementById("hljs-theme");

function updateThemeUI() {
  const isDark = document.documentElement.classList.contains("dark");
  renderIcon("themeIcon", isDark ? "sun" : "moon");
  
  if (hljsTheme) {
    hljsTheme.href = isDark 
      ? "https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github-dark.min.css"
      : "https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github.min.css";
  }
}

// Initial UI update for theme
updateThemeUI();

themeToggleBtn?.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  updateThemeUI();
});

// Listen for system theme changes if no explicit preference is set
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!localStorage.getItem(THEME_KEY)) {
    document.documentElement.classList.toggle("dark", e.matches);
    updateThemeUI();
  }
});

const FALLBACK_TEXT = `# RubyJ Markdown Editor

Start writing on the **Editor** tab, switch to **Preview**, then share with compressed URLs.

## Features

- URL-safe compressed content
- Full markdown toolbar and shortcuts
- Auto-save in localStorage
- Fast preview rendering with syntax highlighting`;

// Determine mode from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
let mode = urlParams.get("page") || urlParams.get("mode") || "editor";

// If page/mode is not explicitly editor or preview, default to editor
if (mode !== "editor" && mode !== "preview") {
  mode = "editor";
}

const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const editorPanel = document.getElementById("editorPanel");
const previewPanel = document.getElementById("previewPanel");
const previewOutput = document.getElementById("previewOutput");
const copyEncodedBtn = document.getElementById("copyEncodedBtn");
const openPreviewBtn = document.getElementById("openPreviewBtn");
const openEditorBtn = document.getElementById("openEditorBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const footerVersionText = document.getElementById("footerVersionText");

if (footerVersionText) {
  footerVersionText.textContent = `${APP_SHORTNAME} v${APP_VERSION}`;
}

const footerYearText = document.getElementById("footerYearText");
if (footerYearText) {
  footerYearText.textContent = `© ${new Date().getFullYear()}`;
}

const previewZoomIn = document.getElementById("previewZoomIn");
const previewZoomOut = document.getElementById("previewZoomOut");
const previewZoomLevel = document.getElementById("previewZoomLevel");
const previewFullscreenBtn = document.getElementById("previewFullscreenBtn");
const topbar = document.querySelector(".topbar");
const toolbarActions = topbar?.querySelector(".toolbar-actions");
const MICA_KEY = "editor_mica";
let editorBgToolbarButton = null;

// Mica Toggle Logic
const storedMica = localStorage.getItem(MICA_KEY);
let isMica = storedMica ? storedMica !== "false" && storedMica !== "flat" : true;

function updateMicaUI() {
  const wrapper = document.querySelector(".EasyMDEContainer");
  
  if (isMica) {
    if (wrapper) wrapper.classList.add("editor-mica");
    if (wrapper) wrapper.classList.remove("editor-flat");
    document.body.classList.remove("editor-flat");
  } else {
    if (wrapper) wrapper.classList.add("editor-flat");
    if (wrapper) wrapper.classList.remove("editor-mica");
    document.body.classList.add("editor-flat");
  }
  
  if (editorBgToolbarButton) {
    editorBgToolbarButton.classList.toggle("fa-tint", isMica);
    editorBgToolbarButton.classList.toggle("fa-square", !isMica);
    editorBgToolbarButton.classList.toggle("active", !isMica);
    editorBgToolbarButton.setAttribute("aria-label", isMica ? "Switch to flat white editor background" : "Switch to mica editor background");
    editorBgToolbarButton.setAttribute("title", isMica ? "Switch to Flat White Background" : "Switch to Mica Background");
  }
}

function toggleEditorBackground() {
  isMica = !isMica;
  localStorage.setItem(MICA_KEY, isMica ? "mica" : "flat");
  updateMicaUI();
}

// Initial Mica Update
updateMicaUI();

// Preview Zoom Logic
let currentZoom = 100;

function updateZoom() {
  if (previewOutput) {
    previewOutput.style.fontSize = `${currentZoom}%`;
  }
  if (previewZoomLevel) {
    previewZoomLevel.textContent = `${currentZoom}%`;
  }
}

previewZoomIn?.addEventListener("click", () => {
  currentZoom = Math.min(currentZoom + 10, 200);
  updateZoom();
});

previewZoomOut?.addEventListener("click", () => {
  currentZoom = Math.max(currentZoom - 10, 50);
  updateZoom();
});

function syncPreviewTopbarActions() {
  if (!topbar || !toolbarActions || !previewToolbar) return;
  const shouldFloatWithPreview = document.body.classList.contains("preview-is-fullscreen") && mode === "preview";
  if (shouldFloatWithPreview) {
    if (toolbarActions.parentNode !== previewToolbar) {
      previewToolbar.insertBefore(toolbarActions, previewToolbar.firstChild);
    }
    previewToolbar.classList.add("with-topbar-actions");
    return;
  }
  if (toolbarActions.parentNode !== topbar) {
    topbar.appendChild(toolbarActions);
  }
  previewToolbar.classList.remove("with-topbar-actions");
}

function setPreviewFullscreenState(isFullscreen) {
  document.body.classList.toggle("preview-is-fullscreen", isFullscreen);
  const iconName = isFullscreen ? "minimize" : "maximize";
  const icon = previewFullscreenBtn.querySelector("i");
  if (icon) {
    icon.setAttribute("data-lucide", iconName);
  }
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
  syncPreviewTopbarActions();
}

// Preview Fullscreen Logic
previewFullscreenBtn?.addEventListener("click", () => {
  const isFullscreen = !document.body.classList.contains("preview-is-fullscreen");
  setPreviewFullscreenState(isFullscreen);
});

marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

function parseEncodedFromQuery() {
  const params = new URLSearchParams(window.location.search);
  
  // Prefer explicit content parameter
  if (params.has("content")) {
    return params.get("content");
  }
  
  // Legacy support for ?=... or ?...
  const raw = window.location.search.replace(/^\?/, "");
  if (!raw) {
    return "";
  }
  
  // If raw starts with page= or mode=, we might need to be careful
  // But if content param was missing, we assume no content or legacy format
  if (raw.startsWith("page=") || raw.startsWith("mode=")) {
     // If there are other params but no content, return empty
     if (!raw.includes("&content=") && !raw.includes("?content=")) {
         return "";
     }
  }

  if (raw.startsWith("=")) {
    return raw.slice(1);
  }
  if (raw.includes("=")) {
    // This is tricky. ?page=editor is "raw includes ="
    // We already handled structured params with URLSearchParams.
    // If we are here, it might be ?someLegacyKey=someValue
    // Or it might be the fallback from the old code which took the FIRST value.
    // In the old code:
    // const parsed = new URLSearchParams(window.location.search);
    // const key = Array.from(parsed.keys())[0];
    // return parsed.get(key) || "";
    
    // We should probably NOT do this if we have page=editor.
    // So let's return empty if we detected page/mode params earlier and no content.
    if (params.has("page") || params.has("mode")) return "";

    const key = Array.from(params.keys())[0];
    return params.get(key) || "";
  }
  return raw;
}

// Fullscreen URL param check
if (urlParams.has("fs")) {
  if (mode === "editor") {
    // Editor fullscreen handled by EasyMDE logic later
    window.addEventListener("load", () => {
      setTimeout(() => EasyMDE.toggleFullScreen(editor), 500);
    });
  } else {
    // Preview fullscreen
    document.body.classList.add("preview-is-fullscreen");
  }
}

function decodeContent(encoded) {
  if (!encoded) {
    return "";
  }
  try {
    // Try to decode with base64 compression first (new format)
    const decompressedBase64 = LZString.decompressFromBase64(decodeURIComponent(encoded));
    if (decompressedBase64) return decompressedBase64;
    
    // Fallback to URI component decoding (legacy format)
    return LZString.decompressFromEncodedURIComponent(encoded) || "";
  } catch {
    return "";
  }
}

function encodeContent(content) {
  // Use Base64 compression to significantly decrease character count compared to URI component
  return encodeURIComponent(LZString.compressToBase64(content));
}

const previewToolbar = document.getElementById("previewToolbar");

function updateActiveTab(nextTab) {
  mode = nextTab; // Update global mode state
  
  // Update URL state without reloading
  const url = new URL(window.location);
  url.searchParams.set("page", nextTab);
  window.history.replaceState({}, "", url);

  tabButtons.forEach((button) => {
    const target = button.dataset.tabTarget;
    const active = target === nextTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  
  if (nextTab === "editor") {
    editorPanel.hidden = false;
    previewPanel.hidden = true;
    editorPanel.classList.replace("opacity-0", "opacity-100");
    editorPanel.classList.replace("pointer-events-none", "pointer-events-auto");
    previewPanel.classList.replace("opacity-100", "opacity-0");
    previewPanel.classList.replace("pointer-events-auto", "pointer-events-none");
    
    // Hide Preview Toolbar
    if (previewToolbar) previewToolbar.classList.add("hidden");
    
    // Refresh EasyMDE layout
    setTimeout(() => {
      editor.codemirror.refresh();
      editor.codemirror.focus();
    }, 50);
  } else {
    editorPanel.hidden = true;
    previewPanel.hidden = false;
    previewPanel.classList.replace("opacity-0", "opacity-100");
    previewPanel.classList.replace("pointer-events-none", "pointer-events-auto");
    editorPanel.classList.replace("opacity-100", "opacity-0");
    editorPanel.classList.replace("pointer-events-auto", "pointer-events-none");
    
    // Show Preview Toolbar
    if (previewToolbar) previewToolbar.classList.remove("hidden");
  }
  syncPreviewTopbarActions();
}

function renderMarkdown(text) {
  const unsafe = marked.parse(text || "");
  const safe = DOMPurify.sanitize(unsafe, {
    USE_PROFILES: { html: true }
  });
  previewOutput.innerHTML = safe;
  previewOutput.querySelectorAll("pre code").forEach((block) => hljs.highlightElement(block));
}

function saveLocal(text) {
  localStorage.setItem(STORAGE_KEY, text);
}

function getInitialContent() {
  const queryEncoded = parseEncodedFromQuery();
  const decoded = decodeContent(queryEncoded);
  if (decoded) {
    saveLocal(decoded);
    return decoded;
  }
  return localStorage.getItem(STORAGE_KEY) || FALLBACK_TEXT;
}

const editor = new EasyMDE({
  element: document.getElementById("markdownInput"),
  spellChecker: false,
  autofocus: mode === "editor",
  status: ["lines", "words", "cursor"],
  autosave: {
    enabled: false
  },
  minHeight: "100%",
  placeholder: "Write markdown...",
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: false // Disable highlighting in editor to keep it plain
  },
  toolbar: [
    "bold",
    "italic",
    "strikethrough",
    "|",
    "heading-1",
    "heading-2",
    "heading-3",
    "|",
    "quote",
    "unordered-list",
    "ordered-list",
    "|",
    "link",
    "image",
    "table",
    "code",
    "horizontal-rule",
    "|",
    "preview",
    "side-by-side",
    {
      name: "fullscreen",
      action: EasyMDE.toggleFullScreen,
      className: "fa fa-arrows-alt no-disable no-mobile",
      title: "Toggle Fullscreen",
    },
    {
      name: "toggle-editor-bg",
      action: () => toggleEditorBackground(),
      className: "fa fa-tint no-disable no-mobile",
      title: "Switch to Flat White Background",
    },
    "|",
    "undo",
    "redo",
    "|",
    "guide"
  ]
});

// Initial Mica Update (after editor init so wrapper exists)
setTimeout(() => {
  editorBgToolbarButton = document.querySelector(".editor-toolbar .fa-tint, .editor-toolbar .fa-square");
  updateMicaUI();
}, 100);

// Fullscreen state handler to manage our custom UI override
editor.codemirror.on("refresh", () => {
  if (editor.isFullscreenActive()) {
    document.body.classList.add("editor-is-fullscreen");
    // Move status bar into topbar when in fullscreen
    const topbar = document.querySelector(".topbar");
    const statusBar = document.querySelector(".editor-statusbar");
    if (topbar && statusBar && statusBar.parentNode !== topbar) {
      topbar.appendChild(statusBar);
    }
  } else {
    document.body.classList.remove("editor-is-fullscreen");
    // Move status bar back to EasyMDE container when not in fullscreen
    const mdeContainer = document.querySelector(".EasyMDEContainer");
    const statusBar = document.querySelector(".editor-statusbar");
    if (mdeContainer && statusBar && statusBar.parentNode !== mdeContainer) {
      mdeContainer.appendChild(statusBar);
    }
  }
  
  // Re-initialize Lucide icons on EasyMDE render
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});

editor.value(getInitialContent());
renderMarkdown(editor.value());

let renderTimer = null;
editor.codemirror.on("change", () => {
  const value = editor.value();
  saveLocal(value);
  if (renderTimer) {
    window.clearTimeout(renderTimer);
  }
  renderTimer = window.setTimeout(() => renderMarkdown(value), 80);
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateActiveTab(button.dataset.tabTarget);
  });
});

// Set initial tab based on mode
updateActiveTab(mode);
setPreviewFullscreenState(document.body.classList.contains("preview-is-fullscreen"));

function setButtonLabel(button, label) {
  if (!button) return;
  const labelElement = button.querySelector("span");
  if (labelElement) {
    labelElement.textContent = label;
    return;
  }
  button.textContent = label;
}

copyEncodedBtn?.addEventListener("click", async () => {
  const encoded = encodeContent(editor.value());
  const origin = window.location.origin;
  const isFs = document.body.classList.contains("editor-is-fullscreen") || document.body.classList.contains("preview-is-fullscreen");
  
  // New URL format: /?page={mode}&content={encoded}
  const shareUrl = `${origin}/?page=${mode}&content=${encoded}${isFs ? "&fs=1" : ""}`;
  
  await navigator.clipboard.writeText(shareUrl);
  setButtonLabel(copyEncodedBtn, "Copied URL!");
  window.setTimeout(() => {
    setButtonLabel(copyEncodedBtn, "Copy Link");
  }, 2000);
});

openPreviewBtn?.addEventListener("click", () => {
  updateActiveTab("preview");
});

openEditorBtn?.addEventListener("click", () => {
  updateActiveTab("editor");
});

saveBtn?.addEventListener("click", () => {
  saveLocal(editor.value());
  setButtonLabel(saveBtn, "Saved");
  window.setTimeout(() => {
    setButtonLabel(saveBtn, "Save");
  }, 1000);
});

clearBtn?.addEventListener("click", () => {
  editor.value("");
  renderMarkdown("");
  saveLocal("");
});
