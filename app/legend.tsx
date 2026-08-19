'use client'

import { useState } from 'react'
import type { Staff } from './types'
import { claimStaff } from './actions'

type Props = {
  staff: Staff[]
  totals: Map<string, number>
  currentUserId: string | null
  hasClaimed: boolean
}

const TEAM_LABELS: Record<Staff['team'], string> = {
  rms: 'RMs',
  slt_support: 'SLT + Support',
}

export default function Legend({ staff, totals, currentUserId, hasClaimed }: Props) {
  const [claiming, setClaiming] = useState<string | null>(null)
  const [error, setError] = useState('')
  const unclaimed = staff.filter(s => !s.user_id)

  const claim = async (staffId: string) => {
    setClaiming(staffId)
    setError('')
    const result = await claimStaff(staffId)
    if (result.error) setError(result.error)
    setClaiming(null)
  }

  const teams: Staff['team'][] = ['rms', 'slt_support']

  return (
    <div className="space-y-4">
      {!hasClaimed && unclaimed.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-800 mb-1">Which one are you?</p>
          <p className="text-xs text-amber-700 mb-3">Claim your name once so you can mark your own leave.</p>
          {error && <div className="bg-red-100 text-red-700 p-2 rounded text-xs mb-2">{error}</div>}
          <div className="flex flex-wrap gap-1.5">
            {unclaimed.map(person => (
              <button
                key={person.id}
                disabled={claiming === person.id}
                onClick={() => claim(person.id)}
                className="flex items-center gap-1.5 bg-white border border-amber-200 rounded-full px-3 py-1 text-xs font-medium text-gray-700 hover:border-amber-400 transition"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: person.color }} />
                {claiming === person.id ? 'Claiming...' : person.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {teams.map(team => (
        <div key={team}>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{TEAM_LABELS[team]}</p>
          <div className="space-y-1">
            {staff.filter(s => s.team === team).map(person => (
              <div
                key={person.id}
                className={`flex items-center gap-2 px-2 py-1 rounded-lg text-sm ${
                  person.user_id === currentUserId ? 'bg-blue-50' : ''
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: person.color }} />
                <span className="flex-1 text-gray-800 truncate">{person.name}</span>
                <span className="text-xs text-gray-400">{totals.get(person.id) ?? 0}d</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
