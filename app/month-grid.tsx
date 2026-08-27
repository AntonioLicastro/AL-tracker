'use client'

import { MONTH_NAMES, WEEKDAY_LABELS, monthGrid, toIso, todayIso } from './date-utils'
import { initialsFor, readableTextColor } from './color-utils'
import type { Staff } from './types'

type Props = {
  year: number
  month: number // 0-indexed
  staff: Staff[]
  leaveByDate: Map<string, Set<string>>
  onSelectDay: (dateIso: string) => void
}

export default function MonthGrid({ year, month, staff, leaveByDate, onSelectDay }: Props) {
  const weeks = monthGrid(year, month)
  const today = todayIso()

  return (
    <div className="border border-gray-100 rounded-xl p-3">
      <h3 className="text-sm font-bold text-gray-900 mb-2">{MONTH_NAMES[month]}</h3>
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            {WEEKDAY_LABELS.map(label => (
              <th key={label} className="text-[10px] font-medium text-gray-400 pb-1 w-[14.28%]">
                {label[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (day === null) return <td key={di} className="p-0.5" />
                const dateIso = toIso(year, month, day)
                const staffIds = leaveByDate.get(dateIso)
                const isToday = dateIso === today
                const isWeekend = di === 5 || di === 6

                return (
                  <td key={di} className="p-0.5 align-top">
                    <button
                      onClick={() => onSelectDay(dateIso)}
                      className={`w-full h-12 rounded-md flex flex-col items-center justify-start pt-0.5 text-[11px] leading-none transition hover:ring-1 hover:ring-blue-300 ${
                        isWeekend ? 'bg-gray-50' : 'bg-white'
                      } ${isToday ? 'ring-1 ring-blue-500' : ''}`}
                    >
                      <span className={isWeekend ? 'text-gray-400' : 'text-gray-600'}>{day}</span>
                      {staffIds && staffIds.size > 0 && (
                        <span className="flex flex-wrap gap-0.5 justify-center mt-0.5 px-0.5">
                          {Array.from(staffIds).slice(0, 3).map(id => {
                            const person = staff.find(s => s.id === id)
                            if (!person) return null
                            return (
                              <span
                                key={id}
                                title={person.name}
                                className="flex items-center justify-center rounded px-[1px] font-bold"
                                style={{
                                  backgroundColor: person.color,
                                  color: readableTextColor(person.color),
                                  fontSize: '6px',
                                  lineHeight: 1,
                                  minWidth: '11px',
                                  height: '9px',
                                }}
                              >
                                {initialsFor(person.name)}
                              </span>
                            )
                          })}
                          {staffIds.size > 3 && (
                            <span className="text-[8px] text-gray-400">+{staffIds.size - 3}</span>
                          )}
                        </span>
                      )}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
