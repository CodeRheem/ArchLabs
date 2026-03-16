import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const property = await prisma.property.findUnique({
      where: { id }
    })
    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: property })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    
    // Check if property exists
    const propertyExists = await prisma.property.findUnique({
      where: { id }
    })
    if (!propertyExists) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 })
    }

    // Only allow specific fields to be updated
    const updateData: any = {}
    const allowedFields = ['title', 'type', 'price', 'location', 'bedrooms', 'bathrooms', 'area', 'images', 'coverImage', 'description', 'status', 'featured']
    
    for (const field of allowedFields) {
      if (field in body) {
        // Type conversion for numeric fields
        if (['price', 'area'].includes(field)) {
          updateData[field] = parseFloat(body[field])
        } else if (['bedrooms', 'bathrooms'].includes(field)) {
          updateData[field] = parseInt(body[field])
        } else {
          updateData[field] = body[field]
        }
      }
    }

    const property = await prisma.property.update({
      where: { id },
      data: updateData
    })
    return NextResponse.json({ success: true, data: property })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Check if property exists
    const propertyExists = await prisma.property.findUnique({
      where: { id }
    })
    if (!propertyExists) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 })
    }

    await prisma.property.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Property deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
