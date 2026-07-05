import React, { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { getTopic, seedFrom } from '../data/topics.js'
import { getLevel, selectQuizItems } from '../lib/adaptive.js'
import VoiceAnswer, { matchSpokenAnswer } from './VoiceAnswer.jsx'

const LETTERS = ['A', 'B', 'C', 'D']

// Friday test: a mixed quiz across the week's topics. Unlike practice, answers
// aren't revealed until the end — then it shows the score and awards bonus
// points. Difficulty of each topic's questions follows that topic's level.
export default function FridayTest({ onDone }) {
  const { profile, kid, dayNumber, recordTest } = useApp()
  const ageLevel = kid.level

  const questions = useMemo(() => {
    const topicIds = ['geography', 'history', 'generalKnowledge']
    if (kid.hasMUN) topicIds.push('mun')
    const pool = []
    for (const tid of topicIds) {
      const bank = getTopic(tid).bank[ageLevel] || []
      const lvl = getLevel(profile, tid)
      pool.push(...selectQuizItems(bank, lvl, seedFrom('friday', tid, dayNumber), 3))
    }
    // Shuffle and cap at 10.
    let s = seedFrom('friday-test', kid.key, dayNumber)
    const rand = () => {
      s = (s + 0x6d2b79f5) >>> 0
      let x = Math.imul(s ^ (s >>> 15), 1 | s)
      x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296
    }
    const a = pool.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a.slice(0, 10)
  }, [profile, kid, dayNumber, ageLevel])

  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [awarded, setAwarded] = useState(0)

  if (questions.length === 0) {
    return (
      <div className="activity">
        <p>No test available yet — do a few activities first!</p>
        <button className="btn primary" onClick={onDone}>Back</button>
      </div>
    )
  }

  const q = questions[idx]
  const isLast = idx === questions.length - 1

  function pick(optIdx) {
    setAnswers((a) => ({ ...a, [idx]: optIdx }))
  }
  function onVoice(alts) {
    const m = matchSpokenAnswer(alts, q.choices)
    if (m >= 0) pick(m)
  }
  function submit() {
    let score = 0
    questions.forEach((question, i) => {
      if (answers[i] === question.answer) score++
    })
    const points = score * 10 + 20 // per-correct + completion bonus
    recordTest({ score, total: questions.length, points })
    setAwarded(points)
    setSubmitted(true)
  }

  if (submitted) {
    let score = 0
    questions.forEach((question, i) => { if (answers[i] === question.answer) score++ })
    return (
      <div className="activity result-screen">
        <div className="result-emoji">📝</div>
        <h2>Test complete!</h2>
        <p className="big-score">{score} / {questions.length}</p>
        <p className="level-change">🎉 +{awarded} bonus points added!</p>
        <button className="btn primary big" onClick={onDone}>Back to Today</button>
      </div>
    )
  }

  const chosen = answers[idx]

  return (
    <div className="activity">
      <div className="activity-head">
        <button className="btn ghost sm" onClick={onDone}>← Back</button>
        <div className="activity-title"><h2>📝 Friday Test</h2><span className="muted">Answer all, then submit.</span></div>
        <span className="pill">{idx + 1} / {questions.length}</span>
      </div>

      <div className="question">
        <p className="q-text">{q.q}</p>
        <div className="options">
          {q.choices.map((c, i) => (
            <button key={i} className={`option ${chosen === i ? 'chosen' : ''}`} onClick={() => pick(i)}>
              <span className="opt-letter">{LETTERS[i]}</span><span>{c}</span>
            </button>
          ))}
        </div>
        <div className="activity-controls">
          <VoiceAnswer onTranscript={onVoice} />
          <button className="btn ghost" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>← Prev</button>
          <div className="spacer" />
          {!isLast && <button className="btn primary" onClick={() => setIdx((i) => i + 1)}>Next →</button>}
          {isLast && (
            <button className="btn primary" disabled={Object.keys(answers).length < questions.length} onClick={submit}>
              Submit test
            </button>
          )}
        </div>
        <p className="muted answered-count">Answered {Object.keys(answers).length} of {questions.length}</p>
      </div>
    </div>
  )
}
