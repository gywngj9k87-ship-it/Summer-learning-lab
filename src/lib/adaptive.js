// Adaptive difficulty.
//
// Each kid has a per-topic level from 1 (easiest) to 5 (hardest), starting at
// 2. After every session we look at how well they did:
//   • Aced it (>= 85% correct)      -> level goes UP one (harder next time)
//   • Struggled (<= 45% correct)    -> level goes DOWN one (easier next time)
//   • In between                    -> level stays the same
// Levels are stored on the profile and drive question selection and puzzle
// hardness, so the challenge tracks each kid's real performance.

import { makeRng } from './sudoku.js'

export const MIN_LEVEL = 1
export const MAX_LEVEL = 5
export const START_LEVEL = 2

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

export function getLevel(profile, topicId) {
  const l = profile?.levels?.[topicId]
  return typeof l === 'number' ? clamp(l, MIN_LEVEL, MAX_LEVEL) : START_LEVEL
}

// Given a current level and a session accuracy (0..1), return the next level
// and a human label describing the change.
export function nextLevel(current, accuracy) {
  let next = current
  if (accuracy >= 0.85) next = clamp(current + 1, MIN_LEVEL, MAX_LEVEL)
  else if (accuracy <= 0.45) next = clamp(current - 1, MIN_LEVEL, MAX_LEVEL)
  let change = 'same'
  if (next > current) change = 'up'
  else if (next < current) change = 'down'
  return { next, change }
}

export function levelLabel(level) {
  return ['Warm-up', 'Easy', 'Medium', 'Hard', 'Expert'][clamp(level, 1, 5) - 1]
}

function seededShuffle(arr, seed) {
  const rand = makeRng(seed >>> 0)
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// How many quiz questions to serve at a given level (more when they're doing
// well, so the session grows with mastery).
export function quizCount(level) {
  return [3, 4, 5, 6, 7][clamp(level, 1, 5) - 1]
}

// Pick quiz items appropriate to the level. Banks are ordered roughly
// easy -> hard, so a higher level draws from a harder band. `seed` rotates the
// selection day to day so kids see fresh questions ("learn new things").
export function selectQuizItems(bank, level, seed, desiredCount) {
  const n = bank.length
  if (n === 0) return []
  const count = Math.min(desiredCount ?? quizCount(level), n)
  const f = (clamp(level, 1, 5) - 1) / 4
  const bandWidth = Math.min(n, count + 3)
  const maxStart = n - bandWidth
  const start = Math.round(maxStart * f)
  const band = bank.slice(start, start + bandWidth)
  return seededShuffle(band, seed).slice(0, count)
}

// Sudoku clue counts by level and age band (fewer clues = harder).
export function sudokuClues(level, ageLevel) {
  const l = clamp(level, 1, 5) - 1
  if (ageLevel === 'junior') return [10, 9, 8, 7, 6][l] // 4x4 grid (16 cells)
  return [42, 40, 37, 34, 30][l] // 9x9 grid (81 cells)
}

// Wordle settings by level: fewer guesses and no starting-letter hint at higher
// levels; gentler for the junior player.
export function wordleSettings(level, ageLevel) {
  const l = clamp(level, 1, 5)
  if (ageLevel === 'junior') {
    return { maxGuesses: 6, showFirstLetter: l <= 2 }
  }
  return { maxGuesses: [6, 6, 5, 5, 4][l - 1], showFirstLetter: l <= 1 }
}

// Crossword help: how many "reveal a letter" helps are allowed (more at lower
// levels).
export function crosswordReveals(level) {
  return [4, 3, 2, 1, 0][clamp(level, 1, 5) - 1]
}
