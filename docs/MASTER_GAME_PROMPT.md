# MASTER GAME PROMPT — StandX RPG: "From 0 to FLOWER"

> Reusable, self-contained design prompt. Hand this to an AI coding agent (or a human team)
> to build, extend, or rebuild the game. Everything an implementer needs is here: canon,
> design pillars, art direction, systems, and acceptance criteria.

---

## 1. Role & mission

You are a senior game designer + frontend engineer building **StandX RPG**, a single-player,
browser-based narrative RPG that teaches the **real Growth Path** of the StandX community
(Discord progression system). The game is an **on-ramp**: it trains players for the real journey,
it does not replace it. It must be intuitive enough for a crypto newcomer, beautiful enough to
share screenshots of, and honest enough that no player confuses game points with real rewards.

**One-line pitch:** *Tamagotchi-meets-visual-novel where your sprout mascot grows as you learn
how to actually become SEED → SPROUT → FLOWER in StandX.*

---

## 2. Canonical facts (do not invent — this is the real system)

StandX is a decentralized perpetuals exchange (BNB Chain + Solana) with a yield-bearing
stablecoin (DUSD). Official docs: https://docs.standx.com/docs/about-stand-x
Inside its Discord lives a merit-based progression system called **Growth Path**:

| Tier | Meaning | Requirement |
|---|---|---|
| — | Newcomer | Join Discord, **claim the Events role first** (event pings = opportunities) |
| **SEED** | Official contributor entry point | **3,000 Engage Points**, then **apply**; the team manually reviews (real contributor vs bot). Rejected → reapply in **2 weeks** |
| **SPROUT** | Standout contributor | Maintain **4,000+ points** + complete squad-specific milestones + consistent activity + moderator approval. Tracked on a **Notion board** |
| **FLOWER** | Highest tier, leadership | **No public checklist.** SEED proves activity, SPROUT proves contribution, FLOWER proves leadership. None selected yet — scarcity = value |

**Engage Points (real)** are earned via events, social campaigns, content creation, daily
activity, community participation.

**Squads** (chosen after SEED, based on real skill — not what looks easiest):

| Squad | Focus | SPROUT milestone |
|---|---|---|
| Creative | design, posters, videos | 4 approved visual materials |
| Offline | meetups, local events | 2 events with 100+ total attendees |
| Tech | answering questions, tutorials | 25 answered questions + 1 tutorial |
| Outreach | KOLs, media, communities | invite 3 KOLs or communities |
| Content | guides, research, competitor analysis | 2 in-depth original pieces selected by the team |

**Where people fail:** spamming, picking the wrong squad, checklist mentality, quantity over
quality. **What works:** quality interactions, helping others, showcasing strengths, being
visible across the whole Discord. The team evaluates everything, not just task completion.

---

## 3. Design pillars (non-negotiable)

1. **Educational honesty.** In-game EP is **conceptual practice**, never the real score. Say so
   in the UI (profile disclaimer, roadmap intro). No financial advice; keep NFA notices.
2. **The game ends where reality begins.** A full playthrough of Act I (~500 EP) lands the player
   at **Seed Candidate**. SEED (3,000), SPROUT (4,000 + milestones) and FLOWER remain *real-world
   goals* shown on the rank ladder — aspirational, not grindable in-game.
3. **Earning must feel earned.** EP tiers are exactly **30 / 50 / 80** (`epForStars`: 1★=30,
   2★=50, 3★=80). Zero consolation points. Chapter completion pays codex/achievements, not EP.
4. **A clear path, always.** Player can answer at any moment: where am I, what's next, how do I
   exit. Persistent next-step CTA, visible exit on every scene, reopenable multi-step guide.
5. **Low friction.** No login, no wallet, localStorage persistence, instant resume.
6. **Alive, not static.** The mascot reacts (cheer on EP, peek when locked, point when guiding);
   every zone has its own procedural music; rank-ups are celebrated.

---

## 4. Game structure

- **Act I — 6 chapters**, each one zone with its own palette, music and stakes:
  `void` (awakening) → `discord_plaza` → `event_arena` → `content_district` →
  `moderator_gate` → `seed_hall` (finale: SEED application approved *narratively*; squad
  selection unlocks by **completing Seed Hall**, not by EP).
- **Scene types:** dialog (typewriter + choices), quiz (graded, stars→EP once at the end),
  minigame QTE (timing / curation, stars→EP), reflection (0 EP), reward screen.
- **Cast:** Mira (leader/guide), Artifex (moderation), Gabo (outreach), Dave (creative),
  冷酷锦鲤.StandX (content/research mentor), 哆啦币梦.StandX (economy lore), SISTEMA (terminal
  voice). Each has a sigil avatar + accent color; active speaker animates.
- **Rank ladder (single source `lib/game/ep.ts`):** new_stander 0 · active 60 · consistent 150 ·
  seed_candidate 300 · seed 3,000 · sprout 4,000 (+2 real Discord contributions) · flower 8,000
  (criteria TBD — render requirement strings, not raw EP, for sprout/flower).
- **Quests board:** daily 30 / weekly 50 / milestone 80.
- **Roadmap screen:** the *real* 0→FLOWER journey in 6 steps (join+Events role → accumulate EP →
  3,000+manual review → squad choice → squad milestones→SPROUT → FLOWER/leadership), plus
  "where most fail vs what actually works" and the "no FLOWER selected yet" opportunity note.

---

## 5. Art direction

**Aesthetic:** retro-terminal cyberpunk — deep navy-black (`#04080f`), phosphor green
(`#00e832`) primary, gold (`#ffe600`) for prestige, zone accents (blue/red/purple/orange/gold).
Scanlines, film grain, vignette, starfields, glowing hairlines. Display font: wide uppercase
tracking; body: semi-bold humanist; data: monospace.

**Mascot (the brand — keep faithful):** a round, near-black creature with one giant green eye
(cream sclera, green radial iris, dark pupil, white specular), a green two-tone leaf sprouting
from a curved black stem, stubby arms/feet, cream smile. Vector (SVG), thick dark outlines,
soft top-left light. **Pose system** (reuse everywhere, never redraw off-model):

- `idle` — arms out, smile; gentle bob, blink, leaf sway.
- `point` — one arm raised pointing up-right, gaze follows; used for guidance/CTAs.
- `peek` — half-hidden behind a pole, half-lidded eye, flat mouth; used for locked content.
- `meh` — half-lidded + flat mouth; used for failed challenges (0★).
- `cheer` — open mouth (gold inner), blush dashes, hands up, `$` + sparkle particles; used for
  EP gains, rank-ups, completions.

The mascot's sprout **grows with rank** (extra leaves → bud → six-petal flower). Mascot reacts
to live events (EP pulse → cheer for ~2s). Brand mark: the StandX **δ** glyph.

**Effects:** EP gain = floating pill + radial particle burst; rank-up = full-screen takeover with
particle ring + mascot cheer + fanfare; scene transitions = subtle scale/slide crossfades.
Everything respects `prefers-reduced-motion` and the in-game reduce-motion setting.

---

## 6. Audio (procedural — no audio files)

Web Audio lookahead sequencer (25ms tick / 0.16s horizon), one track per zone: void 72bpm
A-minor sparse · discord_plaza 112 C-major bright · event_arena 134 E-minor driving ·
content_district 96 D-add9 dreamy · moderator_gate 76 F-minor solemn · seed_hall 100 G-major
triumphant (I-IV-V-I). SFX: tick, choice, ep, correct, wrong, complete, rank-up fanfare.
Master/music gain nodes; visible audio toggle in HUD and scene top bar.

---

## 7. UX & i18n

- **Onboarding:** 5-step reopenable guide (name → quests → ranks → squads → play), mascot
  pointing; Help (?) in the top bar reopens it.
- **Navigation:** desktop sidebar + mobile bottom nav (HQ, Quests, Squads, Codex, Ranks,
  Profile); home/exit always reachable; brand links to landing.
- **i18n:** 5 locales — en-US (base), en-GB, es-ES, pt-BR, ko-KR. UI strings in all 5; story
  overlays in es/pt; Korean story intentionally deferred with a visible fallback notice. Every
  new string ships in all 5 bundles.
- **Accessibility:** reduced-motion paths for every animation, aria labels on interactive art,
  status roles for celebrations.

---

## 8. Tech stack & quality bar

Next.js (App Router) + React + TypeScript strict · Tailwind with `sx-*` design tokens ·
zustand + persist (localStorage, single store) · next-intl (client provider, deep fallback
merge) · framer-motion · zod-validated JSON content (`content/chapters/*.json`) · vitest unit
tests (economy, mastery, rewards must stay green) · no backend, fully offline-capable.

**Acceptance checklist before shipping any change:**
1. `npx tsc --noEmit` clean; `npm test` green; all 5 message bundles parse.
2. Play chapter 1 in the browser: no console errors; EP matches 30/50/80; bad choices pay 0.
3. Each zone sounds different; audio toggle works; rank-up celebration fires at thresholds.
4. Ranks page shows real requirements (SEED 3,000 · SPROUT 4,000+contribs · FLOWER TBD).
5. Squads locked until Seed Hall is complete; each squad card shows its SPROUT milestone.
6. Locale switch: es/pt fully translated; ko shows UI translated + story fallback notice.
7. Screenshot-worthy: landing, HQ, a scene, reward screen — would you share them?

**Guardrails:** never imply game EP equals real Engage Points or guarantees airdrops; keep NFA
disclaimers; don't add tracking/analytics; don't gate squads behind EP; don't inflate the EP
economy; keep the mascot on-model.
