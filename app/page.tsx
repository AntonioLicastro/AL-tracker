import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import NavHeader from './nav-header'
import CalendarClient from './calendar-client'
import type { Staff, LeaveDay } from './types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
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

        <CalendarClient staff={staff ?? []} leaveDays={leaveDays ?? []} currentUserId={user.id} />
      </div>
    </div>
  )
}
