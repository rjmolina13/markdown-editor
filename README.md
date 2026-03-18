<a name="readme-top"></a>

[![Version][version-shield]][version-url]
[![HTML][html-shield]][html-url]
[![JavaScript][js-shield]][js-url]
[![CSS][css-shield]][css-url]

<div align="center">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="RubyJ Markdown Editor Icon">
    <path d="M6 3h12l4 6-10 13L2 9Z"></path>
  </svg>
  <h1>RubyJ Markdown Editor</h1>
  <p><strong>rme v1.0.0</strong></p>
  <p>
    A polished browser-based Markdown editor with split workflow, fullscreen floating controls,
    URL-safe compressed sharing, and a live rendered preview.
  </p>
</div>

## Table of Contents

- [About](#about)
- [Features](#features)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contact](#contact)

## About

RubyJ Markdown Editor is a lightweight single-page Markdown app focused on fast writing and quick sharing.
It keeps your content locally, lets you jump between Editor and Preview tabs, and supports fullscreen workflows in both modes.

## Features

- Rich Markdown writing experience powered by EasyMDE
- Instant Preview rendering with marked + DOMPurify + highlight.js
- Shareable URL generation using compressed encoded content
- Editor and Preview fullscreen modes with floating action bars
- Preview zoom controls and fullscreen control in one toolbar
- Light/Dark theme toggle and editor background mode toggle
- Local autosave using browser storage

## Built With

- HTML5
- CSS3
- JavaScript (Vanilla)
- EasyMDE
- marked
- DOMPurify
- highlight.js
- LZString
- Tailwind CSS (CDN)
- Lucide Icons

## Getting Started

### Prerequisites

- Modern browser (Chrome, Edge, Safari, or Firefox)
- Python 3 (only needed for local static hosting)

### Run Locally

```bash
git clone https://github.com/rjmolina13/MarkdownPreviewEditor.git
cd MarkdownPreviewEditor
python3 -m http.server 4174
```

Open:

```text
http://localhost:4174/
```

## Usage

- Write Markdown in the **Editor** tab
- Switch to **Preview** to inspect final output
- Use **Copy Link** to generate a compressed URL with content
- Toggle fullscreen in Editor or Preview for distraction-free mode
- Use Preview zoom controls to increase or decrease reading size

## Project Structure

```text
MarkdownPreviewEditor/
├── assets/
│   ├── app.js
│   └── styles.css
├── index.html
└── README.md
```

## Roadmap

- Add repository screenshots and GIF demos
- Add tests for URL encoding/decoding and tab/fullscreen state
- Add build/release workflow for versioned tags
- Add LICENSE and contribution guide

## Contact

RubyJ - [@rjmolina13](https://github.com/rjmolina13)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[version-shield]: https://img.shields.io/badge/version-1.0.0-blue.svg
[version-url]: https://github.com/rjmolina13/MarkdownPreviewEditor/releases
[html-shield]: https://img.shields.io/badge/html5-ready-orange.svg
[html-url]: https://developer.mozilla.org/en-US/docs/Web/HTML
[js-shield]: https://img.shields.io/badge/javascript-vanilla-f7df1e.svg
[js-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[css-shield]: https://img.shields.io/badge/css3-styled-264de4.svg
[css-url]: https://developer.mozilla.org/en-US/docs/Web/CSS
