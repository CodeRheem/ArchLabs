import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/middleware'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id }
    })
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: project })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export const PUT = withAuth(async (req: NextRequest, context: any, admin: any) => {
  try {
    const { params } = context
    const body = await req.json()
    
    const project = await prisma.project.update({
      where: { id: params.id },
      data: body
    })
    return NextResponse.json({ success: true, data: project })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest, context: any, admin: any) => {
  try {
    const { params } = context
    
    await prisma.project.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: 'Project deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
})
