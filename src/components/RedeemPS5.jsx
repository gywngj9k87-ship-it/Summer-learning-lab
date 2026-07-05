import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { PS5, affordableBlocks, pointsToPS5Label } from '../lib/points.js'

// PS5 redemption modal. Requires the parent PIN (set on first use). Redeeming
// deducts spendable points and records a voucher the parent honours on the
// real console.
export default function RedeemPS5({ onClose }) {
  const { profile, hasParentPin, setParentPin, redeemPS5 } = useApp()
  const [blocks, setBlocks] = useState(1)
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [msg, setMsg] = useState(null)

  const max = affordableBlocks(profile.spendablePoints || 0)
  const settingPin = !hasParentPin()

  function createPin(e) {
    e.preventDefault()
    if (!/^\d{4}$/.test(newPin)) { setMsg({ type: 'bad', text: 'PIN must be 4 digits.' }); return }
    setParentPin(newPin)
    setMsg({ type: 'good', text: 'Parent PIN saved. You can now approve redemptions.' })
  }

  function doRedeem(e) {
    e.preventDefault()
    const res = redeemPS5({
      blocks,
      pin,
      pointsPerBlock: PS5.pointsPerBlock,
      blockMinutes: PS5.blockMinutes,
    })
    if (!res.ok) { setMsg({ type: 'bad', text: res.error }); return }
    setMsg({ type: 'good', text: `✅ Approved! ${res.minutes} minutes of PS5 unlocked (−${res.cost} points).` })
    setPin('')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>🎮 Redeem PS5 time</h3>
          <button className="btn ghost sm" onClick={onClose}>✕</button>
        </div>

        <p className="muted">
          Rate: {PS5.pointsPerBlock} points = {PS5.blockMinutes} min. You have{' '}
          <b>{profile.spendablePoints || 0}</b> spendable points
          ({pointsToPS5Label(profile.spendablePoints || 0)}).
        </p>

        {settingPin ? (
          <form onSubmit={createPin} className="pin-form">
            <p><b>Set a parent PIN</b> (4 digits) to approve screen-time redemptions.</p>
            <input type="password" inputMode="numeric" maxLength={4} value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))} placeholder="4-digit PIN" />
            <button className="btn primary" type="submit">Save PIN</button>
          </form>
        ) : max === 0 ? (
          <p className="feedback bad">Not enough points for a 30-minute block yet. Keep learning!</p>
        ) : (
          <form onSubmit={doRedeem} className="redeem-form">
            <label>
              How many 30-min blocks?
              <div className="block-picker">
                {Array.from({ length: max }, (_, i) => i + 1).map((b) => (
                  <button type="button" key={b} className={`btn num ${blocks === b ? 'active' : ''}`} onClick={() => setBlocks(b)}>{b}</button>
                ))}
              </div>
            </label>
            <p className="muted">= {blocks * PS5.blockMinutes} min PS5, costs {blocks * PS5.pointsPerBlock} points.</p>
            <label>
              Parent PIN
              <input type="password" inputMode="numeric" maxLength={4} value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="Enter PIN to approve" />
            </label>
            <button className="btn primary" type="submit">Approve & redeem</button>
          </form>
        )}

        {msg && <div className={`feedback ${msg.type === 'good' ? 'good' : 'bad'}`}>{msg.text}</div>}
      </div>
    </div>
  )
}
