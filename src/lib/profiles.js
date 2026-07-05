// The only two players. A session is created ONLY when the entered name and
// age match one of these exactly. Any mismatch is rejected and nothing is
// generated. (Ages are intentionally hard-coded per the parent's spec.)
export const KNOWN_KIDS = [
  {
    key: 'niall',
    name: 'Niall',
    age: 10,
    grade: 5,
    // Older learner: harder puzzles, longer passages, plus MUN prep.
    level: 'senior',
    color: '#3b82f6',
    emoji: '🧭',
    hasMUN: true,
  },
  {
    key: 'naurishka',
    name: 'Naurishka',
    age: 6,
    grade: 1,
    // Early learner: gentle puzzles, short passages, picture-friendly.
    level: 'junior',
    color: '#ec4899',
    emoji: '🌸',
    hasMUN: false,
  },
]

// Normalize a typed name for comparison (trim + lowercase).
function norm(s) {
  return String(s || '').trim().toLowerCase()
}

// Returns the matching kid, or null if name+age don't match a known kid.
// This is the login gate: no match => no session.
export function matchKid(name, age) {
  const n = norm(name)
  const a = Number(age)
  if (!n || !Number.isFinite(a)) return null
  return (
    KNOWN_KIDS.find((k) => norm(k.name) === n && k.age === a) || null
  )
}

export function getKid(key) {
  return KNOWN_KIDS.find((k) => k.key === key) || null
}
