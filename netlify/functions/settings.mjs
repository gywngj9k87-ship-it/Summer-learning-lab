import { getStore } from '@netlify/blobs'

// POST /api/settings  body: settings object (e.g. { parentPin }).
// Merges into the shared store's settings.
export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  let settings
  try {
    settings = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const store = getStore('sll')
  const data = (await store.get('state', { type: 'json' })) || { profiles: {}, settings: {} }
  data.settings = { ...(data.settings || {}), ...(settings || {}) }
  await store.setJSON('state', data)
  return Response.json({ ok: true })
}
