import LogoutButton from './logout-button'

export default function NavHeader() {
  return (
    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="A/L Tracker" className="h-[73px] w-auto" />
      </div>
      <LogoutButton />
    </div>
  )
}
