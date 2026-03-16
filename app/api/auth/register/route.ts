import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, confirmPassword } = body

    // Validate required fields
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and confirm password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existing = await prisma.admin.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Admin with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin
    const admin = await prisma.admin.create({
      data: { email, password: hashedPassword }
    })

    // Generate JWT token
    const token = signToken({ id: admin.id, email: admin.email })

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Admin registered successfully',
        admin: {
          id: admin.id,
          email: admin.email
        }
      },
      { status: 201 }
    )

    // Set secure HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
