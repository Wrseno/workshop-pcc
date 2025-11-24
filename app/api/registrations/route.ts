import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(registrations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { namaLengkap, nim, programStudi, jurusan, pilihanPelatihan, noWa, buktiFollowPdfUrl } = body

    // Check if NIM already exists
    const existing = await prisma.registration.findUnique({
      where: { nim }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'NIM sudah terdaftar' },
        { status: 400 }
      )
    }

    // Check quota per training type (only count PENDING and VERIFY status)
    if (pilihanPelatihan) {
      const config = await prisma.siteConfig.findUnique({
        where: { id: 1 }
      })

      if (!config) {
        return NextResponse.json(
          { error: 'Site config not found' },
          { status: 500 }
        )
      }

      const trainingCount = await prisma.registration.count({
        where: {
          pilihanPelatihan: pilihanPelatihan as 'SOFTWARE' | 'NETWORK' | 'MULTIMEDIA',
          status: {
            in: ['PENDING', 'VERIFY']
          }
        }
      })

      const maxQuota = pilihanPelatihan === 'SOFTWARE' 
        ? config.maxQuotaSoftware 
        : pilihanPelatihan === 'NETWORK'
        ? config.maxQuotaNetwork
        : config.maxQuotaMultimedia

      if (trainingCount >= maxQuota) {
        return NextResponse.json(
          { error: `Kuota pelatihan ${pilihanPelatihan} sudah penuh (${maxQuota} peserta)` },
          { status: 400 }
        )
      }
    }

    // Create registration with PDF URL from Vercel Blob
    const registration = await prisma.registration.create({
      data: {
        namaLengkap,
        nim,
        programStudi,
        jurusan,
        pilihanPelatihan: pilihanPelatihan as any,
        noWa,
        buktiFollowPdfUrl
      }
    })

    return NextResponse.json(registration)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 })
  }
}
