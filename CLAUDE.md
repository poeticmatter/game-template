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

The multiplayer platform (lobby, transports, status screens) is **GameKit**'s `game-kit/simultaneous`, a package pinned in `package.json` to a release tag of poeticmatter/GameKit (local copy: `C:\Code\GameKit`).

- `src/game/`: the game. Pure rules (`rules.ts`, tested in `rules.test.ts`), React UI (`Board.tsx`, `SettingsForm.tsx`), and `index.ts` exporting `game: GameModule`.
- `src/game.config.ts`: `GAME_CONFIG`: the game id, title, tagline, and Supabase settings read from `.env.local`.
- `src/App.tsx`: renders `<SimultaneousGameApp config={GAME_CONFIG} game={game} />`. GameKit routes on the URL (`?room=CODE[&mode=async]`); hot-seat matches have no URL.
- `src/index.css`: Tailwind, GameKit's theme (`game-kit/theme.css`), and the colour tokens GameKit's screens use.

### Rules contract

- `createInitialState(settings)` and `resolveTurn(state, p1Plan, p2Plan)` must be pure and deterministic. In async play, whichever client submits second resolves the turn. For randomness, keep the generator state in the game state and use GameKit's `nextRandom` / `nextIndex`.
- State and plans carry `turn`. Transports drop plans whose `turn` doesn't match the current state.

### Transports (in GameKit)

- **Live (PeerJS)**: the room creator is player 1 and the only peer that runs rules; the guest is player 2 or a spectator. Commit-and-hold: the host's plan is held until the guest's arrives, so the host gets no information advantage.
- **Async (Supabase)**: one row per room in this game's own table (`<game-id>_games`, defined in `supabase/migrations/`) on the Supabase project shared by all lab games. Writes are guarded on the `turn` column.
- **Hot seat**: both players share one device; a handoff screen hides the board while the device changes hands. The Board gets `seating: 'hot_seat'` and `role` is the player at the device.

## Rules

- All state changes go through `rules.resolveTurn`. UI components only render state and submit plans.
- Keep `GAME_CONFIG.id` and the table name in `supabase/migrations/` in sync.
- To change platform behaviour, change GameKit, tag a release, and bump the `game-kit` version in `package.json`. Don't patch `node_modules/game-kit`.
