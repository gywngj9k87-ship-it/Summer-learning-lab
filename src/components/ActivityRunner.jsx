import React, { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { getTopic, seedFrom } from '../data/topics.js'
import {
  getLevel, levelLabel, selectQuizItems, quizCount, pickFreshItem,
  sudokuClues, wordleSettings, crosswordReveals,
} from '../lib/adaptive.js'
import { generateSudoku } from '../lib/sudoku.js'
import { pickWord } from '../lib/words.js'
import QuizActivity from './QuizActivity.jsx'
import SudokuActivity from './SudokuActivity.jsx'
import WordleActivity from './WordleActivity.jsx'
import CrosswordActivity from './CrosswordActivity.jsx'
import VocabularyActivity from './VocabularyActivity.jsx'

export default function ActivityRunner({ topicId, onDone }) {
  const { profile, kid, dayNumber, completeActivity, markSeen, recentSeen } = useApp()
  const topic = getTopic(topicId)
  const ageLevel = kid.level // 'junior' | 'senior'
  const level = getLevel(profile, topicId)
  const seed = seedFrom(kid.key, dayNumber, topicId, level)
  const [result, setResult] = useState(null)

  // Build the activity ONCE on mount. Excludes items seen in the last week so
  // nothing repeats. Kept in state (not useMemo) so a mid-activity re-render
  // from markSeen doesn't regenerate the questions under the child's feet.
  const [built] = useState(() => {
    if (!topic) return { content: null, servedIds: [] }
    switch (topic.kind) {
      case 'quiz': {
        const bank = topic.bank[ageLevel] || []
        const items = selectQuizItems(bank, level, seed, quizCount(level), recentSeen(topicId))
        return { content: { items }, servedIds: items.map((i) => i.id) }
      }
      case 'vocab': {
        const bank = topic.bank[ageLevel] || []
        // Fewer items than a plain quiz since each word has two parts.
        const count = Math.min(4, quizCount(level))
        const words = selectQuizItems(bank, level, seed, count, recentSeen(topicId))
        return { content: { words }, servedIds: words.map((wd) => wd.id) }
      }
      case 'reading': {
        const bank = topic.bank[ageLevel] || []
        const passage = pickFreshItem(bank, level, seed, recentSeen(topicId))
        return { content: { passage }, servedIds: passage ? [passage.id] : [] }
      }
      case 'sudoku': {
        const n = ageLevel === 'junior' ? 4 : 9
        return { content: { game: generateSudoku(n, sudokuClues(level, ageLevel), seed) }, servedIds: [] }
      }
      case 'wordle':
        return {
          content: { word: pickWord(ageLevel, seed + level), settings: wordleSettings(level, ageLevel) },
          servedIds: [],
        }
      case 'crossword': {
        const bank = topic.bank[ageLevel] || []
        const puzzle = pickFreshItem(bank, level, seed, recentSeen(topicId))
        return { content: { puzzle, maxReveals: crosswordReveals(level) }, servedIds: puzzle ? [puzzle.id] : [] }
      }
      default:
        return { content: null, servedIds: [] }
    }
  })

  // Record served items as "seen today" so they won't reappear within a week.
  useEffect(() => {
    if (built.servedIds.length) markSeen(topicId, built.servedIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const content = built.content

  function handleComplete({ correct, total, points }) {
    const r = completeActivity({ topicId, correct, total, points })
    setResult({ correct, total, ...r })
  }

  if (!topic || !content) {
    return (
      <div className="activity">
        <p>Nothing to show here.</p>
        <button className="btn primary" onClick={onDone}>Back</button>
      </div>
    )
  }

  if (result) {
    const changeMsg =
      result.levelChange === 'up'
        ? '🔼 You aced it — next time will be a little harder!'
        : result.levelChange === 'down'
          ? '🔽 We’ll make the next one a bit easier.'
          : '➡️ Difficulty stays the same next time.'
    const headline = result.practice
      ? '✅ Nice practice!'
      : `+${result.pointsAwarded} points!`
    return (
      <div className="activity result-screen">
        <div className="result-emoji">{result.practice ? '💪' : '🏅'}</div>
        <h2>{headline}</h2>
        <p className="muted">
          {topic.label} — {result.correct}/{result.total} correct
        </p>
        {result.practice && (
          <p className="note">You already did this one today, so this round is just practice — no extra PS5 time. Great for learning though!</p>
        )}
        {!result.practice && result.pending && (
          <p className="note">🔒 These points are waiting — reach your <b>1-hour</b> learning goal today to unlock them for PS5.</p>
        )}
        {!result.practice && result.capped && (
          <p className="note">🎮 You’ve hit today’s PS5 cap — extra points still boost your lifetime score.</p>
        )}
        <p className="level-change">{changeMsg}</p>
        <button className="btn primary big" onClick={onDone}>Back to Today</button>
      </div>
    )
  }

  const subtitle = `${topic.label} · ${levelLabel(level)}`
  const common = { title: topic.label, onExit: onDone, onComplete: handleComplete }

  switch (topic.kind) {
    case 'quiz':
      return <QuizActivity {...common} subtitle={subtitle} questions={content.items} />
    case 'vocab':
      return <VocabularyActivity {...common} words={content.words} />
    case 'reading':
      return (
        <QuizActivity
          {...common}
          title={content.passage.title}
          subtitle="Reading — read, then answer"
          passage={content.passage.passage}
          questions={content.passage.questions}
          pointsPerCorrect={8}
        />
      )
    case 'sudoku':
      return <SudokuActivity {...common} game={content.game} level={level} />
    case 'wordle':
      return <WordleActivity {...common} answer={content.word} settings={content.settings} />
    case 'crossword':
      return <CrosswordActivity {...common} puzzle={content.puzzle} maxReveals={content.maxReveals} />
    default:
      return null
  }
}
