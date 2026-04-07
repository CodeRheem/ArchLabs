import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
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
  const { id } = await params
  // Check authentication
  const authError = await requireAuth(req)
  if (authError) {
    return authError
  }

  try {
    const body = await req.json()
    
    const project = await prisma.project.update({
      where: { id },
      data: body
    })
    return NextResponse.json({ success: true, data: project })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Check authentication
  const authError = await requireAuth(req)
  if (authError) {
    return authError
  }

  try {
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Project deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
