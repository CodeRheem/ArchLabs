import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET as string
const TOKEN_COOKIE_NAME = 'token'

// Validate JWT_SECRET is set
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set')
}

export interface TokenPayload {
  id: string
  email: string
  iat?: number
  exp?: number
}

export function signToken(payload: { id: string; email: string }): string {
  if (!payload.id || !payload.email) {
    throw new Error('Token payload must include id and email')
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    if (!token || typeof token !== 'string') {
      return null
    }
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  // Check Authorization header first (Bearer token)
  const authHeader = req.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim()
  }

  // Fall back to cookie
  const tokenCookie = req.cookies.get(TOKEN_COOKIE_NAME)
  return tokenCookie?.value || null
}

export function isAuthenticated(req: NextRequest): TokenPayload | null {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyToken(token)
}

export function setTokenCookie(token: string, maxAge: number = 7 * 24 * 60 * 60): string {
  return `${TOKEN_COOKIE_NAME}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Strict`
}
