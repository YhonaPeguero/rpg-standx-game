# AGENTS.md

## Repo Snapshot
- Active app is a Next.js App Router project: `app/page.js` renders `app/Game.js`.
- `index.html` is now a legacy source snapshot for parity checks; the Next app serves the migrated files, not the root HTML file.
- Runtime logic lives in `lib/standxRuntime.js` and is loaded only from `useEffect` because it touches browser APIs at module runtime when initialized.
- Static game DOM markup lives in `app/gameMarkup.js`; global visual styles and responsive polish live in `app/globals.css`.

## Commands
- Install dependencies with `npm install` before running scripts.
- `npm run dev` starts the Next.js dev server.
- `npm run build` verifies a production build.
- `npm run lint` runs ESLint over app sources; `lib/standxRuntime.js` is ignored because it is the migrated legacy game runtime.

## Migration Constraints
- Preserve gameplay, UI interactions, Portuguese copy, and the neon/cyber identity; do not simplify flows or game data.
- Features to keep working include title flow selection, Growth Hub/detail screens, Seed/Sprout/Flower playable flows, canvas movement, dialogs/typewriter/skip, choices, QTE bar/content modes, particles, screen shake, pause/restart, Web Audio SFX, haptics, autosave, and ending screen.
- Game data parity matters for `NPCS`, `HUB_DATA`, `ZONES`, `STORY`, `WEVENTS`, `QTE_CFG`, `SPROUT_*`, and `FLOWER_*`.
- Autosave uses `localStorage` key `standx_save`; do not change it unless intentionally migrating existing saves.

## Runtime Gotchas
- The runtime depends on specific DOM IDs/classes: `#titl`, `#hud`, `#dlg`, `#cho`, `#qte`, `#hub`, `#hubDetail`, `#pauseOvl`, `#end`, `#mctrl`, and canvas `#c`.
- Inline handlers in markup/generated HTML require globals exposed from `lib/standxRuntime.js` such as `togglePause`, `skipDlg`, `openHub`, `openHubDetail`, `closeHub`, `selectFlow`, `clearSave`, `barPress`, `cPick`, and `SFX`.
- Keep browser-only access inside client effects or runtime functions; do not touch `window`, `document`, `navigator`, `AudioContext`, `localStorage`, or canvas during server render.
- React Strict Mode can reveal duplicate animation loops/listeners; keep the `window.__standxGameRuntimeStarted` guard unless replacing the runtime lifecycle deliberately.
- Preserve font loading for `Orbitron` 400/700/900, `Share Tech Mono`, and `Rajdhani` 400/500/600/700.

## Verification
- Run `npm run lint` and `npm run build` after migration changes.
- Manual checks should cover desktop and mobile width, Seed/Sprout/Flower starts, Growth Hub details, keyboard and touch movement, QTE success/failure, pause via Escape, autosave/reload, progress reset, and the end screen.
