'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'

export async function getRegistrations() {
  noStore()
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: registrations }
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return { success: false, error: 'Failed to fetch registrations' }
  }
}

export async function createRegistration(data: {
  namaLengkap: string
  nim: string
  programStudi: string
  jurusan: string
  pilihanPelatihan: 'SOFTWARE' | 'NETWORK' | 'MULTIMEDIA'
  noWa: string
  buktiFollowPdfUrl: string
}) {
  try {
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    const { namaLengkap, nim, programStudi, jurusan, pilihanPelatihan, noWa, buktiFollowPdfUrl } = data

    // Check if NIM already exists
    const existingNim = await prisma.registration.findFirst({
      where: { 
        nim,
        status: { not: 'REJECT' }
      }
    })

    if (existingNim) {
      return { success: false, error: 'NIM sudah terdaftar' }
    }

    // Check if NoWA already exists
    const existingWa = await prisma.registration.findFirst({
      where: { 
        noWa,
        status: { not: 'REJECT' }
      }
    })

    if (existingWa) {
      return { success: false, error: 'Nomor WhatsApp sudah terdaftar' }
    }

    // Check quota per training type (only count PENDING and VERIFY status)
    const config = await prisma.siteConfig.findUnique({
      where: { id: 1 }
    })

    if (!config) {
      return { success: false, error: 'Site config not found' }
    }

    const trainingCount = await prisma.registration.count({
      where: {
        pilihanPelatihan: pilihanPelatihan,
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
      return { success: false, error: `Kuota pelatihan ${pilihanPelatihan} sudah penuh (${maxQuota} peserta)` }
    }

    // Create registration with PDF URL from Vercel Blob
    const registration = await prisma.registration.create({
      data: {
        namaLengkap,
        nim,
        programStudi,
        jurusan,
        pilihanPelatihan,
        noWa,
        buktiFollowPdfUrl,
        ipAddress: ip
      }
    })

    revalidatePath('/admin')
    
    // Determine WhatsApp link - Only return if verified (which is not immediately after registration usually)
    // But user asked "kalau sudah diverifikasi baru link whatsapp muncul"
    // So usually pending status won't get link immediately.
    // However, createRegistration returns registration with default status PENDING.
    
    return { success: true, data: registration }
  } catch (error) {
    console.error('Error creating registration:', error)
    return { success: false, error: 'Failed to create registration' }
  }
}

export async function updateRegistrationStatus(id: string, status: 'PENDING' | 'VERIFY' | 'REJECT') {
  try {
    const registration = await prisma.registration.update({
      where: { id },
      data: { status }
    })

    revalidatePath('/admin')
    return { success: true, data: registration }
  } catch (error) {
    console.error('Error updating registration:', error)
    return { success: false, error: 'Failed to update registration' }
  }
}

export async function deleteRegistration(id: string) {
  try {
    await prisma.registration.delete({
      where: { id }
    })
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error deleting registration:', error)
    return { success: false, error: 'Failed to delete registration' }
  }
}

export async function getQuotaInfo() {
  noStore()
  try {
    // Get site config for max quotas
    const config = await prisma.siteConfig.findUnique({
      where: { id: 1 }
    })

    if (!config) {
      return { success: false, error: 'Site config not found' }
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

    return {
      success: true,
      data: {
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
      }
    }
  } catch (error) {
    console.error('Error fetching quota:', error)
    return { success: false, error: 'Failed to fetch quota information' }
  }
}

export async function checkRegistrationByIp(ip: string) {
  noStore()
  try {
    const registration = await prisma.registration.findFirst({
      where: {
        ipAddress: ip,
        status: { not: 'REJECT' }
      }
    })

    if (!registration) return { success: true, data: null }
    
    // Check for WhatsApp link if verified
    let whatsappUrl = null;
    if (registration.status === 'VERIFY') {
      const config = await prisma.siteConfig.findUnique({ where: { id: 1 } })
      if (config) {
        if (registration.pilihanPelatihan === 'SOFTWARE') whatsappUrl = config.waLinkSoftware;
        else if (registration.pilihanPelatihan === 'NETWORK') whatsappUrl = config.waLinkNetwork;
        else if (registration.pilihanPelatihan === 'MULTIMEDIA') whatsappUrl = config.waLinkMultimedia;
      }
    }
    
    return { success: true, data: registration, whatsappUrl };
  } catch (error) {
    console.error('Error checking registration by IP:', error)
    return { success: false, error: 'Failed to check registration' }
  }
}
