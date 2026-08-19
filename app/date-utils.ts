export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const toIso = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

export const todayIso = () => new Date().toISOString().slice(0, 10)

// Monday-first calendar grid for a given month, padded with leading/trailing
// nulls so every row has 7 cells — mirrors the spreadsheet's own layout.
export function monthGrid(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1).getDay() // 0 = Sunday
  const leadingBlanks = (firstDay + 6) % 7 // convert to Monday-first offset
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}
