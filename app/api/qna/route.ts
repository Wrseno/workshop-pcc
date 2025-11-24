import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mode = request.nextUrl.searchParams.get('mode')
    
    const qnaItems = await prisma.qnaItem.findMany({
      where: mode ? {
        OR: [
          { mode: null },
          { mode: mode as any }
        ]
      } : undefined,
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(qnaItems)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch QnA items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const qnaItem = await prisma.qnaItem.create({ data })
    return NextResponse.json(qnaItem)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create QnA item' }, { status: 500 })
  }
}
