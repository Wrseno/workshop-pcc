import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()
    
    const registration = await prisma.registration.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(registration)
  } catch (error) {
    console.error('PATCH Error:', error)
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.registration.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 })
  }
}
