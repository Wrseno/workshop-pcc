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

    // Count active registrations per training type
    const counts = await prisma.registration.groupBy({
      by: ['pilihanPelatihan'],
      where: {
        status: {
          in: ['PENDING', 'VERIFY']
        }
      },
      _count: {
        pilihanPelatihan: true
      }
    })

    const softwareCount = counts.find(c => c.pilihanPelatihan === 'SOFTWARE')?._count.pilihanPelatihan ?? 0
    const networkCount = counts.find(c => c.pilihanPelatihan === 'NETWORK')?._count.pilihanPelatihan ?? 0
    const multimediaCount = counts.find(c => c.pilihanPelatihan === 'MULTIMEDIA')?._count.pilihanPelatihan ?? 0

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
