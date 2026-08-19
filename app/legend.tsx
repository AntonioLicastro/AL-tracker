import type { Staff } from './types'

type Props = {
  staff: Staff[]
  totals: Map<string, number>
}

const TEAM_LABELS: Record<Staff['team'], string> = {
  rms: 'RMs',
  slt_support: 'SLT + Support',
}

export default function Legend({ staff, totals }: Props) {
  const teams: Staff['team'][] = ['rms', 'slt_support']

  return (
    <div className="space-y-4">
      {teams.map(team => (
        <div key={team}>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{TEAM_LABELS[team]}</p>
          <div className="space-y-1">
            {staff.filter(s => s.team === team).map(person => (
              <div key={person.id} className="flex items-center gap-2 px-2 py-1 rounded-lg text-sm">
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
