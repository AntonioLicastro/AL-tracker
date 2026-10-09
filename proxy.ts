import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { VERIFIED_COOKIE } from '@/utils/verified-cookie'

const ALLOWED_DOMAIN = '@platinumhomecare.ie'
const PUBLIC_PATHS = ['/login', '/auth/confirm', '/auth/handoff']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (PUBLIC_PATHS.includes(path)) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const emailAllowed = Boolean(user?.email?.toLowerCase().endsWith(ALLOWED_DOMAIN))
  // Independent of the Supabase session's own lifetime — forces a fresh
  // sign-in 4 hours after the last successful verification.
  const stillVerified = request.cookies.has(VERIFIED_COOKIE)

  if (!user || !emailAllowed || !stillVerified) {
    if (user) {
      await supabase.auth.signOut()
    }
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('reason', !user ? 'signin' : !emailAllowed ? 'domain' : 'timeout')
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|logo-mobile.png).*)'],
}
