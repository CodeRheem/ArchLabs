import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const article = await prisma.article.findUnique({
      where: { id }
    })
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: article })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    
    // Check if article exists
    const articleExists = await prisma.article.findUnique({
      where: { id }
    })
    if (!articleExists) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }

    // Only allow specific fields to be updated
    const updateData: any = {}
    const allowedFields = ['title', 'excerpt', 'content', 'author', 'coverImage', 'status']
    
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData
    })
    return NextResponse.json({ success: true, data: article })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Check if article exists
    const articleExists = await prisma.article.findUnique({
      where: { id }
    })
    if (!articleExists) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }

    await prisma.article.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Article deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
