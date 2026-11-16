# Design log

What changed and why, newest first. **Game design** is the game itself: rules, content and balance. **Game development** is everything else: the board and UI, the platform, bots, tooling and fixes that don't change the rules. A change that does both has an entry in each.

*A new game replaces the template's entries below with its own, starting from "Started from the game template".*

## Game design

### 2026-09-28: Rock, paper, scissors, the example game
Both players pick a hand in secret; rock beats scissors, scissors beats paper, paper beats rock, and a tie scores nothing. First to the target score wins: 1, 3 or 5 round wins, a lobby setting.

## Game development

### 2026-11-16: A plain-language rules document and this log
`docs/rules.md` describes the game as it plays now, and this log records changes in two parts. Both are kept up to date with every change.

### 2026-10-25: Solo playtest replaces hot seat (GameKit 0.6.0)
One tester enters both players' plans on one device, with a screen between them naming whose plan comes next.

### 2026-10-15: The platform moves to GameKit
The lobby, transports and status screens come from GameKit, a shared package pinned to a release, instead of living in this repo.

### 2026-10-09: Hot seat
Both players can share one device.

### 2026-09-28: A two-player template for simultaneous turns
Live play over PeerJS and async play over Supabase, with a lobby, share links and GitHub Pages deployment.
