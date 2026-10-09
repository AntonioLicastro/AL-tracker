'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { markVerified } from '@/utils/verified-cookie'

const ALLOWED_DOMAIN = '@platinumhomecare.ie'

const REASON_MESSAGES: Record<string, string> = {
  domain: `Access is restricted to ${ALLOWED_DOMAIN} accounts.`,
  timeout: 'Your session expired after 4 hours. Please sign in again.',
  signin: 'Please sign in to continue.',
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')

    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
      setError(`Sign-in is restricted to ${ALLOWED_DOMAIN} email addresses.`)
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: { full_name: fullName },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setInfo('Check your email for a sign-in link, or enter the 8-digit code from that email below.')
      setCodeSent(true)
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      markVerified()
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <img src="/logo.png" alt="Platinum Home Care" className="h-[120px] w-auto mx-auto mb-0" />

        <p className="text-gray-600 text-sm mb-6">Staff Sign-In</p>

        {reason && REASON_MESSAGES[reason] && !error && !info && (
          <div className="bg-amber-100 text-amber-800 p-3 rounded mb-4 text-sm">{REASON_MESSAGES[reason]}</div>
        )}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        {info && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{info}</div>}

        {!codeSent ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded mt-1"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Only needed the first time you sign in.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                placeholder={`you${ALLOWED_DOMAIN}`}
                className="w-full border p-2 rounded mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
            >
              {loading ? 'Sending...' : 'Send me a login link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700">8-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                placeholder="12345678"
                className="w-full border p-2 rounded mt-1 tracking-widest text-center"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
            >
              {loading ? 'Verifying...' : 'Verify code'}
            </button>
            <button
              type="button"
              onClick={() => { setCodeSent(false); setError(''); setInfo('') }}
              className="w-full text-sm text-blue-600 hover:underline"
            >
              Use a different email
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-xs italic text-gray-400">Developed by Antonio Licastro</p>
      </div>
    </div>
  )
}
