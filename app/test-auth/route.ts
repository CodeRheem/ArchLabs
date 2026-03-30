import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getTokenFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const admin = isAuthenticated(req)
  
  return NextResponse.json({ 
    token: token ? "present" : "missing",
    authenticated: !!admin,
    admin: admin 
  })
}
