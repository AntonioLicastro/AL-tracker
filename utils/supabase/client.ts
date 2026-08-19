import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// No auth, no cookies: this app has no login, so one plain client (using
// the public anon key) works the same in server and browser code.
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
