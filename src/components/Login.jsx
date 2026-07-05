import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { pointsToPS5Label } from '../lib/points.js'

// Login gate: a session is created ONLY when name + age match a known player.
export default function Login() {
  const { login, profiles } = useApp()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    const res = login(name, age)
    if (!res.ok) setError(res.error)
  }

  const board = Object.values(profiles || {})

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="logo">☀️📚</div>
        <h1>Summer Learning Lab</h1>
        <p className="tagline">Learn every day, earn points, unlock PS5 time.</p>

        <form onSubmit={submit} className="login-form">
          <label>
            Your name
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="Type your name"
              autoComplete="off"
              autoCapitalize="words"
            />
          </label>
          <label>
            Your age
            <input
              type="number"
              value={age}
              onChange={(e) => { setAge(e.target.value); setError('') }}
              placeholder="Age"
              min="1"
              max="120"
            />
          </label>
          {error && <div className="login-error">{error}</div>}
          <button className="btn primary big" type="submit">Start learning →</button>
        </form>
        <p className="hint muted">Tip: on an iPad you can write your name with the Apple Pencil.</p>
      </div>

      {board.length > 0 && (
        <div className="family-board">
          <h3>🏆 Lifetime scores</h3>
          <div className="board-rows">
            {board
              .sort((a, b) => (b.lifetimePoints || 0) - (a.lifetimePoints || 0))
              .map((p) => (
                <div className="board-row" key={p.key}>
                  <span className="board-name">{p.name}</span>
                  <span className="board-points">{p.lifetimePoints || 0} pts</span>
                  <span className="board-ps5">🎮 {pointsToPS5Label(p.lifetimePoints || 0)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
