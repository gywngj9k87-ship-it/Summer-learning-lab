import React, { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { buildDailyPlan } from '../data/topics.js'
import { getLevel, levelLabel } from '../lib/adaptive.js'
import { todayKey, isFriday } from '../lib/days.js'
import { pointsToPS5Label, DAILY_GOAL_SECONDS } from '../lib/points.js'
import RedeemPS5 from './RedeemPS5.jsx'

function mmss(totalSec) {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}m ${String(s).padStart(2, '0')}s`
}

export default function Home({ onOpenActivity, onOpenTest, onOpenParent }) {
  const { profile, kid, dayNumber, todaySeconds, logout } = useApp()
  const [showRedeem, setShowRedeem] = useState(false)

  const today = todayKey()
  const doneToday = new Set(profile.completedByDate?.[today] || [])
  const plan = useMemo(
    () => buildDailyPlan({ hasMUN: kid.hasMUN, dayNumber, size: 5 }),
    [kid.hasMUN, dayNumber],
  )

  const goalPct = Math.min(100, Math.round((todaySeconds / DAILY_GOAL_SECONDS) * 100))
  const goalMet = todaySeconds >= DAILY_GOAL_SECONDS
  const friday = isFriday()

  return (
    <div className="home">
      <header className="topbar" style={{ '--kid': kid.color }}>
        <div className="who">
          <span className="who-emoji">{kid.emoji}</span>
          <div>
            <div className="who-name">Hi, {kid.name}!</div>
            <div className="who-day">Day {dayNumber} · Grade {kid.grade}</div>
          </div>
        </div>
        <div className="top-actions">
          <button className="btn ghost sm" onClick={onOpenParent}>👪 Parent</button>
          <button className="btn ghost sm" onClick={logout}>Switch player</button>
        </div>
      </header>

      {/* Landing stats: lifetime points and the PS5 time they're worth. */}
      <section className="stats">
        <div className="stat big-stat">
          <div className="stat-label">Lifetime points</div>
          <div className="stat-value">{profile.lifetimePoints || 0}</div>
          <div className="stat-sub">🎮 = {pointsToPS5Label(profile.lifetimePoints || 0)} of PS5 earned all-time</div>
        </div>
        <div className="stat">
          <div className="stat-label">Spendable now</div>
          <div className="stat-value">{profile.spendablePoints || 0}</div>
          <div className="stat-sub">🎮 {pointsToPS5Label(profile.spendablePoints || 0)} ready</div>
          <button className="btn primary sm" onClick={() => setShowRedeem(true)}>Redeem PS5</button>
        </div>
        <div className="stat">
          <div className="stat-label">Today’s learning time</div>
          <div className="stat-value">{mmss(todaySeconds)}</div>
          <div className="goal-bar"><div className="goal-fill" style={{ width: `${goalPct}%` }} /></div>
          <div className="stat-sub">{goalMet ? '✅ 1-hour goal reached!' : `Goal: 1 hour (${goalPct}%)`}</div>
        </div>
      </section>

      {friday && (
        <button className="friday-card" onClick={onOpenTest}>
          <span className="friday-emoji">📝</span>
          <div>
            <b>It’s Friday — Test Day!</b>
            <div className="muted">Take today’s test on what you’ve learned and earn bonus points.</div>
          </div>
          <span className="chev">→</span>
        </button>
      )}

      <section className="plan">
        <div className="plan-head">
          <h2>Today’s Plan</h2>
          <span className="muted">A fresh mix every day — aim for all {plan.length}!</span>
        </div>
        <div className="plan-grid">
          {plan.map((item) => {
            const lvl = getLevel(profile, item.id)
            const done = doneToday.has(item.id)
            return (
              <button key={item.id} className={`plan-card ${done ? 'done' : ''}`} onClick={() => onOpenActivity(item.id)}>
                <span className="plan-emoji">{item.emoji}</span>
                <span className="plan-label">{item.label}</span>
                <span className="plan-level">{levelLabel(lvl)}</span>
                {done && <span className="plan-check">✓ done</span>}
              </button>
            )
          })}
        </div>
        <p className="replay-hint muted">Finished one? You can replay any card for more points — it gets harder as you improve.</p>
      </section>

      {showRedeem && <RedeemPS5 onClose={() => setShowRedeem(false)} />}
    </div>
  )
}
