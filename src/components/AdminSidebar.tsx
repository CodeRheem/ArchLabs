'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '▪' },
  { label: 'Projects', href: '/admin/projects', icon: '▪' },
  { label: 'Properties', href: '/admin/properties', icon: '▪' },
  { label: 'Articles', href: '/admin/articles', icon: '▪' },
  { label: 'Messages', href: '/admin/messages', icon: '▪' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col">

      {/* Logo */}
      <div className="px-6 py-8 border-b border-gray-800">
        <h1 className="text-lg font-semibold tracking-tight">ArchLabs</h1>
        <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-white text-gray-900 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-6 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <span className="text-xs">▪</span>
          Logout
        </button>
      </div>

    </aside>
  )
}
