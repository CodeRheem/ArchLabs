import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const properties = await prisma.property.findMany({
      where: {
        ...(type && { type }),
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: properties })
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
    const requiredFields = ['title', 'type', 'price', 'location', 'bedrooms', 'bathrooms', 'area', 'coverImage']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Only allow specific fields
    const property = await prisma.property.create({
      data: {
        title: body.title,
        type: body.type,
        price: parseFloat(body.price),
        location: body.location,
        bedrooms: parseInt(body.bedrooms),
        bathrooms: parseInt(body.bathrooms),
        area: parseFloat(body.area),
        images: body.images || [],
        coverImage: body.coverImage,
        description: body.description || '',
        status: body.status || 'available',
        featured: body.featured || false,
      }
    })
    return NextResponse.json({ success: true, data: property }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
