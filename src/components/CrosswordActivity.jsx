import React, { useMemo, useState, useEffect } from 'react'
import Scratchpad from './Scratchpad.jsx'

const KB = 'abcdefghijklmnopqrstuvwxyz'

// Mini crossword. Tap a cell (or a clue) to select an entry, then type/tap
// letters. A limited number of "reveal letter" helps is allowed, based on the
// adaptive level. Reports correct words / total words.
export default function CrosswordActivity({ puzzle, maxReveals, title, onComplete, onExit }) {
  const { size, entries } = puzzle

  // Build cell map: "r,c" -> { sol, num }
  const cells = useMemo(() => {
    const map = {}
    entries.forEach((e) => {
      for (let i = 0; i < e.answer.length; i++) {
        const r = e.dir === 'down' ? e.row + i : e.row
        const c = e.dir === 'across' ? e.col + i : e.col
        const key = `${r},${c}`
        if (!map[key]) map[key] = { sol: e.answer[i], num: null }
        if (i === 0 && map[key].num == null) map[key].num = e.num
      }
    })
    return map
  }, [entries])

  const [values, setValues] = useState({})
  const [activeEntry, setActiveEntry] = useState(0)
  const [activePos, setActivePos] = useState(0)
  const [checked, setChecked] = useState(null)
  const [reveals, setReveals] = useState(0)
  const [finished, setFinished] = useState(false)

  function entryCells(e) {
    const out = []
    for (let i = 0; i < e.answer.length; i++) {
      const r = e.dir === 'down' ? e.row + i : e.row
      const c = e.dir === 'across' ? e.col + i : e.col
      out.push({ r, c, key: `${r},${c}` })
    }
    return out
  }

  const active = entries[activeEntry]
  const activeCellKeys = entryCells(active).map((x) => x.key)

  function selectCell(r, c) {
    const key = `${r},${c}`
    if (!cells[key]) return
    // Prefer an across entry through this cell, else down.
    const covering = entries
      .map((e, idx) => ({ e, idx, cells: entryCells(e) }))
      .filter((x) => x.cells.some((cc) => cc.key === key))
    if (covering.length === 0) return
    const pick = covering.find((x) => x.e.dir === 'across') || covering[0]
    setActiveEntry(pick.idx)
    setActivePos(pick.cells.findIndex((cc) => cc.key === key))
    setChecked(null)
  }

  function typeLetter(ch) {
    const cs = entryCells(active)
    const cell = cs[activePos]
    if (!cell) return
    setValues((v) => ({ ...v, [cell.key]: ch.toUpperCase() }))
    setChecked(null)
    if (activePos < cs.length - 1) setActivePos((p) => p + 1)
  }
  function backspace() {
    const cs = entryCells(active)
    const cell = cs[activePos]
    setValues((v) => {
      const copy = { ...v }
      if (copy[cell.key]) delete copy[cell.key]
      return copy
    })
    if (activePos > 0) setActivePos((p) => p - 1)
  }
  function revealLetter() {
    if (reveals >= maxReveals) return
    const cs = entryCells(active)
    const cell = cs[activePos]
    setValues((v) => ({ ...v, [cell.key]: cells[cell.key].sol }))
    setReveals((n) => n + 1)
    if (activePos < cs.length - 1) setActivePos((p) => p + 1)
  }

  useEffect(() => {
    function onKey(e) {
      if (/^[a-zA-Z]$/.test(e.key)) typeLetter(e.key)
      else if (e.key === 'Backspace') backspace()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function correctEntries() {
    return entries.filter((e) =>
      entryCells(e).every((cell) => (values[cell.key] || '') === cells[cell.key].sol),
    ).length
  }

  function finish() {
    if (finished) return
    setFinished(true)
    const correct = correctEntries()
    onComplete({ correct, total: entries.length, points: correct * 8 })
  }

  const grid = []
  for (let r = 0; r < size.rows; r++) {
    const row = []
    for (let c = 0; c < size.cols; c++) {
      const key = `${r},${c}`
      const cell = cells[key]
      if (!cell) {
        row.push(<div key={key} className="cw-cell blank" />)
        continue
      }
      const val = values[key] || ''
      const inActive = activeCellKeys.includes(key)
      const wrong = checked && val && val !== cell.sol
      row.push(
        <button
          key={key}
          className={`cw-cell ${inActive ? 'active' : ''} ${wrong ? 'wrong' : ''}`}
          onClick={() => selectCell(r, c)}
        >
          {cell.num && <span className="cw-num">{cell.num}</span>}
          <span className="cw-letter">{val}</span>
        </button>,
      )
    }
    grid.push(<div key={r} className="cw-row">{row}</div>)
  }

  const across = entries.filter((e) => e.dir === 'across')
  const down = entries.filter((e) => e.dir === 'down')

  return (
    <div className="activity">
      <div className="activity-head">
        <button className="btn ghost sm" onClick={onExit}>← Back</button>
        <div className="activity-title"><h2>{title}</h2><span className="muted">Tap a clue or a square, then type the letters.</span></div>
        <span className="pill">Helps left: {Math.max(0, maxReveals - reveals)}</span>
      </div>

      <div className="crossword-layout">
        <div className="cw-grid" style={{ '--cols': size.cols }}>{grid}</div>
        <div className="clues">
          <ClueList title="Across" list={across} entries={entries} activeEntry={activeEntry} onPick={(idx) => { setActiveEntry(idx); setActivePos(0); }} />
          <ClueList title="Down" list={down} entries={entries} activeEntry={activeEntry} onPick={(idx) => { setActiveEntry(idx); setActivePos(0); }} />
        </div>
      </div>

      <div className="keyboard compact">
        {['abcdefghij', 'klmnopqrs', 'tuvwxyz'].map((row, ri) => (
          <div className="kb-row" key={ri}>
            {row.split('').map((ch) => (
              <button key={ch} className="key" onClick={() => typeLetter(ch)}>{ch.toUpperCase()}</button>
            ))}
            {ri === 2 && <button className="key wide" onClick={backspace}>⌫</button>}
          </div>
        ))}
      </div>

      {checked != null && (
        <div className={`feedback ${checked === entries.length ? 'good' : 'bad'}`}>
          {checked} of {entries.length} words correct{checked === entries.length ? ' — nice!' : ' so far.'}
        </div>
      )}

      <div className="activity-controls">
        <button className="btn ghost" onClick={() => setChecked(correctEntries())}>Check</button>
        <button className="btn ghost" onClick={revealLetter} disabled={reveals >= maxReveals}>Reveal letter</button>
        <Scratchpad />
        <div className="spacer" />
        <button className="btn primary" onClick={finish}>Finish</button>
      </div>
    </div>
  )
}

function ClueList({ title, list, entries, activeEntry, onPick }) {
  return (
    <div className="clue-group">
      <h4>{title}</h4>
      <ol>
        {list.map((e) => {
          const idx = entries.indexOf(e)
          return (
            <li key={`${e.dir}-${e.num}`}>
              <button className={`clue ${idx === activeEntry ? 'active' : ''}`} onClick={() => onPick(idx)}>
                <b>{e.num}.</b> {e.clue}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
