// Date + "Day N" helpers. Days are counted as distinct calendar dates the kid
// has used the app: their first day is Day 1, the next different date is Day 2,
// and so on (skipped real days do not increment the counter).

// Local calendar date as YYYY-MM-DD (not UTC, so "today" matches the kid's day).
export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// True on real calendar Fridays (getDay(): 0=Sun .. 5=Fri).
export function isFriday(d = new Date()) {
  return d.getDay() === 5
}

// Given the list of distinct active dates, what "Day N" is today?
// If today isn't in the list yet, it's the next day number.
export function dayNumberFor(activeDates, today = todayKey()) {
  const set = new Set(activeDates)
  if (set.has(today)) {
    // Its position in the sorted unique list (1-indexed).
    return [...set].sort().indexOf(today) + 1
  }
  return set.size + 1
}

// The calendar date key `n` days before `from` (default today), as YYYY-MM-DD.
// Used by the "recently seen" guard to find the cutoff for a rolling window.
export function daysAgoKey(n, from = new Date()) {
  const d = new Date(from)
  d.setDate(d.getDate() - n)
  return todayKey(d)
}

export function friendlyDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
