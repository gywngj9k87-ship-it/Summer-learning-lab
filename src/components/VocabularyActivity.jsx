import React, { useState } from 'react'
import VoiceAnswer, { matchSpokenAnswer } from './VoiceAnswer.jsx'
import Scratchpad from './Scratchpad.jsx'

const LETTERS = ['A', 'B', 'C', 'D']

// Vocabulary builder. For each word: (1) a meaning multiple-choice question,
// then (2) "use it in a sentence" — the child types/writes/speaks a sentence.
// The sentence is checked lightly (must include the word and be a full
// sentence), then a model example is revealed. Reports meaning accuracy for the
// adaptive engine and awards points for both parts.
export default function VocabularyActivity({ words, title, onComplete, onExit }) {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState('meaning') // 'meaning' | 'sentence'
  const [chosen, setChosen] = useState(null)
  const [sentence, setSentence] = useState('')
  const [sentenceState, setSentenceState] = useState(null) // null | 'ok' | 'retry'
  const [meaningCorrect, setMeaningCorrect] = useState(0)
  const [sentencesOk, setSentencesOk] = useState(0)

  const w = words[idx]
  const isLastWord = idx === words.length - 1

  function chooseMeaning(i) {
    if (chosen !== null) return
    setChosen(i)
    if (i === w.answer) setMeaningCorrect((c) => c + 1)
  }
  function onVoiceMeaning(alts) {
    const m = matchSpokenAnswer(alts, w.choices)
    if (m >= 0) chooseMeaning(m)
  }

  // Accept the sentence if it contains the word (or a close stem) and is a
  // reasonably complete sentence (a few words).
  function checkSentence() {
    const text = sentence.trim().toLowerCase()
    const wordCount = text.split(/\s+/).filter(Boolean).length
    const stem = w.word.toLowerCase().slice(0, Math.max(4, w.word.length - 2))
    const usesWord = text.includes(w.word.toLowerCase()) || text.includes(stem)
    if (usesWord && wordCount >= 4) {
      setSentenceState('ok')
      setSentencesOk((c) => c + 1)
    } else {
      setSentenceState('retry')
    }
  }

  function nextWord() {
    if (isLastWord) {
      const total = words.length
      const points = meaningCorrect * 8 + sentencesOk * 5 + (meaningCorrect === total ? 10 : 0)
      onComplete({ correct: meaningCorrect, total, points })
    } else {
      setIdx((i) => i + 1)
      setPhase('meaning')
      setChosen(null)
      setSentence('')
      setSentenceState(null)
    }
  }

  return (
    <div className="activity">
      <div className="activity-head">
        <button className="btn ghost sm" onClick={onExit}>← Back</button>
        <div className="activity-title"><h2>Vocabulary</h2><span className="muted">Learn the word, then use it</span></div>
        <span className="pill">{idx + 1} / {words.length}</span>
      </div>

      <div className="vocab-word-card">
        <span className="vocab-word">{w.word}</span>
      </div>

      {phase === 'meaning' ? (
        <div className="question">
          <p className="q-text">What does <b>{w.word}</b> mean?</p>
          <div className="options">
            {w.choices.map((c, i) => {
              let cls = 'option'
              if (chosen !== null && i === w.answer) cls += ' correct'
              else if (chosen !== null && i === chosen) cls += ' wrong'
              return (
                <button key={i} className={cls} onClick={() => chooseMeaning(i)} disabled={chosen !== null}>
                  <span className="opt-letter">{LETTERS[i]}</span><span>{c}</span>
                </button>
              )
            })}
          </div>
          {chosen !== null && (
            <div className={`feedback ${chosen === w.answer ? 'good' : 'bad'}`}>
              {chosen === w.answer ? '✅ Correct!' : `❌ It means: ${w.meaning}`}
            </div>
          )}
          <div className="activity-controls">
            <VoiceAnswer onTranscript={onVoiceMeaning} />
            <div className="spacer" />
            {chosen !== null && (
              <button className="btn primary" onClick={() => setPhase('sentence')}>Next: use it →</button>
            )}
          </div>
        </div>
      ) : (
        <div className="question">
          <p className="q-text">Now use <b>{w.word}</b> in a sentence of your own:</p>
          <textarea
            className="sentence-input"
            value={sentence}
            onChange={(e) => { setSentence(e.target.value); setSentenceState(null) }}
            placeholder={`Write a sentence with the word "${w.word}"…`}
            rows={3}
          />
          {sentenceState === 'ok' && (
            <div className="feedback good">
              🌟 Nice sentence! Here’s another example: <em>{w.example}</em>
            </div>
          )}
          {sentenceState === 'retry' && (
            <div className="feedback bad">
              Try again — write a full sentence that includes the word “{w.word}”.
            </div>
          )}
          <div className="activity-controls">
            <VoiceAnswer onTranscript={(alts) => setSentence(alts[0] || '')} hint="Speak your sentence" />
            <Scratchpad />
            <div className="spacer" />
            {sentenceState !== 'ok' ? (
              <>
                <button className="btn ghost sm" onClick={nextWord}>Skip</button>
                <button className="btn primary" onClick={checkSentence} disabled={!sentence.trim()}>Check</button>
              </>
            ) : (
              <button className="btn primary" onClick={nextWord}>{isLastWord ? 'Finish' : 'Next word →'}</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
