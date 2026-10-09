import { createClient } from '@/utils/supabase/server'
import NavHeader from './nav-header'
import CalendarClient from './calendar-client'
import type { Staff, LeaveDay } from './types'

// This data changes constantly (leave marked/unmarked, staff added/removed)
// so it must never be statically prerendered at build time.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()

  // Signing in isn't enough: the shared project has every staff member's
  // account, so access is the al_access list (see 20261009_al_shared_project.sql).
  const { data: hasAccess } = await supabase.rpc('has_al_access')
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <NavHeader />
          <p className="text-sm text-gray-700">
            Your account doesn&apos;t have access to the A/L Tracker. If you think it should, ask Antonio to add you.
          </p>
        </div>
      </div>
    )
  }

  const [{ data: staff, error: staffError }, { data: leaveDays, error: leaveError }] = await Promise.all([
    supabase.from('al_staff').select('*').order('team').order('sort_order').returns<Staff[]>(),
    supabase.from('al_leave_days').select('id, staff_id, leave_date').returns<LeaveDay[]>(),
  ])

  const error = staffError ?? leaveError

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <NavHeader />

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            Failed to load calendar: {error.message}
          </div>
        )}

        <CalendarClient staff={staff ?? []} leaveDays={leaveDays ?? []} />
      </div>
    </div>
  )
}
