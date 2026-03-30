import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(req: NextRequest) {
  // Check authentication
  const authError = await requireAuth(req)
  if (authError) {
    return authError
  }

  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to prevent excessive data loads
    })
    return NextResponse.json({ success: true, data: messages })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email and message are required' },
        { status: 400 }
      )
    }

    // Validate field types and lengths
    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name must be between 1 and 100 characters' },
        { status: 400 }
      )
    }

    if (typeof email !== 'string' || !emailRegex.test(email) || email.length > 255) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    if (typeof message !== 'string' || message.trim().length === 0 || message.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Message must be between 1 and 5000 characters' },
        { status: 400 }
      )
    }

    // Check for duplicate submissions (same email + message within last 5 minutes)
    const recentMessage = await prisma.message.findFirst({
      where: {
        email: email.toLowerCase(),
        message: message.trim(),
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        }
      }
    })

    if (recentMessage) {
      return NextResponse.json(
        { success: false, error: 'Please wait before sending another message' },
        { status: 429 }
      )
    }

    const newMessage = await prisma.message.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        message: message.trim()
      }
    })
    return NextResponse.json({ success: true, data: newMessage }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
