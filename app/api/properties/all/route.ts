import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

export async function GET(req: NextRequest) {
  // Admin only - require authentication
  const authError = await requireAuth(req)
  if (authError) {
    return authError
  }

  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(properties)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
