'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { ProjectType } from '@/types'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null)
  const [form, setForm] = useState({
    title: '', category: '', description: '',
    location: '', year: new Date().getFullYear(),
    coverImage: '', featured: false, status: 'draft'
  })

  useEffect(() => { fetchProjects() }, [])

  async function fetchProjects() {
    const res = await fetch('/api/projects/all')
    const data = await res.json()
    if (data.success) setProjects(data.data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects'
    const method = editingProject ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.success) {
      fetchProjects()
      setShowForm(false)
      setEditingProject(null)
      setForm({ title: '', category: '', description: '', location: '', year: new Date().getFullYear(), coverImage: '', featured: false, status: 'draft' })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    fetchProjects()
  }

  function handleEdit(project: ProjectType) {
    setEditingProject(project)
    setForm({
      title: project.title, category: project.category,
      description: project.description, location: project.location,
      year: project.year, coverImage: project.coverImage, featured: project.featured, status: project.status
    })
    setShowForm(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
            <p className="text-sm text-gray-500 mt-1">{projects.length} total</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingProject(null) }}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            + Add Project
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="text-base font-medium text-gray-900 mb-5">
              {editingProject ? 'Edit Project' : 'New Project'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={form.title} onChange={e => setForm({...form, title: e.target.value})} required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={form.category} onChange={e => setForm({...form, category: e.target.value})} required
                >
                  <option value="">Select category</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Mixed Use">Mixed Use</option>
                  <option value="Interior">Interior</option>
                  <option value="Landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Location</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={form.location} onChange={e => setForm({...form, location: e.target.value})} required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Year</label>
                <input
                  type="number" min="2000" max="2030"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={form.year} onChange={e => setForm({...form, year: Number(e.target.value)})} required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cover Image URL</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})} required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Featured</label>
                <input
                  type="checkbox"
                  className="w-4 h-4 border border-gray-200 rounded"
                  checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} required
                />
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="submit" className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  {editingProject ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingProject(null) }}
                  className="border border-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Table */}
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-500 text-sm">No projects yet. Add your first one!</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Title</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Category</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Location</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Year</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, i) => (
                  <tr key={project.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3 font-medium text-gray-900">{project.title}</td>
                    <td className="px-5 py-3 text-gray-600">{project.category}</td>
                    <td className="px-5 py-3 text-gray-600">{project.location}</td>
                    <td className="px-5 py-3 text-gray-600">{project.year}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        project.status === 'published'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}>{project.status}</span>
                    </td>
                    <td className="px-5 py-3 flex gap-3">
                      <button onClick={() => handleEdit(project)} className="text-blue-600 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
