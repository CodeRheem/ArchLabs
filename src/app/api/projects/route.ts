import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'

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

export const POST = withAuth(async (req: NextRequest, context: any, admin: any) => {
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
})
