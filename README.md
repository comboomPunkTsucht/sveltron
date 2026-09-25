<p align="center">
  <img src="Logo-sveltron/icon.png" alt="sveltron logo" width="128" />
</p>

<h1 align="center">sveltron</h1>

<p align="center">
  A desktop app starter that pairs <strong>Electron</strong> with <strong>SvelteKit</strong>, built and tested with the <strong>Vite+</strong> toolchain.
</p>

<p align="center">
  <a href="https://www.electronjs.org/"><img src="https://img.shields.io/badge/Electron-44-blue?logo=electron" alt="Electron" /></a>
  <a href="https://svelte.dev/docs/kit"><img src="https://img.shields.io/badge/SvelteKit-SPA-ff3e00?logo=svelte" alt="SvelteKit" /></a>
  <a href="https://viteplus.dev"><img src="https://img.shields.io/badge/Vite+-0.3-646CFF?logo=vite" alt="Vite+" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" /></a>
</p>

---

## What you get

- **Electron 44 + SvelteKit SPA** — main/preload bundled by `vite-plugin-electron`, renderer served through a custom URL protocol (e.g. `my-sveltron-app://`) with SPA fallback, CSP in `hash` mode, and a sandboxed `contextBridge` IPC bridge.
- **Vite+ (`vp`) toolchain** — one CLI for `dev`, `build`, `preview`, `check` (format + lint + typecheck) and `test`.
- **Tailwind CSS 4** — with `@tailwindcss/forms` and `@tailwindcss/typography` preconfigured.
- **`runed`** — Svelte 5 runes utility library, ready to import.
- **`zod`** — schema validation for forms, IPC payloads and config.
- **mdsvex** — write routes as Markdown (`.svx` / `.md`).
- **Vitest 4** — browser component tests (Playwright + Chromium) *and* node tests in one `vp test` run.
- **electron-builder** — installers for macOS (dmg, zip, pkg), Windows (nsis, msiWrapped, portable, zip) and Linux (AppImage, rpm, deb, tar, zip).
- **AI-agent ready** — `AGENTS.md`, per-tool configs (`.github/skills`, `.claude`, `.cursor`, `.gemini`, `.opencode`, `.zed`, `.aiassistant`) and the Svelte docs MCP are already set up.

Everything above is preinstalled — no extra setup, just start coding.

## Requirements

| Tool    | Requirement                                                              |
| ------- | ------------------------------------------------------------------------ |
| Node.js | `^20.19.0` \|\| `^22.18.0` \|\| `>=24.11.0`                        |
| pnpm    | `12.6` (declared in `devEngines`, downloaded on demand)              |
| Vite+   | used through the local`vite-plus` dependency — run it as `vp <cmd>` |

> **pnpm only.** The dependency catalog lives in `pnpm-workspace.yaml` (`catalog:` entries in `package.json`), so npm/yarn/bun will not resolve versions correctly.

## Getting started

### Option 1 — GitHub template

Click **“Use this template”** on GitHub, create your repository, then:

```sh
git clone https://github.com/<you>/<your-app>.git
cd <your-app>
pnpm install
vp dev
```

### Option 2 — Vite+ scaffold

```sh
vp create github:comboomPunkTsucht/sveltron --package-manager pnpm
cd <your-app>
vp dev
```

### Option 3 — clone manually

```sh
git clone https://github.com/comboomPunkTsucht/sveltron.git <your-app>
cd <your-app>
pnpm install
vp dev
```

`vp dev` starts the Vite dev server **and** opens the Electron window with HMR — renderer, main and preload all reload live.

## Configure your app

All app identity values live in a single file: [`config.ts`](config.ts).

```ts
import package_json from "./package.json" with { type: "json" };

export const APP_NAME = "My Sveltron App";
export const APP_PACKAGE = package_json.name;
export const APP_PROTOCOL = APP_PACKAGE.split(".")[2];
```

| Value            | Used for                                                     |
| ---------------- | ------------------------------------------------------------ |
| `APP_NAME`     | Window/about-panel title,`productName` in electron-builder |
| `APP_PACKAGE`  | Bundle ID /`appId` (`com.yourname.my-sveltron-app`)      |
| `APP_PROTOCOL` | Custom URL scheme (`my-sveltron-app://`) + CSP directives  |

Also adjust:

- `package.json` → `name` (and `version`, which drives the `release/<version>/` output folder)
- Icons → `static/icon.png` (Windows/Linux) and `static/AppIcon.icon` (macOS); editable sources live in [`Logo-sveltron/`](Logo-sveltron/)

## Scripts

| Command          | What it does                                                            |
| ---------------- | ----------------------------------------------------------------------- |
| `vp dev`       | Dev server + Electron window with HMR                                   |
| `vp run build` | Production bundles**and** installers → `release/<version>/`    |
| `vp build`     | Bundles only: renderer →`build/`, main/preload → `dist-electron/` |
| `vp preview`   | Preview the built renderer in a browser tab                             |
| `vp check`     | Format (oxfmt) + lint (oxlint, type-aware) +`svelte-check`            |
| `vp test`      | Vitest in watch mode                                                    |
| `vp run test`  | Single test run (CI-friendly)                                           |

## Project structure

```
├── config.ts                  # APP_NAME / APP_PACKAGE / APP_PROTOCOL
├── electron/
│   ├── main.ts                # Window, custom protocol, IPC handlers
│   └── preload.ts             # contextBridge → window.ipcRenderer
├── electron-builder-config.ts # Installer targets, icons, appId
├── src/
│   ├── lib/
│   │   ├── components/        # NavBar, Header, Counter
│   │   ├── utils/log.ts       # Renderer → main logging over IPC
│   │   └── vitest-examples/   # Sample unit + component tests
│   ├── routes/                # SvelteKit pages (/, /about)
│   └── app.html
├── static/                    # Icons, favicon (copied into build/)
├── vite.config.ts             # Tailwind, SvelteKit, Electron, tests, CSP
└── pnpm-workspace.yaml        # Dependency catalog (vite, vitest, …)
```

## How it works

**Development** — `vite-plugin-electron` builds main/preload in watch mode and launches Electron against `VITE_DEV_SERVER_URL`, so you get full HMR in the app window.

**Production** — `vp build` prerenders the SvelteKit app as a static SPA (`adapter-static`, `ssr = false`, `trailingSlash = "always"`). Electron registers the custom scheme from `APP_PROTOCOL` and serves `build/` from disk, falling back to `index.html` for client-side routes. A hash-based CSP keeps scripts locked down while still allowing the dev server.

**IPC** — the preload script exposes a minimal `window.ipcRenderer` API (`on`/`off`/`send`/`invoke`). Example: `src/lib/utils/log.ts` sends log messages from the renderer to the main-process console; the “Send Message” button in the navbar does the same via `log()`.

## Testing

```sh
vp test        # watch
vp run test    # single run
```

> First run on a fresh machine may need the test browser once: `pnpm exec playwright install chromium`.

Two Vitest projects are configured in `vite.config.ts`:

- **client** — browser mode (Playwright, headless Chromium) for `src/**/*.svelte.spec.ts`
- **server** — node environment for `src/**/*.{test,spec}.ts`

Runnable examples live in [`src/lib/vitest-examples/`](src/lib/vitest-examples/).

## Packaging

```sh
vp run build
```

Runs `vp build` and then electron-builder with [`electron-builder-config.ts`](electron-builder-config.ts). Installers land in `release/<version>/`, targets cover macOS, Windows and Linux (see the config for arch and target lists). Signing/notarization is not configured — add it before shipping to users.

## License

[MIT](LICENSE)
