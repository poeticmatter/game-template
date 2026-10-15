import { supabaseFromEnv, type GameConfig } from 'game-kit/simultaneous'

/**
 * Identity of this game within the game lab. `npm run init-game` rewrites the id and title.
 *
 * `id` must be unique across every lab game: it names the Supabase table
 * (`<id>_games`, see supabase/migrations/), and prefixes PeerJS room ids and
 * localStorage keys, so two games can never collide on shared infrastructure.
 */
export const GAME_CONFIG: GameConfig = {
  id: 'template',
  title: 'Game Template',
  tagline: 'Rock, paper, scissors: an example game. Replace src/game/ with your own.',
  supabase: supabaseFromEnv(import.meta.env),
}
