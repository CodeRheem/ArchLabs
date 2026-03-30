import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from './auth'

export async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
  const admin = isAuthenticated(req)
  console.log('[AUTH CHECK]', { hasAdmin: !!admin })
  if (!admin) {
    console.log('[AUTH DENIED]')
    return NextResponse.json(
      { success: false, error: 'Unauthorized — please log in' },
      { status: 401 }
    )
  }
  console.log('[AUTH ALLOWED]')
  return null
}
