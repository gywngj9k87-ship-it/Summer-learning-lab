import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { pointsToPS5Label } from '../lib/points.js'
import { levelLabel } from '../lib/adaptive.js'
import { TOPICS } from '../data/topics.js'
import { friendlyDate } from '../lib/days.js'

function totalSeconds(p) {
  return Object.values(p.timeByDate || {}).reduce((a, b) => a + b, 0)
}
function fmtTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function ParentDashboard({ onBack }) {
  const { profiles, hasParentPin, setParentPin, verifyPin } = useApp()
  const [unlocked, setUnlocked] = useState(!hasParentPin())
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [err, setErr] = useState('')

  const list = Object.values(profiles || {})

  if (!unlocked) {
    return (
      <div className="parent">
        <div className="activity-head">
          <button className="btn ghost sm" onClick={onBack}>← Back</button>
          <div className="activity-title"><h2>👪 Parent area</h2></div>
          <span />
        </div>
        <div className="pin-gate">
          <p>Enter the parent PIN to view progress.</p>
          <input type="password" inputMode="numeric" maxLength={4} value={pin}
            onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setErr('') }} placeholder="4-digit PIN" />
          <button className="btn primary" onClick={() => (verifyPin(pin) ? setUnlocked(true) : setErr('Incorrect PIN.'))}>Unlock</button>
          {err && <div className="feedback bad">{err}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="parent">
      <div className="activity-head">
        <button className="btn ghost sm" onClick={onBack}>← Back</button>
        <div className="activity-title"><h2>👪 Parent area</h2><span className="muted">Progress, time, and screen-time control</span></div>
        <span />
      </div>

      {!hasParentPin() && (
        <div className="card pin-setup">
          <b>Set a parent PIN</b>
          <p className="muted">Protects PS5 redemptions and this dashboard.</p>
          <div className="row">
            <input type="password" inputMode="numeric" maxLength={4} value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))} placeholder="4-digit PIN" />
            <button className="btn primary" onClick={() => /^\d{4}$/.test(newPin) && setParentPin(newPin)}>Save</button>
          </div>
        </div>
      )}

      {list.length === 0 && <p className="muted">No progress yet — have the kids log in and play!</p>}

      {list.map((p) => {
        const days = (p.activeDates || []).length
        const tSec = totalSeconds(p)
        const redeemedMin = (p.redemptions || []).reduce((a, r) => a + r.minutes, 0)
        const tests = (p.tests || []).slice(-5).reverse()
        return (
          <div className="card kid-card" key={p.key}>
            <h3>{p.name} <span className="muted">· age {p.age}</span></h3>
            <div className="kid-stats">
              <div><span className="k">Lifetime points</span><span className="v">{p.lifetimePoints || 0}</span></div>
              <div><span className="k">Spendable</span><span className="v">{p.spendablePoints || 0}</span></div>
              <div><span className="k">PS5 earned all-time</span><span className="v">🎮 {pointsToPS5Label(p.lifetimePoints || 0)}</span></div>
              <div><span className="k">PS5 redeemed</span><span className="v">{redeemedMin} min</span></div>
              <div><span className="k">Days active</span><span className="v">{days}</span></div>
              <div><span className="k">Total learning time</span><span className="v">{fmtTime(tSec)}</span></div>
            </div>

            <div className="levels">
              <span className="k">Difficulty by topic:</span>
              <div className="level-chips">
                {TOPICS.filter((t) => !t.seniorOnly || p.age >= 10).map((t) => (
                  <span className="chip" key={t.id}>{t.emoji} {t.label}: <b>{levelLabel(p.levels?.[t.id] ?? 2)}</b></span>
                ))}
              </div>
            </div>

            {tests.length > 0 && (
              <div className="tests">
                <span className="k">Recent Friday tests:</span>
                <ul>
                  {tests.map((t, i) => (
                    <li key={i}>{friendlyDate(t.date)} — {t.score}/{t.total} (+{t.points} pts)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
