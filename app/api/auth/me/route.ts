import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const admin = isAuthenticated(req)
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  return NextResponse.json({ success: true, data: admin })
}
