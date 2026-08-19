'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import type { Staff } from './types'
import { markLeave, unmarkLeave } from './actions'

type Props = {
  dateIso: string
  staff: Staff[]
  offStaffIds: Set<string>
  currentUserId: string | null
  isManager: boolean
  onClose: () => void
}

const TEAM_LABELS: Record<Staff['team'], string> = {
  rms: 'RMs',
  slt_support: 'SLT + Support',
}

export default function DayModal({ dateIso, staff, offStaffIds, currentUserId, isManager, onClose }: Props) {
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState('')

  const toggle = async (person: Staff, isOff: boolean) => {
    setPending(person.id)
    setError('')
    const result = isOff ? await unmarkLeave(person.id, dateIso) : await markLeave(person.id, dateIso)
    if (result.error) setError(result.error)
    setPending(null)
  }

  const label = new Date(dateIso + 'T00:00:00').toLocaleDateString('en-IE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const teams: Staff['team'][] = ['rms', 'slt_support']

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="font-bold text-gray-900 text-sm">{label}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-2 mx-4 mt-3 rounded text-xs">{error}</div>}

        <div className="p-4 space-y-4">
          {teams.map(team => (
            <div key={team}>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5">{TEAM_LABELS[team]}</p>
              <div className="space-y-1">
                {staff.filter(s => s.team === team).map(person => {
                  const isOff = offStaffIds.has(person.id)
                  const canEdit = isManager || person.user_id === currentUserId
                  return (
                    <button
                      key={person.id}
                      disabled={!canEdit || pending === person.id}
                      onClick={() => toggle(person, isOff)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-left transition ${
                        canEdit ? 'hover:bg-gray-50' : 'opacity-70 cursor-default'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: person.color }} />
                      <span className="flex-1 text-gray-800">{person.name}</span>
                      {pending === person.id ? (
                        <span className="text-xs text-gray-400">...</span>
                      ) : isOff ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <Check size={14} /> Off
                        </span>
                      ) : canEdit ? (
                        <span className="text-xs text-gray-300">Mark off</span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
