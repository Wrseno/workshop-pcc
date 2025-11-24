import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Fetching config from database...')
    const config = await prisma.siteConfig.findUnique({
      where: { id: 1 }
    })

    console.log('Config found:', config)

    if (!config) {
      console.log('No config found, creating default...')
      // Create default config if not exists
      const newConfig = await prisma.siteConfig.create({
        data: { id: 1 }
      })
      console.log('Default config created:', newConfig)
      return NextResponse.json(newConfig)
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching config:', error)
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
