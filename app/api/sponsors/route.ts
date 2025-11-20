import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(sponsors)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const sponsor = await prisma.sponsor.create({ data })
    return NextResponse.json(sponsor)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 })
  }
}
