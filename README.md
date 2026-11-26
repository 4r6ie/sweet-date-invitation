<div align="center">

# 💖 Will You Say Yes?

**A romantic, interactive date-invitation website.**
Ask the question, plan the date, and celebrate the answer — all in one page.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-ff6b8a.svg)](./LICENSE)

[Live demo](#-live-demo) · [Features](#-features) · [Quick start](#-quick-start) · [Customize](#-customization) · [Deploy](#-deployment)

</div>

---

## 📖 Overview

**Will You Say Yes?** is a tiny, self-contained web app that turns a date invitation into a small
romantic journey. There is no backend, no database and no tracking — just a five-step experience
that runs entirely in the browser.

The playful twist: the **"NO" button runs away**. It teleports whenever the cursor (or a finger, on
mobile) gets close, cycling through cheeky phrases until the only sensible choice left is **YES 💗**.

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌─────────────┐
│ Greeting │ →  │ Question │ →  │   Time   │ →  │   Food   │ →  │ Celebration │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └─────────────┘
   "To My        Will you        Pick the        Choose the       Confetti,
  Favorite       go out         perfect         date treat       hearts, summary,
   Person"       with me?       moment          (incl. "AKO      WhatsApp confirm,
                                                  NALANG?")       replay
```

## ✨ Live demo

> **Coming online at:** <https://4r6ie.github.io/sweet-date-invitation/>
>
> The repo ships with a GitHub Actions workflow (`.github/workflows/deploy.yml`). Enable
> **Settings → Pages → Source: GitHub Actions** and the site deploys on every push to `main`.

## 🎯 Features

| | Feature | Details |
|---|---------|---------|
| 💌 | **Five-step journey** | Greeting → Question → Time → Food → Celebration, driven by a simple state machine in `src/App.tsx` |
| ⌨️ | **Typewriter question** | The invitation types itself out character by character before revealing the buttons |
| 🏃 | **Evasive "NO" button** | Uses a 50-candidate collision-safe placement algorithm, pointer/touch proximity detection, portal rendering and viewport clamping — it is *never* possible to click it |
| ⏰ | **Time picker** | Four curated slots (morning, afternoon, golden hour, dinner) plus a free-text "Other" option |
| 🍽️ | **Food picker** | Milk tea, burger, and the fan-favourite *"AKO NALANG? HAHAHA ❤️"* — with hand-drawn inline SVG art |
| 🎉 | **Celebration screen** | Canvas confetti (circles, rectangles and hearts), floating heart background, and a cute date-summary card |
| 💬 | **WhatsApp confirmation** | One tap opens WhatsApp with the chosen time and food pre-filled, ready to send |
| 🎵 | **Original ambient music** | A 26.7 s seamless piano loop synthesized from scratch by `scripts/generate-theme.mjs` — no third-party audio, no licensing issues |
| 🔁 | **Replay** | Restart the whole invitation with one click |
| ♿ | **Accessible** | `aria-label`s, visible focus rings, and a `prefers-reduced-motion` switch that disables all animation |

## 🛠 Tech stack

| Layer | Choice |
|-------|--------|
| UI | React 19 (function components + hooks) |
| Language | TypeScript 7, `strict` mode, `noUnusedLocals` / `noUnusedParameters` |
| Build | Vite 8 with `@vitejs/plugin-react` |
| Styling | Plain CSS custom properties + component-level inline styles, glassmorphism, Google Fonts (Inter + Playfair Display) |
| Graphics | Canvas 2D (confetti) and inline SVG (illustrations, icons) |
| Audio | Web Audio via a plain `HTMLAudioElement`, plus a Node script that synthesizes a WAV |
| Tooling | `tsc --noEmit` for type-checking, no test framework, no state library |

## 📂 Project structure

```
sweet-date-invitation/
├─ index.html                  # Entry HTML, favicon, Google Fonts
├─ src/
│  ├─ main.tsx                 # React root
│  ├─ App.tsx                  # Screen state machine (greeting → celebration)
│  ├─ style.css                # Palette, layout, keyframes, reduced-motion
│  └─ components/
│     ├─ Greeting.tsx          # Opening screen (auto-advances after 4s)
│     ├─ QuestionScreen.tsx    # Typewriter question + button reveal
│     ├─ YesButton.tsx         # Primary CTA
│     ├─ EvasiveNoButton.tsx   # The un-clickable "NO" button
│     ├─ TimeSelection.tsx     # Step 2 — time slots + custom input
│     ├─ FoodSelection.tsx     # Step 3 — food cards with SVG art
│     ├─ Celebration.tsx       # Step 4 — confetti, summary, WhatsApp link
│     ├─ ReplayButton.tsx      # Restart the experience
│     └─ MusicToggle.tsx       # Ambient music player + volume slider
├─ public/audio/
│  ├─ sweet-love-theme.wav     # Generated original soundtrack (26.7s loop)
│  └─ README.md                # How the track is made
├─ scripts/generate-theme.mjs  # WAV synthesizer (piano, pads, bells, reverb)
├─ .github/
│  ├─ workflows/
│  │  ├─ deploy.yml            # GitHub Pages deployment
│  │  ├─ secret-scan.yml       # gitleaks secret scanning
│  │  └─ dependency-audit.yml  # npm audit on a weekly schedule
│  └─ dependabot.yml           # Weekly dependency update PRs
├─ .gitleaks.toml              # Secret-scan rules and allowlist
├─ SECURITY.md                 # Security model and reporting policy
├─ netlify.toml                # Netlify build + SPA redirect
├─ vercel.json                 # Vercel rewrites + cache headers
└─ vite.config.ts              # Relative base, so sub-path hosting works
```

## 🚀 Quick start

**Requirements:** Node.js 20.19+ (or 22.12+) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build
npm run preview

# 5. Type-check only
npm run lint
```

## 🎨 Customization

Everything personal lives in a handful of files. All values below are plain TypeScript — no CMS,
no config service.

### The question

`src/components/QuestionScreen.tsx`

```ts
const questionText = 'Will you go on a date with me? ❤️'
```

### The greeting

`src/components/Greeting.tsx` — change the `<h1>` / `<p>` copy. The screen advances automatically
after 4 seconds; adjust the `4000` in the `setTimeout` (or remove it to require a click).

### Time options

`src/components/TimeSelection.tsx`

```ts
const TIME_OPTIONS: TimeOption[] = [
  { id: '10:00 AM', label: '10:00 AM', sublabel: 'Morning Sunshine ☀️', icon: '🌅' },
  // add, remove or reorder freely — the "Other" option stays last
]
```

### Food options

`src/components/FoodSelection.tsx` — edit `FOOD_OPTIONS`. Each entry needs `id`, `title`,
`subtitle`, `badge` and an `illustration` (any React node, usually an inline `<svg>`).

### WhatsApp message & recipient

All three live in `src/components/Celebration.tsx`:

- Recipient → `WHATSAPP_RECIPIENT` (digits only, including the country code)
- Message template → `whatsappMessage`
- Button copy → `Confirm Our Date ❤️`

> **Heads-up:** the recipient is a plain constant, so the number is visible in the source. If you
> publish this repository, update `WHATSAPP_RECIPIENT` to your own number first.

### Celebration copy

`src/components/Celebration.tsx` holds the headline (`SEE YOU SOON, LOVE!`), the subtitle, the
summary card labels and the confetti palette (`colors` array).

### Colours & typography

`src/style.css` → the `:root` block:

```css
:root {
  --bg-start: #fff0f5;
  --bg-end: #fdfaf5;
  --pink-soft: #ffd1dc;
  --pink-medium: #ffa3b5;
  --pink-accent: #ff6b8a;
  --cream: #fdfaf5;
  --text-dark: #333333;
  --text-muted: #666666;
}
```

Fonts are loaded in `index.html` (Inter for body, Playfair Display for headings).

### Music

The soundtrack is generated, not sampled:

```bash
node scripts/generate-theme.mjs
```

This rewrites `public/audio/sweet-love-theme.wav` (8 bars, 72 BPM,
Cmaj7 – G/B – Am7 – Fmaj7). To use your own licensed track instead, drop an audio file into
`public/audio/` and update `AUDIO_PATH` in `src/components/MusicToggle.tsx`.

## 📦 Deployment

The build output is a static `dist/` folder, and `base: './'` in `vite.config.ts` means it works at
a domain root *or* in a sub-path (GitHub Pages included).

### Netlify

`netlify.toml` is already configured:

```toml
[build]
  publish = "dist"
  command = "npm run build"
```

Import the repository in Netlify and deploy — no extra settings needed.

### Vercel

`vercel.json` handles SPA rewrites and cache headers. Import the repo, keep the detected **Vite**
preset, and deploy.

### GitHub Pages

1. Push to `main`.
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The included workflow builds and publishes `dist/` automatically.

### Any static host

```bash
npm run build
# upload the contents of dist/
```

## ♿ Accessibility & privacy

- Interactive controls expose `aria-label`s and a visible `:focus-visible` outline.
- `@media (prefers-reduced-motion: reduce)` disables animations and transitions.
- The "NO" button is intentionally unreachable, but the **YES** path is fully keyboard-accessible.
- No analytics, cookies, accounts or server calls. The only outbound link is the optional WhatsApp
  deep link, opened by the user.

## 🔒 Security

This project is a static front-end: no backend, database, authentication or API keys, so there are
no server-side secrets to protect. [SECURITY.md](./SECURITY.md) documents the threat model, the
intentional public exposure of the WhatsApp number, how to purge it from git history, and the
hardening steps to follow if a backend is added later.

Every push and pull request runs a [gitleaks](https://github.com/gitleaks/gitleaks) secret scan
(`.github/workflows/secret-scan.yml`). `netlify.toml` and `vercel.json` send a strict
Content-Security-Policy, HSTS and the usual hardening headers, while `npm audit` runs weekly and
Dependabot keeps npm packages and GitHub Actions current.

## 🧭 Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari) on desktop and mobile. Uses
`backdrop-filter`, CSS `clip-path`, Canvas 2D and pointer/touch events.

## 📄 License

[MIT](./LICENSE) © 2026 Argie Cabudbud

## 💝 Credits

- Built with [React](https://react.dev), [Vite](https://vite.dev) and TypeScript.
- Fonts: [Inter](https://fonts.google.com/specimen/Inter) and
  [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) via Google Fonts.
- Music: original composition synthesized in-repo by `scripts/generate-theme.mjs`.

---

<div align="center">

Made with 💗 — good luck with your date!

</div>
