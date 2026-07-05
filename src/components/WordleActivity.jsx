import React, { useCallback, useEffect, useState } from 'react'

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

// Guess-the-word game with color feedback. On-screen keyboard means no physical
// keyboard is needed (tap or Apple Pencil), but physical typing also works.
export default function WordleActivity({ answer, settings, title, onComplete, onExit }) {
  const word = answer.toUpperCase()
  const len = word.length
  const maxGuesses = settings.maxGuesses
  const [guesses, setGuesses] = useState([])
  const [current, setCurrent] = useState(settings.showFirstLetter ? word[0] : '')
  const [status, setStatus] = useState('playing') // playing | won | lost
  const [finished, setFinished] = useState(false)

  const evaluate = useCallback(
    (guess) => {
      const res = Array(len).fill('absent')
      const counts = {}
      for (const ch of word) counts[ch] = (counts[ch] || 0) + 1
      for (let i = 0; i < len; i++) {
        if (guess[i] === word[i]) {
          res[i] = 'correct'
          counts[guess[i]]--
        }
      }
      for (let i = 0; i < len; i++) {
        if (res[i] === 'correct') continue
        if (counts[guess[i]] > 0) {
          res[i] = 'present'
          counts[guess[i]]--
        }
      }
      return res
    },
    [word, len],
  )

  const submit = useCallback(() => {
    if (current.length !== len || status !== 'playing') return
    const guess = current.toUpperCase()
    const nextGuesses = [...guesses, guess]
    setGuesses(nextGuesses)
    setCurrent(settings.showFirstLetter ? word[0] : '')
    if (guess === word) setStatus('won')
    else if (nextGuesses.length >= maxGuesses) setStatus('lost')
  }, [current, len, status, guesses, settings.showFirstLetter, word, maxGuesses])

  const typeChar = useCallback(
    (ch) => {
      if (status !== 'playing') return
      if (current.length < len) setCurrent((s) => s + ch.toUpperCase())
    },
    [status, current, len],
  )
  const backspace = useCallback(() => {
    const floor = settings.showFirstLetter ? 1 : 0
    setCurrent((s) => (s.length > floor ? s.slice(0, -1) : s))
  }, [settings.showFirstLetter])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Enter') submit()
      else if (e.key === 'Backspace') backspace()
      else if (/^[a-zA-Z]$/.test(e.key)) typeChar(e.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [submit, backspace, typeChar])

  // Letter states for keyboard coloring.
  const keyState = {}
  for (const g of guesses) {
    const res = evaluate(g)
    for (let i = 0; i < len; i++) {
      const ch = g[i].toLowerCase()
      const rank = { correct: 3, present: 2, absent: 1 }
      if (!keyState[ch] || rank[res[i]] > rank[keyState[ch]]) keyState[ch] = res[i]
    }
  }

  function finish() {
    if (finished) return
    setFinished(true)
    if (status === 'won') {
      const used = guesses.length
      const points = Math.max(10, 25 - (used - 1) * 3)
      onComplete({ correct: 1, total: 1, points })
    } else {
      onComplete({ correct: 0, total: 1, points: 5 })
    }
  }

  const rows = []
  for (let r = 0; r < maxGuesses; r++) {
    if (r < guesses.length) {
      const res = evaluate(guesses[r])
      rows.push(
        <div className="wr-row" key={r}>
          {guesses[r].split('').map((ch, i) => (
            <div key={i} className={`wr-tile ${res[i]}`}>{ch}</div>
          ))}
        </div>,
      )
    } else if (r === guesses.length && status === 'playing') {
      rows.push(
        <div className="wr-row" key={r}>
          {Array.from({ length: len }, (_, i) => (
            <div key={i} className={`wr-tile ${current[i] ? 'filled' : ''}`}>{current[i] || ''}</div>
          ))}
        </div>,
      )
    } else {
      rows.push(
        <div className="wr-row" key={r}>
          {Array.from({ length: len }, (_, i) => <div key={i} className="wr-tile" />)}
        </div>,
      )
    }
  }

  return (
    <div className="activity">
      <div className="activity-head">
        <button className="btn ghost sm" onClick={onExit}>← Back</button>
        <div className="activity-title"><h2>{title}</h2><span className="muted">Guess the {len}-letter word.</span></div>
        <span className="pill">{guesses.length}/{maxGuesses}</span>
      </div>

      <div className="wordle-board">{rows}</div>

      {status !== 'playing' && (
        <div className={`feedback ${status === 'won' ? 'good' : 'bad'}`}>
          {status === 'won' ? '🎉 You got it!' : `The word was ${word}.`}
        </div>
      )}

      {status === 'playing' ? (
        <div className="keyboard">
          {ROWS.map((row, ri) => (
            <div className="kb-row" key={ri}>
              {ri === 2 && <button className="key wide" onClick={submit}>Enter</button>}
              {row.split('').map((ch) => (
                <button key={ch} className={`key ${keyState[ch] || ''}`} onClick={() => typeChar(ch)}>{ch.toUpperCase()}</button>
              ))}
              {ri === 2 && <button className="key wide" onClick={backspace}>⌫</button>}
            </div>
          ))}
        </div>
      ) : (
        <div className="activity-controls">
          <div className="spacer" />
          <button className="btn primary" onClick={finish}>Finish</button>
        </div>
      )}
    </div>
  )
}
