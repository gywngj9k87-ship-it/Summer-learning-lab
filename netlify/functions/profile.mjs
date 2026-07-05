import { getStore } from '@netlify/blobs'

// POST /api/profile  body: a full profile object (must include `key`).
// Saves it into the shared store so other devices see the latest progress.
export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  let profile
  try {
    profile = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }
  if (!profile || !profile.key) return new Response('Missing profile key', { status: 400 })

  const store = getStore('sll')
  const data = (await store.get('state', { type: 'json' })) || { profiles: {}, settings: {} }
  data.profiles[profile.key] = profile
  await store.setJSON('state', data)
  return Response.json({ ok: true })
}
