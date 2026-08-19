'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function claimStaff(staffId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('al_staff')
    .update({ user_id: user.id })
    .eq('id', staffId)
    .is('user_id', null)

  if (error) return { error: error.message }
  revalidatePath('/')
  return { error: null }
}

export async function markLeave(staffId: string, dateIso: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('al_leave_days')
    .insert({ staff_id: staffId, leave_date: dateIso, created_by: user.id })

  if (error) return { error: error.message }
  revalidatePath('/')
  return { error: null }
}

export async function unmarkLeave(staffId: string, dateIso: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('al_leave_days')
    .delete()
    .eq('staff_id', staffId)
    .eq('leave_date', dateIso)

  if (error) return { error: error.message }
  revalidatePath('/')
  return { error: null }
}
