import React, { useState } from 'react'
import VoiceAnswer, { matchSpokenAnswer } from './VoiceAnswer.jsx'
import Scratchpad from './Scratchpad.jsx'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

// Generic multiple-choice runner. Used by all quiz topics and by reading
// comprehension (which also shows a passage). Reports {correct, total, points}.
export default function QuizActivity({
  title,
  subtitle,
  passage,
  questions,
  pointsPerCorrect = 10,
  onComplete,
  onExit,
}) {
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)

  const q = questions[idx]
  const isLast = idx === questions.length - 1
  const revealed = chosen !== null

  function choose(optionIdx) {
    if (revealed) return
    setChosen(optionIdx)
    if (optionIdx === q.answer) setCorrectCount((c) => c + 1)
  }

  function next() {
    if (isLast) {
      const total = questions.length
      const bonus = correctCount === total ? 10 : 0
      const points = correctCount * pointsPerCorrect + bonus
      onComplete({ correct: correctCount, total, points })
    } else {
      setIdx((i) => i + 1)
      setChosen(null)
    }
  }

  function onVoice(alts) {
    const m = matchSpokenAnswer(alts, q.choices)
    if (m >= 0) choose(m)
  }

  return (
    <div className="activity">
      <div className="activity-head">
        <button className="btn ghost sm" onClick={onExit}>← Back</button>
        <div className="activity-title">
          <h2>{title}</h2>
          {subtitle && <span className="muted">{subtitle}</span>}
        </div>
        <span className="pill">{idx + 1} / {questions.length}</span>
      </div>

      {passage && (
        <div className="passage">
          <p>{passage}</p>
        </div>
      )}

      <div className="question">
        <p className="q-text">{q.q}</p>
        <div className="options">
          {q.choices.map((c, i) => {
            let cls = 'option'
            if (revealed && i === q.answer) cls += ' correct'
            else if (revealed && i === chosen) cls += ' wrong'
            return (
              <button key={i} className={cls} onClick={() => choose(i)} disabled={revealed}>
                <span className="opt-letter">{LETTERS[i]}</span>
                <span>{c}</span>
              </button>
            )
          })}
        </div>

        {revealed && (
          <div className={`feedback ${chosen === q.answer ? 'good' : 'bad'}`}>
            {chosen === q.answer ? '✅ Correct!' : `❌ The answer is ${LETTERS[q.answer]}: ${q.choices[q.answer]}`}
          </div>
        )}

        <div className="activity-controls">
          <VoiceAnswer onTranscript={onVoice} />
          <Scratchpad />
          <div className="spacer" />
          {revealed && (
            <button className="btn primary" onClick={next}>
              {isLast ? 'Finish' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
