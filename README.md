# StandX RPG

A narrative single-player RPG for the **StandX** community Growth Path. Play as **Stander**, learn how Engage Points become real Discord ranks, and complete daily/weekly/community missions on the way to the **Seed → Sprout → Flower** ladder.

- **Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 · Tailwind 3 · framer-motion 11 · zustand 4 · zod 3 · next-intl 4
- **Languages:** en-US, es-ES, pt-BR, en-GB, ko-KR (with safe fallback to en-US)
- **State:** local-first via zustand + `localStorage` (no backend required)
- **Rendering:** mostly static (`/`, `/about`, dashboard, quests, ranks, codex, profile, leaderboard) — only `/play/scene/[id]` is dynamic

## Quick start

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Production:

```bash
pnpm build
pnpm start
```

CI checks:

```bash
pnpm test           # vitest (unit tests for game systems)
pnpm lint           # eslint
node node_modules/typescript/bin/tsc --noEmit
```

## Architecture

```
app/                # Next.js App Router pages
  page.tsx          # Marketing landing (with Starfield + LocaleSwitcher)
  about/            # Marketing about
  play/
    page.tsx        # HQ dashboard
    quests/         # Quest board
    ranks/          # Rank ladder
    codex/          # Unlocked codex entries
    profile/        # Achievements + share card
    leaderboard/    # Placeholder (v2)
    scene/[id]/     # Dynamic chapter scene player
  not-found.tsx
  layout.tsx        # Root layout + LocaleProvider

components/
  scene/            # ScenePlayer, GameStage, DialogScene, QuizScene, ReflectionScene, MiniGameScene, RewardScreen, Starfield
  minigames/        # TradeTimingQTE, ContentPickQTE
  dashboard/        # ChapterCard, GrowthTree, MascotPanel, Onboarding, Sidebar, StatCard
  hud/              # TopBar, EPRing, RankLabel, RankProgress, StreakBadge, DailyClaim
  quests/           # QuestBoard, QuestCard
  mascot/           # MascotCanvas (canvas2d), EvolutionCelebration
  i18n/             # LocaleProvider, LocaleSwitcher
  ui/               # Button, Card, Modal, ShareCard

content/            # Authored game data (validated by zod)
  chapters/*.json   # Six Act I chapters (dialog/quiz/minigame/reflection scenes)
  characters.json   # Cast (Mira, Victor, Jovan, Gaboo, Arttifex, Aifilho, Dias, Dan, Sistema, Stander)
  codex.json        # Localized codex entries
  achievements.json # Localized achievements
  quests.json       # Daily/weekly/community quest definitions
  style-guide.md    # Voice guide for content authors

lib/
  i18n/             # config (5 locales + meta + normalize), request, localizeText fallback helper
  content/          # loader, schemas (zod), localize (chapter overlay), codex, quests
  game/             # ep, ranks, gates, rewards, mastery, streak, quests + their .test.ts

messages/           # Static UI message bundles
  en-US.json        # Canonical source of truth
  en-GB.json
  es-ES.json
  pt-BR.json        # Includes full Act I chapter translations
  ko-KR.json

store/              # zustand store with persist middleware
  index.ts          # combined slices + localStorage persistence + migration
  playerSlice.ts    # EP, rank, squad, streak, mastery, codex, achievements
  progressSlice.ts  # Completed scenes/chapters
  settingsSlice.ts  # Locale, audio, reduce-motion
  questsSlice.ts    # Daily roll, progress, claims

styles/globals.css  # Design tokens + Tailwind layer + scanline overlay
tailwind.config.ts  # Maps tokens to sx-* utilities
types/index.ts      # Shared TS types (Player, Chapter, Scene, Quest, LocalizedText...)
```

### State model

Single zustand store with persistent middleware writing to `localStorage` (`standx-rpg-store`). Slices:

| Slice        | Responsibility                                                                 |
|--------------|--------------------------------------------------------------------------------|
| `player`     | EP, rank (derived via `rankFromEP`), squad, streak, mastery, codex, achievements |
| `progress`   | `completedScenes`/`completedChapters` Sets; current chapter id                  |
| `settings`   | Locale, audio toggle, reduce-motion toggle                                      |
| `quests`     | Active daily quest IDs, progress map, claimed list, last UTC roll ISO           |

The store's `merge` step normalizes legacy locale values (`"en"` → `"en-US"`) so older saves keep working.

### Progression

- **EP thresholds** are defined in `lib/game/ep.ts` (`RANK_THRESHOLDS`) and surfaced as rich metadata (icon, accent color, perks, Discord-role flag, i18n keys) in `lib/game/ranks.ts`.
- **Gates** (`lib/game/gates.ts`) check previous-chapter / EP / rank / squad requirements for chapter and quest unlocks.
- **Streak** (`lib/game/streak.ts`) increments once per UTC day; resets on missed day.
- **Mastery** (`lib/game/mastery.ts`) converts quiz score and minigame outcome into 0-3 stars per scene.
- **Quests** (`lib/game/quests.ts`) reroll a deterministic daily set every UTC midnight (hashed by date so the same 3 quests appear globally each day). Weekly and community quests persist until claimed.

### Scene engine

`ScenePlayer → GameStage → SceneRouter → { DialogScene | QuizScene | MiniGameScene | ReflectionScene }`

Each scene is a discriminated union (`Scene` in `types/index.ts`). Chapter JSON files declare the sequence; `localizeChapter` overlays translated text from the active locale's `messages/*.json` (currently only pt-BR ships full chapter overlays — others fall back to English source).

## Internationalization

The app is **client-locale driven** (zustand) rather than URL-segment driven (no `[locale]` route). The trade-off:

- ✅ Zero URL churn, no full reload on locale switch, persistent across sessions, simpler routes
- ❌ No per-locale SEO; not suitable for indexed marketing pages at scale

For the StandX game (heavily client-side, low SEO need), this is the right call. If marketing SEO becomes critical, the migration path is to add `[locale]/` segments and lift the LocaleProvider into a server component using `getRequestConfig`.

### Add a locale

1. Add the code to `lib/i18n/config.ts` (`locales`, `localeMeta`).
2. Create `messages/<code>.json` (copy `en-US.json` as scaffold).
3. Optionally translate codex/achievements entries (key by locale code; missing keys fall back to en-US).
4. Optionally add a `content.chapters` overlay (pt-BR is the reference).

`lib/i18n/localizeText.ts` provides a `localizeText(field, locale)` helper that falls back to `en-US` when a translation is missing — use it whenever rendering `LocalizedText` from JSON.

### Add a UI message key

Add to `messages/en-US.json` first (source of truth). `LocaleProvider` deep-merges the active locale on top of en-US, so untranslated keys automatically fall back. Add equivalents to the other four locales when you have translations.

## Content authoring

### Add a chapter

1. Create `content/chapters/<id>.json` matching `chapterSchema` (`lib/content/schemas.ts`).
2. Add it to `chapters` in `lib/content/loader.ts`.
3. Add the title/subtitle/scene text overlay to `messages/pt-BR.json` under `content.chapters.<id>` (and any other locales you want).
4. Add a chapter card mentor + estimate in `app/play/page.tsx` if needed.

### Add a quest

1. Append to `content/quests.json` — match the zod schema in `lib/content/quests.ts`.
2. Add `quests.list.<id>.{title,body}` to every `messages/*.json` (i18nKey points here).
3. Daily quests get rolled by `rollDailyQuestIds` (deterministic hash of UTC day); weekly/community quests show up directly.
4. Optional `unlock` gates restrict visibility by rank/EP/squad.

### Add a codex entry / achievement

Add to `content/codex.json` or `content/achievements.json` with `LocalizedText` (`{"en-US": "...", "pt-BR": "...", ...}`). At minimum `en-US` is required — others fall back.

## Visual design

- **Tokens** in `styles/globals.css` (`--green-primary`, `--gold`, `--bg-base`, etc.) and mapped via `tailwind.config.ts` to `sx-*` utilities.
- **Fonts** loaded by Next: Orbitron (display), Share Tech Mono (mono), Rajdhani (body), Inter (UI).
- **Atmosphere:** canvas2d `Starfield` on the landing, CSS scanline overlay on every page, parallax glow + grid floor inside `GameStage`, framer-motion scene transitions, animated `MascotCanvas` (procedural drawing reacting to rank), and an `EvolutionCelebration` overlay on rank-up.
- **No Three.js / WebGL renderer** — canvas2d covers the visual ceiling cheaply (< 10kb of code vs. ~150kb for three+r3f). Reintroduce only if a specific scene needs true 3D depth.

## Testing

`vitest` covers the game systems (`ep`, `gates`, `mastery`, `rewards`, `streak`). Run:

```bash
pnpm test
```

UI / scene flows are not unit-tested — the game is small enough to verify by play-through (`pnpm dev` → http://localhost:3000/play).

## Deploy

The project is a stock Next.js app — deploy anywhere Next runs:

- **Vercel:** push the repo, accept the default Next.js project settings. No env vars required.
- **Self-hosted:** `pnpm build && pnpm start`. Output is in `.next/`. Bun, Node 20+ both work.
- **Static export** is not currently supported because `/play/scene/[id]` is dynamic (chapter id from URL). To go fully static, set `generateStaticParams` for it and `output: "export"` in `next.config.ts`.

## Roadmap

- Squads page (`/play/squads`) with mentor profiles and squad-XP tracking
- Real Discord OAuth + server-side EP attribution
- Live leaderboard (currently a stub)
- Act II / III (currently MVP is Act I, six chapters)
- Full chapter translations for es-ES, en-GB, ko-KR
- Mascot mood reactions wired to scene events (dialog pose hints already exist in the type)
