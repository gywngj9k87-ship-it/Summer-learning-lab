// Cross-device sync backend — Netlify.
//
// When the app is deployed to Netlify, progress syncs automatically through
// serverless functions backed by Netlify Blobs (see netlify/functions/*).
// No keys, no config: the functions live on the same domain as the app and are
// reached at /api/*.
//
// Locally (localhost) and on any host without those functions, sync is simply
// skipped and the app stays fully functional in local-first mode — so there is
// nothing to switch on. Deploy to Netlify and sync just works.

const API = '/api'

// Enabled whenever we're not on localhost (i.e. a real deployment). If the
// deploy has no functions, the fetches 404 and store.js falls back to local.
export function isRemoteEnabled() {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return !(h === 'localhost' || h === '127.0.0.1' || h === '' || h === '0.0.0.0')
}

export const remote = {
  async loadAll() {
    const res = await fetch(`${API}/state`, { cache: 'no-store' })
    if (!res.ok) throw new Error('remote unavailable')
    return res.json() // { profiles, settings }
  },
  async saveProfile(profile) {
    await fetch(`${API}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
  },
  async saveSettings(settings) {
    await fetch(`${API}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
  },
}
