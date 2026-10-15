import type { GameModule } from 'game-kit/simultaneous'
import { RpsBoard } from './Board'
import { rpsRules } from './rules'
import { RpsSettingsForm } from './SettingsForm'
import type { RpsPlan, RpsSettings, RpsState } from './types'

/**
 * The game plugged into GameKit. To build a new game, replace everything in src/game/
 * and keep exporting a GameModule named `game`.
 */
export const game: GameModule<RpsSettings, RpsState, RpsPlan> = {
  rules: rpsRules,
  defaultSettings: { targetScore: 3 },
  SettingsForm: RpsSettingsForm,
  Board: RpsBoard,
}
