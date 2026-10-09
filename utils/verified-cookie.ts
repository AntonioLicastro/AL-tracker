export const VERIFIED_COOKIE = 'al_verified'
const FOUR_HOURS_SECONDS = 4 * 60 * 60

// Stamped on the browser after a successful sign-in so the proxy can force
// re-verification 4 hours later, independent of how long the underlying
// Supabase session itself stays valid.
export function markVerified() {
  document.cookie = `${VERIFIED_COOKIE}=1; path=/; max-age=${FOUR_HOURS_SECONDS}; SameSite=Lax`
}
