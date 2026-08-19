export type Team = 'rms' | 'slt_support'

export type Staff = {
  id: string
  name: string
  team: Team
  color: string
  sort_order: number
  user_id: string | null
  is_manager: boolean
}

export type LeaveDay = {
  id: string
  staff_id: string
  leave_date: string
}
