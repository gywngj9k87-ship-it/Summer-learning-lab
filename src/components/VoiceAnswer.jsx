import React, { useRef, useState } from 'react'

// Optional voice input. Uses the browser's SpeechRecognition where available
// (great in Chrome; limited/absent on iPad Safari). If unsupported, the button
// simply doesn't render, so tap/type always remain the reliable path.
const SR =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export const voiceSupported = !!SR

export default function VoiceAnswer({ onTranscript, hint = 'Say your answer' }) {
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  if (!SR) return null

  function start() {
    try {
      const rec = new SR()
      rec.lang = 'en-US'
      rec.interimResults = false
      rec.maxAlternatives = 3
      rec.onresult = (e) => {
        const alts = Array.from(e.results[0]).map((r) => r.transcript)
        onTranscript(alts)
      }
      rec.onend = () => setListening(false)
      rec.onerror = () => setListening(false)
      recRef.current = rec
      rec.start()
      setListening(true)
    } catch {
      setListening(false)
    }
  }
  function stop() {
    recRef.current?.stop()
    setListening(false)
  }

  return (
    <button
      className={`btn voice ${listening ? 'listening' : ''}`}
      onClick={listening ? stop : start}
      title={hint}
      type="button"
    >
      {listening ? '🎙️ Listening…' : '🎤 Speak'}
    </button>
  )
}

// Try to map a spoken phrase to one of the given option strings (or a letter
// A/B/C/D or a number). Returns the matched option index, or -1.
export function matchSpokenAnswer(alternatives, options) {
  const letters = ['a', 'b', 'c', 'd', 'e']
  for (const raw of alternatives) {
    const said = String(raw).trim().toLowerCase().replace(/[.?!]/g, '')
    // Letter cue: "b", "option b", "letter b"
    const lm = said.match(/\b([a-e])\b/)
    if (lm) {
      const idx = letters.indexOf(lm[1])
      if (idx >= 0 && idx < options.length) return idx
    }
    // Number cue: "two", "2"
    const numWords = { one: 0, two: 1, three: 2, four: 3, five: 4 }
    if (numWords[said] !== undefined && numWords[said] < options.length) return numWords[said]
    const nm = said.match(/\b([1-5])\b/)
    if (nm) {
      const idx = Number(nm[1]) - 1
      if (idx < options.length) return idx
    }
    // Direct text match against an option.
    const exact = options.findIndex((o) => String(o).toLowerCase() === said)
    if (exact >= 0) return exact
    const partial = options.findIndex(
      (o) => said && String(o).toLowerCase().includes(said),
    )
    if (partial >= 0) return partial
  }
  return -1
}
