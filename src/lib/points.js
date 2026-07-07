// Points ⇄ PS5 economy. Confirmed with the parent:
//   100 points = 30 minutes of PS5.  (=> lifetime PS5 hours = points / 200)
export const PS5 = {
  pointsPerBlock: 100, // points needed for one block
  blockMinutes: 30, // minutes granted per block
}

// Daily engagement goal (seconds). Kids should spend at least this long/day.
export const DAILY_GOAL_SECONDS = 60 * 60 // 1 hour

// Anti-farming ceiling: the most PS5-convertible ("spendable") points a kid can
// earn in a single day, no matter how much they play. 100 points = 30 min PS5,
// so this caps a day at 30 minutes of PS5. Points beyond this still count toward
// the lifetime score, they just don't convert to more screen time.
export const DAILY_PS5_CAP_POINTS = 100

// How many PS5 minutes a given number of points is worth.
export function pointsToMinutes(points) {
  return (points / PS5.pointsPerBlock) * PS5.blockMinutes
}

// Human-friendly "X hr Y min" for a points balance.
export function pointsToPS5Label(points) {
  const totalMin = Math.floor(pointsToMinutes(points))
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h > 0 && m > 0) return `${h} hr ${m} min`
  if (h > 0) return `${h} hr`
  return `${m} min`
}

// How many whole 30-min blocks a spendable balance can buy right now.
export function affordableBlocks(spendablePoints) {
  return Math.floor(spendablePoints / PS5.pointsPerBlock)
}
