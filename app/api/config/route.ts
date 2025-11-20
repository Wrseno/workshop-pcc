import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: 1 }
    })

    if (!config) {
      // Create default config if not exists
      const newConfig = await prisma.siteConfig.create({
        data: { id: 1 }
      })
      return NextResponse.json(newConfig)
    }

    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { mode } = await request.json()
    
    const config = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: { mode },
      create: { id: 1, mode }
    })

    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 })
  }
}
