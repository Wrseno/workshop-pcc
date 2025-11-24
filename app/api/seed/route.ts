import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    
    // Simple protection - pastikan ada secret key
    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting seed...')

    // Create default site config
    const config = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        mode: 'TRAINING_BASIC',
        maxQuotaSoftware: 35,
        maxQuotaNetwork: 35,
        maxQuotaMultimedia: 35
      }
    })
    console.log('Config created:', config)

    // Seed akan dijalankan manual via API call ini
    // Data team, sponsor, qna bisa ditambahkan manual via admin panel

    return NextResponse.json({ 
      success: true, 
      message: 'Seed completed. Please add team members, sponsors, and QnA via admin panel.' 
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ 
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
