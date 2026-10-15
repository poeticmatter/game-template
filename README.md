# Game Template

The starting point for **two-player, simultaneous-turn** games in the [game lab](https://poeticmatter.github.io/game-lab/): both players choose secretly, then the turn resolves. For games where 2–5 players take turns in order, use [game-template-turns](https://github.com/poeticmatter/game-template-turns) instead.

You get, from [GameKit](https://github.com/poeticmatter/GameKit) (`game-kit/simultaneous`):

- **Live play** over PeerJS (peer to peer, no server), with spectators
- **Async play** backed by Supabase (turns are saved, so players can move at any time)
- **Hot seat**: both players share one device, with a pass-the-device screen between inputs
- A lobby, share links, reconnection, and GitHub Pages deployment

The example game in `src/game/` is rock-paper-scissors. Replace it with your own.

## Starting a new game

1. On GitHub, click **Use this template → Create a new repository** (for example `poeticmatter/SpiralDuel`), then clone it.
2. Name the game:
   ```bash
   npm install
   npm run init-game -- SpiralDuel spiral "Spiral Duel"
   ```
   This sets the Pages path, the title, and the game id. The game id names the Supabase table (`spiral_games`), and it prefixes the PeerJS room ids and localStorage keys so lab games never collide.
3. Run the renamed migration in `supabase/migrations/` in the shared Supabase project.
4. Copy `.env.local` from any other lab game (every game uses the same Supabase project).
5. Replace `src/game/` with your game, update this README, then run `npm run deploy`.
6. Add the game to the hub's `games.json` in [poeticmatter/game-lab](https://github.com/poeticmatter/game-lab).

## Structure

```
src/
├── game.config.ts   # GAME_CONFIG: game id, title, tagline, Supabase settings
├── game/            # THE GAME: replace this folder
│   ├── index.ts     #   exports `game: GameModule`
│   ├── rules.ts     #   pure, deterministic createInitialState / resolveTurn
│   ├── rules.test.ts
│   ├── Board.tsx    #   renders state, calls onSubmitPlan
│   └── SettingsForm.tsx
├── index.css        # Tailwind, GameKit's theme, and this game's colours
└── App.tsx          # <SimultaneousGameApp config={GAME_CONFIG} game={game} />
```

The lobby, transports and status screens live in GameKit, pinned in `package.json` to a release tag. To change them, change GameKit, tag a release, and bump the version here.

### The game contract

A game provides a `GameModule` (types from `game-kit/simultaneous`):

- `rules.createInitialState(settings)` and `rules.resolveTurn(state, p1Plan, p2Plan)`. These must be **pure and deterministic**, because in async play either client may resolve a turn. For randomness, keep a seed in the state and use GameKit's `nextRandom`.
- The state and every plan carry `turn: number`, which the transports use to reject stale plans.
- `Board` receives `state`, `role` (`1 | 2 | 'spectator'`), `hasCommitted`, `onSubmitPlan` and `seating`. In hot seat, `seating` is `'hot_seat'` and `role` is whichever player holds the device, so name players by number rather than "You".
- `SettingsForm` edits the settings in the lobby.

GameKit's screens take their colours from the tokens in `src/index.css`.

## Commands

```bash
npm run dev      # http://localhost:3000
npm run lint     # tsc --noEmit
npm test         # vitest
npm run build
npm run deploy   # build and publish to GitHub Pages (gh-pages branch)
```
