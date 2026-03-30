import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from './auth'

export function withAuth(handler: Function) {
  return async (req: NextRequest, context: any) => {
    const admin = isAuthenticated(req)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized — please log in' },
        { status: 401 }
      )
    }
    return handler(req, context, admin)
  }
}
