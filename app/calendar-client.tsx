'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MonthGrid from './month-grid'
import DayModal from './day-modal'
import Legend from './legend'
import type { Staff, LeaveDay, Team } from './types'

type Props = {
  staff: Staff[]
  leaveDays: LeaveDay[]
  currentUserId: string | null
}

const TEAM_TABS: { key: Team | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'rms', label: 'RMs' },
  { key: 'slt_support', label: 'SLT + Support' },
]

export default function CalendarClient({ staff, leaveDays, currentUserId }: Props) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [teamFilter, setTeamFilter] = useState<Team | 'all'>('all')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const visibleStaffIds = useMemo(
    () => new Set(staff.filter(s => teamFilter === 'all' || s.team === teamFilter).map(s => s.id)),
    [staff, teamFilter]
  )

  const leaveByDate = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const entry of leaveDays) {
      if (!entry.leave_date.startsWith(String(year))) continue
      if (!visibleStaffIds.has(entry.staff_id)) continue
      if (!map.has(entry.leave_date)) map.set(entry.leave_date, new Set())
      map.get(entry.leave_date)!.add(entry.staff_id)
    }
    return map
  }, [leaveDays, year, visibleStaffIds])

  const totals = useMemo(() => {
    const map = new Map<string, number>()
    for (const entry of leaveDays) {
      if (!entry.leave_date.startsWith(String(year))) continue
      map.set(entry.staff_id, (map.get(entry.staff_id) ?? 0) + 1)
    }
    return map
  }, [leaveDays, year])

  const offOnSelectedDate = selectedDate
    ? new Set(leaveDays.filter(d => d.leave_date === selectedDate).map(d => d.staff_id))
    : new Set<string>()

  const isManager = staff.some(s => s.user_id === currentUserId && s.is_manager)
  const hasClaimed = staff.some(s => s.user_id === currentUserId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setYear(y => y - 1)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
              <ChevronLeft size={18} />
            </button>
            <span className="font-bold text-lg text-gray-900 w-16 text-center">{year}</span>
            <button onClick={() => setYear(y => y + 1)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex gap-1">
            {TEAM_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setTeamFilter(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  teamFilter === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 12 }, (_, month) => (
            <MonthGrid
              key={month}
              year={year}
              month={month}
              staff={staff}
              leaveByDate={leaveByDate}
              onSelectDay={setSelectedDate}
            />
          ))}
        </div>
      </div>

      <div>
        <Legend staff={staff} totals={totals} currentUserId={currentUserId} hasClaimed={hasClaimed} />
      </div>

      {selectedDate && (
        <DayModal
          dateIso={selectedDate}
          staff={staff}
          offStaffIds={offOnSelectedDate}
          currentUserId={currentUserId}
          isManager={isManager}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}
