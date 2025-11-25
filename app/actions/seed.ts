'use server'

import { prisma } from '@/lib/prisma'

export async function seedDatabase(secret: string) {
  try {
    // Simple protection - pastikan ada secret key
    if (secret !== process.env.SEED_SECRET) {
      return { success: false, error: 'Unauthorized' }
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

    return { 
      success: true, 
      message: 'Seed completed. Please add team members, sponsors, and QnA via admin panel.' 
    }
  } catch (error) {
    console.error('Seed error:', error)
    return { 
      success: false,
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
