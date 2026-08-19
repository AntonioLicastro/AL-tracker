import { LayoutGrid } from 'lucide-react'
import LogoutButton from './logout-button'

export default function NavHeader() {
  return (
    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="A/L Tracker" className="h-[73px] w-auto" />
      </div>
      <div className="flex gap-2">
        <a href="https://platinum-hub.vercel.app" className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-200 transition">
          <LayoutGrid size={16} /> Platinum Hub
        </a>
        <LogoutButton />
      </div>
    </div>
  )
}
