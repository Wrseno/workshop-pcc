import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get site config for max quotas
    const config = await prisma.siteConfig.findUnique({
      where: { id: 1 }
    })

    if (!config) {
      return NextResponse.json(
        { error: 'Site config not found' },
        { status: 404 }
      )
    }

    // Count active registrations per training type using separate queries
    const softwareCount = await prisma.registration.count({
      where: {
        status: { in: ['PENDING', 'VERIFY'] },
        pilihanPelatihan: 'SOFTWARE'
      }
    })

    const networkCount = await prisma.registration.count({
      where: {
        status: { in: ['PENDING', 'VERIFY'] },
        pilihanPelatihan: 'NETWORK'
      }
    })

    const multimediaCount = await prisma.registration.count({
      where: {
        status: { in: ['PENDING', 'VERIFY'] },
        pilihanPelatihan: 'MULTIMEDIA'
      }
    })

    return NextResponse.json({
      software: {
        current: softwareCount,
        max: config.maxQuotaSoftware,
        full: softwareCount >= config.maxQuotaSoftware
      },
      network: {
        current: networkCount,
        max: config.maxQuotaNetwork,
        full: networkCount >= config.maxQuotaNetwork
      },
      multimedia: {
        current: multimediaCount,
        max: config.maxQuotaMultimedia,
        full: multimediaCount >= config.maxQuotaMultimedia
      }
    })
  } catch (error) {
    console.error('Error fetching quota:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quota information' },
      { status: 500 }
    )
  }
}
