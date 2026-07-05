import React, { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { getTopic, seedFrom } from '../data/topics.js'
import {
  getLevel, levelLabel, selectQuizItems, quizCount,
  sudokuClues, wordleSettings, crosswordReveals,
} from '../lib/adaptive.js'
import { generateSudoku } from '../lib/sudoku.js'
import { pickWord } from '../lib/words.js'
import QuizActivity from './QuizActivity.jsx'
import SudokuActivity from './SudokuActivity.jsx'
import WordleActivity from './WordleActivity.jsx'
import CrosswordActivity from './CrosswordActivity.jsx'

export default function ActivityRunner({ topicId, onDone }) {
  const { profile, kid, dayNumber, completeActivity } = useApp()
  const topic = getTopic(topicId)
  const ageLevel = kid.level // 'junior' | 'senior'
  const level = getLevel(profile, topicId)
  const seed = seedFrom(kid.key, dayNumber, topicId, level)
  const [result, setResult] = useState(null)

  const content = useMemo(() => {
    if (!topic) return null
    switch (topic.kind) {
      case 'quiz': {
        const bank = topic.bank[ageLevel] || []
        return { items: selectQuizItems(bank, level, seed, quizCount(level)) }
      }
      case 'reading': {
        const bank = topic.bank[ageLevel] || []
        const f = (level - 1) / 4
        const base = Math.round((bank.length - 1) * f)
        const idx = bank.length ? (base + dayNumber) % bank.length : 0
        return { passage: bank[idx] }
      }
      case 'sudoku': {
        const n = ageLevel === 'junior' ? 4 : 9
        return { game: generateSudoku(n, sudokuClues(level, ageLevel), seed) }
      }
      case 'wordle':
        return { word: pickWord(ageLevel, seed + level), settings: wordleSettings(level, ageLevel) }
      case 'crossword': {
        const bank = topic.bank[ageLevel] || []
        const puzzle = bank[(seed + dayNumber) % bank.length]
        return { puzzle, maxReveals: crosswordReveals(level) }
      }
      default:
        return null
    }
  }, [topic, ageLevel, level, seed, dayNumber])

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
    return (
      <div className="activity result-screen">
        <div className="result-emoji">🏅</div>
        <h2>+{result.pointsAwarded} points!</h2>
        <p className="muted">
          {topic.label} — {result.correct}/{result.total} correct
        </p>
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
