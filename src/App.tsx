import { SimultaneousGameApp } from 'game-kit/simultaneous'
import { game } from './game'
import { GAME_CONFIG } from './game.config'

export default function App() {
  return <SimultaneousGameApp config={GAME_CONFIG} game={game} />
}
