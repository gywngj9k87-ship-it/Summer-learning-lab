import { geography } from './geography.js'
import { history } from './history.js'
import { generalKnowledge } from './generalKnowledge.js'
import { mun } from './mun.js'
import { reading } from './reading.js'
import { crosswords } from './crosswords.js'
import { vocabulary } from './vocabulary.js'

// Master registry of learning topics. `kind` tells the ActivityRunner which
// component to render. Quiz/reading/crossword/vocab topics carry their data.
export const TOPICS = [
  { id: 'reading', label: 'Reading', emoji: '📖', kind: 'reading', bank: reading },
  { id: 'vocabulary', label: 'Vocabulary', emoji: '🗣️', kind: 'vocab', bank: vocabulary },
  { id: 'sudoku', label: 'Sudoku', emoji: '🔢', kind: 'sudoku' },
  { id: 'wordle', label: 'Word Guess', emoji: '🔤', kind: 'wordle' },
  { id: 'crossword', label: 'Crossword', emoji: '🧩', kind: 'crossword', bank: crosswords },
  { id: 'geography', label: 'Geography', emoji: '🌍', kind: 'quiz', bank: geography },
  { id: 'history', label: 'History', emoji: '🏛️', kind: 'quiz', bank: history },
  { id: 'generalKnowledge', label: 'General Knowledge', emoji: '💡', kind: 'quiz', bank: generalKnowledge },
  { id: 'mun', label: 'Model UN', emoji: '🕊️', kind: 'quiz', bank: mun, seniorOnly: true },
]

export function getTopic(id) {
  return TOPICS.find((t) => t.id === id) || null
}

// Topics available to a given kid (MUN is senior-only, and only if enabled).
export function topicsFor(hasMUN) {
  return TOPICS.filter((t) => !t.seniorOnly || hasMUN)
}

// Small string hash -> 32-bit int, used to seed puzzles/selection so the same
// (kid, day, topic) is reproducible within a day but varies across days.
export function seedFrom(...parts) {
  const s = parts.join('|')
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function seededShuffle(arr, seed) {
  let t = seed >>> 0
  const rand = () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Build a mixed set of activities for a given day. Different days surface
// different topics (rotated by the day seed) while guaranteeing a spread of
// at least one puzzle, one quiz, and reading.
export function buildDailyPlan({ hasMUN, dayNumber, size = 5 }) {
  const all = topicsFor(hasMUN)
  const seed = seedFrom('plan', dayNumber)
  const shuffled = seededShuffle(all, seed)

  const puzzles = shuffled.filter((t) => ['sudoku', 'wordle', 'crossword'].includes(t.id))
  const quizzes = shuffled.filter((t) => t.kind === 'quiz')
  const reading = shuffled.filter((t) => t.id === 'reading')

  const plan = []
  const push = (t) => {
    if (t && !plan.find((p) => p.id === t.id)) plan.push(t)
  }

  // Guarantee a balanced core, then fill the rest from the shuffled list.
  push(reading[0])
  push(puzzles[0])
  push(quizzes[0])
  if (hasMUN) push(quizzes.find((t) => t.id === 'mun'))
  for (const t of shuffled) {
    if (plan.length >= size) break
    push(t)
  }
  return plan.slice(0, size).map((t) => ({
    id: t.id,
    label: t.label,
    emoji: t.emoji,
    kind: t.kind,
  }))
}
