import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const sponsor = await prisma.sponsor.update({
      where: { id },
      data
    })
    return NextResponse.json(sponsor)
  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.sponsor.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 })
  }
}
