import { NextResponse, type NextRequest } from 'next/server'

// Only two people should ever see this: no accounts, just one shared
// password gate (browser's built-in Basic Auth prompt) rather than a
// full login system.
export function proxy(request: NextRequest) {
  const expectedUser = process.env.BASIC_AUTH_USER
  const expectedPass = process.env.BASIC_AUTH_PASSWORD

  const auth = request.headers.get('authorization')
  if (auth?.startsWith('Basic ')) {
    const [user, pass] = atob(auth.slice(6)).split(':')
    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="A/L Tracker"' },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
