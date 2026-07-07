import React, { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { buildDailyPlan } from '../data/topics.js'
import { getLevel, levelLabel } from '../lib/adaptive.js'
import { todayKey, isFriday } from '../lib/days.js'
import { pointsToPS5Label, DAILY_GOAL_SECONDS, DAILY_PS5_CAP_POINTS } from '../lib/points.js'
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

  const earnedToday = profile.dailyEarned?.[today] || 0
  const pendingToday = profile.pendingByDate?.[today] || 0

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

      {/* Landing stats: lifetime score, redeemable PS5, and today's progress. */}
      <section className="stats">
        <div className="stat big-stat">
          <div className="stat-label">Lifetime score</div>
          <div className="stat-value">{profile.lifetimePoints || 0}</div>
          <div className="stat-sub">🎮 {pointsToPS5Label(profile.lifetimePoints || 0)} of PS5 earned all-time</div>
        </div>
        <div className="stat">
          <div className="stat-label">PS5 ready to redeem</div>
          <div className="stat-value">{pointsToPS5Label(profile.spendablePoints || 0)}</div>
          <div className="stat-sub">{profile.spendablePoints || 0} points spendable</div>
          <button className="btn primary sm" onClick={() => setShowRedeem(true)}>Redeem PS5</button>
        </div>
        <div className="stat">
          <div className="stat-label">Today’s progress</div>
          <div className="stat-value">{mmss(todaySeconds)}</div>
          <div className="goal-bar"><div className="goal-fill" style={{ width: `${goalPct}%` }} /></div>
          <div className="stat-sub">
            {goalMet ? '✅ 1-hour goal reached' : `Learn 1 hour to unlock PS5 (${goalPct}%)`}
          </div>
          <div className="stat-sub">
            🎮 Earned today: {pointsToPS5Label(earnedToday)} / {pointsToPS5Label(DAILY_PS5_CAP_POINTS)} cap
            {pendingToday > 0 && !goalMet ? ` · 🔒 ${pointsToPS5Label(pendingToday)} locked` : ''}
          </div>
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
        <p className="replay-hint muted">Points count once per activity each day. Replays are free extra practice (fresh questions, no extra PS5) — and they help you spend your full learning hour.</p>
      </section>

      {showRedeem && <RedeemPS5 onClose={() => setShowRedeem(false)} />}
    </div>
  )
}
