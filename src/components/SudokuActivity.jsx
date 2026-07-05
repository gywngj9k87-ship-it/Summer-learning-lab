import React, { useMemo, useState } from 'react'
import Scratchpad from './Scratchpad.jsx'

// Interactive Sudoku. Given cells (0 = blank) are locked; the child taps a
// blank cell then a number. Solves are auto-detected. Reports success/fail.
export default function SudokuActivity({ game, level, title, onComplete, onExit }) {
  const { puzzle, solution, n, box } = game
  const [grid, setGrid] = useState(() => puzzle.map((r) => r.slice()))
  const [sel, setSel] = useState(null) // [row,col]
  const [checked, setChecked] = useState(false)
  const [done, setDone] = useState(false)

  const locked = useMemo(
    () => puzzle.map((r) => r.map((v) => v !== 0)),
    [puzzle],
  )

  const solved = useMemo(
    () => grid.every((row, r) => row.every((v, c) => v === solution[r][c])),
    [grid, solution],
  )

  function place(val) {
    if (!sel || done) return
    const [r, c] = sel
    if (locked[r][c]) return
    setChecked(false)
    setGrid((g) => {
      const copy = g.map((row) => row.slice())
      copy[r][c] = copy[r][c] === val ? 0 : val
      return copy
    })
  }

  function finish() {
    if (solved) {
      const points = level >= 4 ? 45 : level >= 2 ? 35 : 25
      setDone(true)
      onComplete({ correct: 1, total: 1, points })
    }
  }
  function giveUp() {
    onComplete({ correct: 0, total: 1, points: 0 })
  }

  const [br, bc] = box

  return (
    <div className="activity">
      <div className="activity-head">
        <button className="btn ghost sm" onClick={onExit}>← Back</button>
        <div className="activity-title"><h2>{title}</h2><span className="muted">Fill every row, column and box with each number once.</span></div>
        <span className="pill">{n}×{n}</span>
      </div>

      <div className="sudoku-wrap">
        <div className="sudoku" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {grid.map((row, r) =>
            row.map((v, c) => {
              const isSel = sel && sel[0] === r && sel[1] === c
              const wrong = checked && v !== 0 && v !== solution[r][c]
              const cls = [
                'cell',
                locked[r][c] ? 'given' : 'editable',
                isSel ? 'sel' : '',
                wrong ? 'wrong' : '',
                (c + 1) % bc === 0 && c !== n - 1 ? 'box-right' : '',
                (r + 1) % br === 0 && r !== n - 1 ? 'box-bottom' : '',
              ].join(' ')
              return (
                <button key={`${r}-${c}`} className={cls} onClick={() => !locked[r][c] && setSel([r, c])}>
                  {v !== 0 ? v : ''}
                </button>
              )
            }),
          )}
        </div>
      </div>

      <div className="numpad">
        {Array.from({ length: n }, (_, i) => i + 1).map((num) => (
          <button key={num} className="btn num" onClick={() => place(num)}>{num}</button>
        ))}
        <button className="btn num erase" onClick={() => sel && place(grid[sel[0]][sel[1]])}>⌫</button>
      </div>

      {solved && !done && <div className="feedback good">🎉 You solved it! Tap Finish to collect your points.</div>}

      <div className="activity-controls">
        <button className="btn ghost" onClick={() => setChecked(true)}>Check</button>
        <Scratchpad />
        <div className="spacer" />
        {!solved && <button className="btn ghost sm" onClick={giveUp}>Give up</button>}
        {solved && <button className="btn primary" onClick={finish}>Finish</button>}
      </div>
    </div>
  )
}
