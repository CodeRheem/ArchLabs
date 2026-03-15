import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'

// GET /api/projects — fetch all published projects
export async function GET() {
  try {
    await connectDB()
    const projects = await Project.find({ status: 'published' }).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects — create a new project
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    // Auto-generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const project = await Project.create({ ...body, slug })
    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 })
  }
}