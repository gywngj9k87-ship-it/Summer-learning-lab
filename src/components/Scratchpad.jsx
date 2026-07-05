import React, { useEffect, useRef, useState } from 'react'

// A handwriting / working-out canvas. Opens as a panel with plenty of space so
// kids can scribble with an Apple Pencil (or finger/mouse). Not graded — it's
// just thinking space. Pointer Events cover pen, touch, and mouse uniformly.
export default function Scratchpad() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="btn ghost scratch-toggle" onClick={() => setOpen((o) => !o)}>
        ✏️ {open ? 'Hide' : 'Scratchpad'}
      </button>
      {open && <Canvas onClose={() => setOpen(false)} />}
    </>
  )
}

function Canvas({ onClose }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    const ctx = canvas.getContext('2d')
    ctx.scale(ratio, ratio)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#1f2937'
  }, [])

  function pos(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  function start(e) {
    drawing.current = true
    last.current = pos(e)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function move(e) {
    if (!drawing.current) return
    const ctx = canvasRef.current.getContext('2d')
    const p = pos(e)
    // Apple Pencil reports pressure; vary line width a little for a nicer feel.
    ctx.lineWidth = 1.5 + (e.pressure ? e.pressure * 4 : 2)
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
  }
  function end() {
    drawing.current = false
  }
  function clear() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="scratchpad">
      <div className="scratchpad-bar">
        <span>Scratchpad — work it out here ✏️</span>
        <span>
          <button className="btn ghost sm" onClick={clear}>Clear</button>
          <button className="btn ghost sm" onClick={onClose}>Close</button>
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className="scratchpad-canvas"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        style={{ touchAction: 'none' }}
      />
    </div>
  )
}
