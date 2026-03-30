import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id }
    })
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: project })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(req)
  if (authError) {
    return authError
  }

  try {
    const { id } = await params
    const body = await req.json()
    
    // Check if project exists
    const projectExists = await prisma.project.findUnique({
      where: { id }
    })
    if (!projectExists) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    // Only allow updating specific fields
    const updateData: any = {}
    const allowedFields = ['title', 'category', 'description', 'location', 'year', 'images', 'coverImage', 'featured', 'status']
    
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    // Generate slug from title if title is being updated
    if (body.title) {
      updateData.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData
    })
    return NextResponse.json({ success: true, data: project })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(req)
  if (authError) {
    return authError
  }

  try {
    const { id } = await params
    await prisma.project.delete({
      where: { id }
    })
    return NextResponse.json({ success: true, message: 'Project deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
