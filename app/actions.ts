'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/client'

export async function markLeave(staffId: string, dateIso: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('al_leave_days')
    .insert({ staff_id: staffId, leave_date: dateIso })

  if (error) return { error: error.message }
  revalidatePath('/')
  return { error: null }
}

export async function unmarkLeave(staffId: string, dateIso: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('al_leave_days')
    .delete()
    .eq('staff_id', staffId)
    .eq('leave_date', dateIso)

  if (error) return { error: error.message }
  revalidatePath('/')
  return { error: null }
}
