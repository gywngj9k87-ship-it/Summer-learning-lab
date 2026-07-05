import React, {
  createContext, useContext, useEffect, useMemo, useRef, useState,
} from 'react'
import { matchKid, getKid } from '../lib/profiles.js'
import { loadAll, persistProfile, persistSettings, blankProfile } from '../lib/store.js'
import { todayKey, dayNumberFor } from '../lib/days.js'
import { getLevel, nextLevel } from '../lib/adaptive.js'

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
        timeByDate[today] = (timeByDate[today] || 0) + add
        const updated = { ...p, timeByDate }
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

  // Record the result of an activity: award points, log it, mark it done for
  // today, and adapt the topic's difficulty from this session's accuracy.
  function completeActivity({ topicId, correct, total, points }) {
    if (!profile) return { pointsAwarded: 0 }
    const today = todayKey()
    const accuracy = total > 0 ? correct / total : 1
    const curLevel = getLevel(profile, topicId)
    const { next, change } = nextLevel(curLevel, accuracy)

    const completedByDate = { ...(profile.completedByDate || {}) }
    const doneToday = new Set(completedByDate[today] || [])
    doneToday.add(topicId)
    completedByDate[today] = [...doneToday]

    const updated = {
      ...profile,
      lifetimePoints: (profile.lifetimePoints || 0) + points,
      spendablePoints: (profile.spendablePoints || 0) + points,
      levels: { ...(profile.levels || {}), [topicId]: next },
      completedByDate,
      log: [
        ...(profile.log || []).slice(-49),
        { date: today, topicId, correct, total, points, ts: dayNumber },
      ],
      lastActivity: { topicId, date: today },
    }
    commitProfile(updated)
    return { pointsAwarded: points, levelChange: change, newLevel: next }
  }

  // Record a Friday test result.
  function recordTest({ score, total, points }) {
    if (!profile) return
    const today = todayKey()
    const updated = {
      ...profile,
      lifetimePoints: (profile.lifetimePoints || 0) + points,
      spendablePoints: (profile.spendablePoints || 0) + points,
      tests: [...(profile.tests || []), { date: today, score, total, points }],
    }
    commitProfile(updated)
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
    setParentPin,
    hasParentPin,
    verifyPin,
    redeemPS5,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
