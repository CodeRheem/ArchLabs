'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'

type Stats = {
  projects: number
  properties: number
  articles: number
  messages: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    properties: 0,
    articles: 0,
    messages: 0
  })

  useEffect(() => {
    async function fetchStats() {
      const [projects, properties, articles] = await Promise.all([
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/properties').then(r => r.json()),
        fetch('/api/articles').then(r => r.json()),
      ])
      setStats({
        projects: projects.data?.length || 0,
        properties: properties.data?.length || 0,
        articles: articles.data?.length || 0,
        messages: 0
      })
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Projects', value: stats.projects, href: '/admin/projects' },
    { label: 'Properties', value: stats.properties, href: '/admin/properties' },
    { label: 'Articles', value: stats.articles, href: '/admin/articles' },
    { label: 'Messages', value: stats.messages, href: '/admin/messages' },
  ]

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome back to ArchLabs admin</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors"
            >
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{card.value}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
