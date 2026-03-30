import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: projects })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  console.log('[POST /api/projects] Handler called')
  // Check authentication
  const authError = await requireAuth(req)
  console.log('[POST /api/projects] Auth result:', !!authError)
  if (authError) {
    console.log('[POST /api/projects] Returning 401')
    return authError
  }

  try {
    const body = await req.json()
    
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const project = await prisma.project.create({
      data: { ...body, slug }
    })
    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
