import { getStore } from '@netlify/blobs'

// GET /api/state -> the whole store: { profiles, settings }
export default async () => {
  const store = getStore('sll')
  const data = (await store.get('state', { type: 'json' })) || { profiles: {}, settings: {} }
  return Response.json(data)
}
