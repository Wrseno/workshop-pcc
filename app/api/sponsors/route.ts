import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Fetching sponsors...')
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { order: 'asc' }
    })
    console.log('Sponsors found:', sponsors.length)
    return NextResponse.json(sponsors)
  } catch (error) {
    console.error('Error fetching sponsors:', error)
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
