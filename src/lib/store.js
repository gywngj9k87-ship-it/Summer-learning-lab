// Storage layer.
//
// Local-first by design: everything is persisted to the browser's
// localStorage so the app works today with no server, no accounts, offline.
//
// Firebase-ready: all reads/writes go through this module, and it exposes a
// small async surface (loadAll / persistProfile / persistSettings) plus a
// `remote` seam. To turn on cross-device sync later, fill in src/lib/remote.js
// with a Firestore implementation — no component code needs to change.

import { remote, isRemoteEnabled } from './remote.js'

const KEY = 'sll:v1'

function blankProfile(kid, createdDate) {
  return {
    key: kid.key,
    name: kid.name,
    age: kid.age,
    createdDate,
    lifetimePoints: 0, // only ever grows — the achievement badge/score
    spendablePoints: 0, // redeemable balance; drops when PS5 time is redeemed
    activeDates: [], // distinct YYYY-MM-DD the kid has used the app
    timeByDate: {}, // { 'YYYY-MM-DD': secondsSpent }
    completedByDate: {}, // { 'YYYY-MM-DD': [activityId, ...] }
    dailyEarned: {}, // { 'YYYY-MM-DD': PS5 points credited today (for the cap) }
    pendingByDate: {}, // { 'YYYY-MM-DD': PS5 points awaiting the 1-hour unlock }
    levels: {}, // { topicId: adaptiveLevel 1..5 }
    seen: {}, // { topicId: [ { id, date } ] } — recently served items
    log: [], // recent activity results, newest last
    tests: [], // Friday test history
    redemptions: [], // PS5 redemption history
    lastActivity: null,
  }
}

function blankStore() {
  return {
    profiles: {}, // key -> profile
    settings: {
      parentPin: null, // set by the parent on first use of the Parent area
    },
  }
}

function readLocal() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return blankStore()
    const parsed = JSON.parse(raw)
    return { ...blankStore(), ...parsed, settings: { ...blankStore().settings, ...(parsed.settings || {}) } }
  } catch {
    return blankStore()
  }
}

function writeLocal(store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    // Storage full or unavailable — fail quietly; the in-memory state still works.
  }
}

// ---- Public API -----------------------------------------------------------

// Load the whole store. When remote sync is enabled, remote wins (and is
// mirrored locally); otherwise the local copy is used.
export async function loadAll() {
  const local = readLocal()
  if (isRemoteEnabled()) {
    try {
      const remoteStore = await remote.loadAll()
      if (remoteStore) {
        // Merge: remote wins per-key, but keep any local-only profiles/settings
        // so a device that played offline isn't wiped by an empty remote.
        const merged = {
          profiles: { ...local.profiles, ...(remoteStore.profiles || {}) },
          settings: { ...local.settings, ...(remoteStore.settings || {}) },
        }
        writeLocal(merged)
        return merged
      }
    } catch {
      // Offline or no sync functions on this host — fall back to local.
    }
  }
  return local
}

export async function persistProfile(profile) {
  const store = readLocal()
  store.profiles[profile.key] = profile
  writeLocal(store)
  if (isRemoteEnabled()) {
    try {
      await remote.saveProfile(profile)
    } catch {
      /* queued locally; will re-sync on next successful write */
    }
  }
  return store
}

export async function persistSettings(settings) {
  const store = readLocal()
  store.settings = { ...store.settings, ...settings }
  writeLocal(store)
  if (isRemoteEnabled()) {
    try {
      await remote.saveSettings(store.settings)
    } catch {
      /* ignore */
    }
  }
  return store.settings
}

export { blankProfile }
