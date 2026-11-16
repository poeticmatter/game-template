# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server at http://localhost:3000
npm run lint       # TypeScript type checking (tsc --noEmit)
npm test           # vitest
npm run build      # production build
npm run deploy     # build and publish to GitHub Pages
npm run init-game -- <repo-name> <game-id> "<Title>"   # one-time rename of a fresh template copy
```

## Architecture

A two-player, simultaneous-turn browser game with no backend of its own. It is part of the game lab (poeticmatter/game-lab); each game lives in its own repo created from poeticmatter/game-template. (Games where 2–5 players take turns in order start from poeticmatter/game-template-turns instead.)

The multiplayer platform (lobby, transports, status screens) is **GameKit**'s `game-kit/simultaneous`, a package pinned in `package.json` to a release tag of poeticmatter/GameKit (local copy: `C:\Code\digital-board-games\GameKit`).

- `src/game/`: the game. Pure rules (`rules.ts`, tested in `rules.test.ts`), React UI (`Board.tsx`, `SettingsForm.tsx`), and `index.ts` exporting `game: GameModule`.
- `src/game.config.ts`: `GAME_CONFIG`: the game id, title, tagline, and Supabase settings read from `.env.local`.
- `src/App.tsx`: renders `<SimultaneousGameApp config={GAME_CONFIG} game={game} />`. GameKit routes on the URL (`?room=CODE[&mode=async]`); solo playtests have no URL.
- `src/index.css`: Tailwind, GameKit's theme (`game-kit/theme.css`), and the colour tokens GameKit's screens use.

### Rules contract

- `createInitialState(settings)` and `resolveTurn(state, p1Plan, p2Plan)` must be pure and deterministic. In async play, whichever client submits second resolves the turn. For randomness, keep the generator state in the game state and use GameKit's `nextRandom` / `nextIndex`.
- State and plans carry `turn`. Transports drop plans whose `turn` doesn't match the current state.

### Transports (in GameKit)

- **Live (PeerJS)**: the room creator is player 1 and the only peer that runs rules; the guest is player 2 or a spectator. Commit-and-hold: the host's plan is held until the guest's arrives, so the host gets no information advantage.
- **Async (Supabase)**: one row per room in this game's own table (`<game-id>_games`, defined in `supabase/migrations/`) on the Supabase project shared by all lab games. Writes are guarded on the `turn` column.
- **Solo playtest**: one tester enters both players' plans on this device, with a screen between them naming whose plan comes next. The Board gets `seating: 'solo_playtest'` and `role` is the player being planned for.

## Rules document and design log

Claude keeps two documents in `docs/` and updates them in the same change as the work they describe, without being asked:

- **`docs/rules.md`**: the game's rules as it plays them now, in plain language, as a new player would read them: what you're trying to do, what's on the table, setup, a turn, how it ends. No code names, file paths or jargon. Every change to the rules or content updates it, so it always matches the game.
- **`docs/design-log.md`**: what changed and why, newest first, in two sections:
  - **Game design**: the game itself: rules, content (map, tiles, cards, numbers and dials) and balance.
  - **Game development**: everything else: the board and UI, visuals, GameKit bumps, bots, tooling, and fixes that don't change the rules.

  One entry per change, headed by its date and a short title, in the section it belongs to; a change that does both gets an entry in each. Say what changed for players and, when it's known, why. Leave how it was built to the commits.

Both start out describing the example game, rock-paper-scissors. When a new game replaces it, rewrite `rules.md` for that game and replace the template's log entries with the game's own, starting from "Started from the game template". If the designer has their own rules text, keep it as a separate file in `docs/` and let `rules.md` describe what the game plays, including the calls it makes where that text leaves a question open.

## Rules

- All state changes go through `rules.resolveTurn`. UI components only render state and submit plans.
- Keep `GAME_CONFIG.id` and the table name in `supabase/migrations/` in sync.
- To change platform behaviour, change GameKit, tag a release, and bump the `game-kit` version in `package.json`. Don't patch `node_modules/game-kit`.
