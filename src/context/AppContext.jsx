import React, {
  createContext, useContext, useEffect, useMemo, useRef, useState,
} from 'react'
import { matchKid, getKid } from '../lib/profiles.js'
import { loadAll, persistProfile, persistSettings, blankProfile } from '../lib/store.js'
import { todayKey, dayNumberFor, daysAgoKey } from '../lib/days.js'
import { getLevel, nextLevel } from '../lib/adaptive.js'
import { DAILY_GOAL_SECONDS, DAILY_PS5_CAP_POINTS } from '../lib/points.js'
import { computeCredit } from '../lib/economy.js'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({ parentPin: null })
  const [profiles, setProfiles] = useState({})
  const [currentKey, setCurrentKey] = useState(null)
  const [todaySeconds, setTodaySeconds] = useState(0)

  const secondsRef = useRef(0)
  const tickRef = useRef(0)

  // Initial load (remote-if-enabled, else local).
  useEffect(() => {
    let alive = true
    ;(async () => {
      const store = await loadAll()
      if (!alive) return
      setProfiles(store.profiles || {})
      setSettings(store.settings || { parentPin: null })
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [])

  const profile = currentKey ? profiles[currentKey] : null

  // Persist a profile update to state + storage.
  function commitProfile(updated) {
    setProfiles((prev) => ({ ...prev, [updated.key]: updated }))
    persistProfile(updated)
  }

  // ---- Time tracking: count active seconds while logged in and tab visible.
  useEffect(() => {
    if (!currentKey) return
    secondsRef.current = 0
    const today = todayKey()

    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      secondsRef.current += 1
      tickRef.current += 1
      setTodaySeconds((s) => s + 1)
      // Flush to profile + storage every 10s (and keep the timer cheap).
      if (tickRef.current % 10 === 0) flushTime()
    }, 1000)

    function flushTime() {
      const add = secondsRef.current
      if (add <= 0) return
      secondsRef.current = 0
      setProfiles((prev) => {
        const p = prev[currentKey]
        if (!p) return prev
        const timeByDate = { ...(p.timeByDate || {}) }
        const before = timeByDate[today] || 0
        const afterSec = before + add
        timeByDate[today] = afterSec
        let updated = { ...p, timeByDate }
        // Crossing the 1-hour goal unlocks the day's pending PS5 points.
        const pending = p.pendingByDate?.[today] || 0
        if (before < DAILY_GOAL_SECONDS && afterSec >= DAILY_GOAL_SECONDS && pending > 0) {
          updated.spendablePoints = (p.spendablePoints || 0) + pending
          updated.pendingByDate = { ...(p.pendingByDate || {}), [today]: 0 }
        }
        persistProfile(updated)
        return { ...prev, [currentKey]: updated }
      })
    }

    const onHide = () => {
      if (document.visibilityState === 'hidden') flushTime()
    }
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('beforeunload', flushTime)
    return () => {
      flushTime()
      clearInterval(id)
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('beforeunload', flushTime)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey])

  // Seed today's active-day and time display when a session starts.
  useEffect(() => {
    if (!profile) return
    setTodaySeconds(profile.timeByDate?.[todayKey()] || 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey])

  // ---- Actions -------------------------------------------------------------

  // Login gate: only succeeds if name+age match a known kid. Returns
  // { ok, error, kid }. On success, creates the profile if new and marks today
  // as an active day (advancing the Day counter when it's a new date).
  function login(name, age) {
    const kid = matchKid(name, age)
    if (!kid) {
      return {
        ok: false,
        error: 'That name and age don’t match a player. Check the spelling and age, then try again.',
      }
    }
    const today = todayKey()
    let p = profiles[kid.key]
    if (!p) {
      p = { ...blankProfile(kid, today), levels: {} }
    }
    const activeDates = p.activeDates?.includes(today)
      ? p.activeDates
      : [...(p.activeDates || []), today]
    p = { ...p, activeDates, levels: p.levels || {} }
    setProfiles((prev) => ({ ...prev, [kid.key]: p }))
    persistProfile(p)
    setCurrentKey(kid.key)
    return { ok: true, kid }
  }

  function logout() {
    setCurrentKey(null)
    setTodaySeconds(0)
  }

  const dayNumber = useMemo(
    () => (profile ? dayNumberFor(profile.activeDates || [], todayKey()) : 0),
    [profile],
  )

  // Record the result of an activity and adapt the topic's difficulty.
  //
  // Economy (anti-farming):
  //  - Difficulty always adapts from performance (even on replays).
  //  - PS5-convertible points are awarded ONLY the first time an activity is
  //    completed each day. Replays are practice: fresh questions, no PS5 credit.
  //  - The day's PS5 points are capped (DAILY_PS5_CAP_POINTS).
  //  - Earned PS5 points stay PENDING until the 1-hour daily learning goal is
  //    met; only then do they unlock into the spendable balance.
  function completeActivity({ topicId, correct, total, points }) {
    if (!profile) return { pointsAwarded: 0 }
    const today = todayKey()
    const accuracy = total > 0 ? correct / total : 1
    const curLevel = getLevel(profile, topicId)
    const { next, change } = nextLevel(curLevel, accuracy)

    const doneToday = new Set(profile.completedByDate?.[today] || [])
    const firstToday = !doneToday.has(topicId)
    const earnedToday = profile.dailyEarned?.[today] || 0
    const timeMet = (profile.timeByDate?.[today] || 0) >= DAILY_GOAL_SECONDS

    const credit = computeCredit({
      points, firstToday, timeMet, earnedToday, cap: DAILY_PS5_CAP_POINTS,
    })

    // Practice replay: adapt difficulty only, no points/credit.
    if (credit.practice) {
      commitProfile({
        ...profile,
        levels: { ...(profile.levels || {}), [topicId]: next },
        lastActivity: { topicId, date: today },
      })
      return { pointsAwarded: 0, practice: true, levelChange: change, newLevel: next }
    }

    const completedByDate = { ...(profile.completedByDate || {}) }
    completedByDate[today] = [...doneToday, topicId]
    const pendingByDate = { ...(profile.pendingByDate || {}) }
    if (credit.toPending > 0) pendingByDate[today] = (pendingByDate[today] || 0) + credit.toPending

    commitProfile({
      ...profile,
      lifetimePoints: (profile.lifetimePoints || 0) + credit.lifetimeAdd,
      spendablePoints: (profile.spendablePoints || 0) + credit.toSpendable,
      levels: { ...(profile.levels || {}), [topicId]: next },
      completedByDate,
      dailyEarned: { ...(profile.dailyEarned || {}), [today]: earnedToday + credit.creditable },
      pendingByDate,
      log: [
        ...(profile.log || []).slice(-49),
        { date: today, topicId, correct, total, points: credit.creditable, ts: dayNumber },
      ],
      lastActivity: { topicId, date: today },
    })
    return {
      pointsAwarded: credit.creditable,
      pending: credit.toPending > 0,
      capped: credit.capped,
      levelChange: change,
      newLevel: next,
    }
  }

  // --- "Recently seen" guard: no repeats within a week -----------------------

  // Item ids served for a topic within the last `days` calendar days.
  function recentSeen(topicId, days = 7) {
    const cutoff = daysAgoKey(days)
    return (profile?.seen?.[topicId] || [])
      .filter((e) => e.date > cutoff)
      .map((e) => e.id)
  }

  // Mark ids as served today for a topic. Old entries (>14 days) are pruned so
  // the pool re-opens over time and storage stays small.
  function markSeen(topicId, ids) {
    if (!profile || !ids || ids.length === 0) return
    const today = todayKey()
    const cutoff = daysAgoKey(14)
    const seen = { ...(profile.seen || {}) }
    const list = [...(seen[topicId] || []), ...ids.map((id) => ({ id, date: today }))]
    seen[topicId] = list.filter((e) => e.date >= cutoff).slice(-300)
    commitProfile({ ...profile, seen })
  }

  // Record a Friday test result. Bonus points obey the same daily cap and
  // 1-hour time-gate as activities, and only the first test each day counts
  // toward PS5 (retakes still show a score but earn no extra screen time).
  function recordTest({ score, total, points }) {
    if (!profile) return { pointsAwarded: 0 }
    const today = todayKey()
    const alreadyTestedToday = (profile.tests || []).some((t) => t.date === today)
    const earnedToday = profile.dailyEarned?.[today] || 0
    const creditable = alreadyTestedToday
      ? 0
      : Math.max(0, Math.min(points, DAILY_PS5_CAP_POINTS - earnedToday))
    const timeMet = (profile.timeByDate?.[today] || 0) >= DAILY_GOAL_SECONDS

    const pendingByDate = { ...(profile.pendingByDate || {}) }
    if (!timeMet && creditable > 0) pendingByDate[today] = (pendingByDate[today] || 0) + creditable

    commitProfile({
      ...profile,
      lifetimePoints: (profile.lifetimePoints || 0) + (alreadyTestedToday ? 0 : points),
      spendablePoints: (profile.spendablePoints || 0) + (timeMet ? creditable : 0),
      dailyEarned: { ...(profile.dailyEarned || {}), [today]: earnedToday + creditable },
      pendingByDate,
      tests: [...(profile.tests || []), { date: today, score, total, points: creditable }],
    })
    return { pointsAwarded: creditable, pending: !timeMet && creditable > 0 }
  }

  // --- Parent testing/reset tools (operate on any kid by key) --------------

  function updateByKey(key, updater) {
    setProfiles((prev) => {
      const p = prev[key]
      if (!p) return prev
      const updated = updater(p)
      persistProfile(updated)
      return { ...prev, [key]: updated }
    })
  }
  // Zero out points and clear redemption history.
  function resetPoints(key) {
    updateByKey(key, (p) => ({ ...p, lifetimePoints: 0, spendablePoints: 0, redemptions: [] }))
  }
  // Bring back the question bank: clear the recently-seen history and reset
  // adaptive levels and today's completed markers.
  function resetQuestions(key) {
    updateByKey(key, (p) => ({ ...p, seen: {}, levels: {}, completedByDate: {} }))
  }
  // Full wipe back to a blank profile (keeps the kid's identity + start date).
  function resetProgress(key) {
    const kidInfo = getKid(key)
    updateByKey(key, (p) => ({ ...blankProfile(kidInfo, p.createdDate), levels: {}, seen: {} }))
  }

  // Parent PIN management. First time, the parent sets it.
  function setParentPin(pin) {
    const next = { ...settings, parentPin: String(pin) }
    setSettings(next)
    persistSettings(next)
  }
  function hasParentPin() {
    return !!settings.parentPin
  }
  function verifyPin(pin) {
    return settings.parentPin && String(pin) === String(settings.parentPin)
  }

  // Redeem spendable points for PS5 blocks. Requires a valid parent PIN.
  function redeemPS5({ blocks, pin, pointsPerBlock, blockMinutes }) {
    if (!profile) return { ok: false, error: 'No active player.' }
    if (!verifyPin(pin)) return { ok: false, error: 'Incorrect parent PIN.' }
    const cost = blocks * pointsPerBlock
    if ((profile.spendablePoints || 0) < cost) {
      return { ok: false, error: 'Not enough points yet.' }
    }
    const minutes = blocks * blockMinutes
    const updated = {
      ...profile,
      spendablePoints: profile.spendablePoints - cost,
      redemptions: [
        ...(profile.redemptions || []),
        { date: todayKey(), blocks, minutes, cost },
      ],
    }
    commitProfile(updated)
    return { ok: true, minutes, cost }
  }

  const value = {
    loading,
    settings,
    profiles,
    profile,
    kid: currentKey ? getKid(currentKey) : null,
    dayNumber,
    todaySeconds,
    login,
    logout,
    completeActivity,
    recordTest,
    markSeen,
    recentSeen,
    resetPoints,
    resetQuestions,
    resetProgress,
    setParentPin,
    hasParentPin,
    verifyPin,
    redeemPS5,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
