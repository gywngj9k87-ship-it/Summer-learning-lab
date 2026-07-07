// Pure point-economy rules (kept out of React so they can be unit-tested).
//
// Anti-farming design:
//  - Only the FIRST completion of an activity each day earns PS5-convertible
//    points. Replays are practice worth nothing toward screen time.
//  - PS5 points are capped per day (cap - already earned today).
//  - Earned PS5 points are PENDING until the daily learning-time goal is met;
//    only then do they become spendable/redeemable.
//  - The lifetime score always reflects full effort (uncapped), so replays and
//    over-cap play still feel rewarding as a score — just not as screen time.

// Compute how a completion affects the economy.
//   points       — raw points the activity produced
//   firstToday    — is this the first completion of this activity today?
//   timeMet       — has the 1-hour daily learning goal been met today?
//   earnedToday   — PS5 points already credited today (for the cap)
//   cap           — DAILY_PS5_CAP_POINTS
export function computeCredit({ points, firstToday, timeMet, earnedToday, cap }) {
  if (!firstToday) {
    // Practice replay: no score, no PS5.
    return { creditable: 0, toSpendable: 0, toPending: 0, lifetimeAdd: 0, capped: false, practice: true }
  }
  const creditable = Math.max(0, Math.min(points, cap - earnedToday))
  return {
    creditable,
    toSpendable: timeMet ? creditable : 0,
    toPending: timeMet ? 0 : creditable,
    lifetimeAdd: points,
    capped: creditable < points,
    practice: false,
  }
}
