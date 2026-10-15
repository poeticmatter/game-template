import { describe, expect, it } from 'vitest'
import { rpsRules } from './rules'
import type { Hand, RpsState } from './types'

// An example of testing a game's rules: they're pure functions, so no browser or
// network is needed. Replace these with tests for your own game.

function playRound(state: RpsState, p1Hand: Hand, p2Hand: Hand): RpsState {
  return rpsRules.resolveTurn(state, { turn: state.turn, hand: p1Hand }, { turn: state.turn, hand: p2Hand })
}

const start = rpsRules.createInitialState({ targetScore: 2 })

describe('rock, paper, scissors', () => {
  it('gives the round to the hand that beats the other', () => {
    expect(playRound(start, 'paper', 'rock').scores).toEqual({ 1: 1, 2: 0 })
  })

  it('scores nothing on a draw', () => {
    expect(playRound(start, 'rock', 'rock').scores).toEqual({ 1: 0, 2: 0 })
  })

  it('moves on to the next turn', () => {
    expect(playRound(start, 'rock', 'scissors').turn).toBe(start.turn + 1)
  })

  it('ends the match at the target score', () => {
    const afterTwoWins = playRound(playRound(start, 'scissors', 'paper'), 'scissors', 'paper')
    expect(afterTwoWins.matchWinner).toBe(1)
  })

  it('ignores plans once the match is over', () => {
    const over = playRound(playRound(start, 'rock', 'scissors'), 'rock', 'scissors')
    expect(playRound(over, 'rock', 'paper')).toBe(over)
  })
})
