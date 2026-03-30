import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: articles })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  // Check authentication
  const authError = await requireAuth(req)
  if (authError) {
    return authError
  }

  try {
    const body = await req.json()
    
    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content', 'author', 'coverImage']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Only allow specific fields
    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author,
        coverImage: body.coverImage,
        status: body.status || 'draft'
      }
    })
    return NextResponse.json({ success: true, data: article }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
