'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

// Reached via a Platinum Hub tile: the token pair arrives in the URL hash
// (never sent to the server) so we can adopt the caller's already-signed-in
// Supabase session here without a second login.
export default function AuthHandoffPage() {
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.hash.slice(1))
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')

      if (!access_token || !refresh_token) {
        setStatus('error')
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.setSession({ access_token, refresh_token })
      if (error) {
        setStatus('error')
        return
      }

      router.replace('/')
      router.refresh()
    }
    run()
  }, [router])

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center space-y-4">
          <p className="text-red-700 text-sm">
            That sign-in link is invalid or has expired. Go back to Platinum Hub and try launching A/L Tracker again, or sign in here directly.
          </p>
          <a href="/login" className="block text-sm text-blue-600 hover:underline">Go to sign in</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <p className="text-gray-500 text-sm">Signing you in…</p>
    </div>
  )
}
